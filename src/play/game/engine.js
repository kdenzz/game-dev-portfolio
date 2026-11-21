// Courier Run — pure game logic. No DOM access, so it can be simulated and tested headlessly.
// Coordinates: x grows to the right, y is height above the ground line (grows upward).

export const WORLD = { width: 800, height: 260, groundY: 220 };

export const PLAYER = {
  x: 80,
  stand: { w: 30, h: 48 },
  duck: { w: 44, h: 26 },
};

export const PHYSICS = {
  gravity: 2600, // px/s²
  fastFallMultiplier: 3, // holding duck mid-air drops you faster
  jumpVelocity: 860, // px/s  -> full jump apex ≈ 142px, airtime ≈ 0.66s
  jumpCutVelocity: 300, // releasing jump early caps upward speed here...
  minJumpHold: 0.08, // ...but only after this long, so taps still clear small blocks
  jumpBuffer: 0.12, // a jump pressed this soon before landing still fires
};

export const SPEED = { start: 360, max: 820, accel: 9 }; // px/s, px/s²
export const SCORE_PER_PX = 0.025;
export const CHECKPOINT_EVERY = 100;
export const DRONES_FROM_SCORE = 300;

const HITBOX_INSET = { player: 4, obstacle: 3 };

// Drone altitudes (bottom edge above ground). "mid" forces a duck or a big jump;
// "high" can be run under but punishes a careless jump.
const DRONE_ALTITUDES = { mid: 36, high: 74 };

/** Small seeded PRNG (mulberry32) so runs are reproducible in tests. */
export function createRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createState(seed = Math.floor(Math.random() * 2 ** 32)) {
  return {
    rng: createRng(seed),
    time: 0,
    distance: 0,
    speed: SPEED.start,
    score: 0,
    over: false,
    player: { y: 0, vy: 0, grounded: true, ducking: false, airTime: 0, jumpBufferLeft: 0 },
    obstacles: [],
    nextSpawnIn: 420, // px of travel before the first obstacle
    lastCheckpoint: 0,
    checkpointFlash: 0, // seconds remaining on the "checkpoint" banner
    obstaclesCleared: 0,
  };
}

export function playerBox(player) {
  const size = player.ducking && player.grounded ? PLAYER.duck : PLAYER.stand;
  return { x: PLAYER.x, y: player.y, w: size.w, h: size.h };
}

function overlaps(a, b, insetA, insetB) {
  return (
    a.x + insetA < b.x + b.w - insetB &&
    a.x + a.w - insetA > b.x + insetB &&
    a.y + insetA < b.y + b.h - insetB &&
    a.y + a.h - insetA > b.y + insetB
  );
}

function spawnObstacle(state) {
  const { rng } = state;
  const dronesAllowed = state.score >= DRONES_FROM_SCORE;

  if (dronesAllowed && rng() < 0.3) {
    const altitude = rng() < 0.6 ? DRONE_ALTITUDES.mid : DRONE_ALTITUDES.high;
    state.obstacles.push({ kind: "drone", x: WORLD.width + 20, y: altitude, w: 42, h: 18, phase: rng() * Math.PI * 2 });
    return;
  }

  // Ground "glitch blocks": 1–3 cubes wide, short or tall. Bigger stacks appear as speed rises.
  const maxCubes = state.speed > 560 ? 3 : 2;
  const cubes = 1 + Math.floor(rng() * maxCubes);
  const tall = rng() < 0.4;
  const cube = 20;
  state.obstacles.push({ kind: "block", x: WORLD.width + 20, y: 0, w: cubes * cube, h: tall ? 52 : 32 });
}

/** Distance (px) to travel before the next spawn. Always leaves room to land and jump again. */
function nextGap(state) {
  const airtime = (2 * PHYSICS.jumpVelocity) / PHYSICS.gravity;
  const minGap = state.speed * airtime + 120;
  return minGap * (1 + state.rng() * 0.9);
}

/**
 * Advance the simulation by dt seconds.
 * input = { jumpHeld, jumpPressed, duckHeld } — jumpPressed is an edge (true for one step).
 */
export function step(state, input, dt) {
  if (state.over) return state;
  const p = state.player;

  state.time += dt;
  state.speed = Math.min(SPEED.max, state.speed + SPEED.accel * dt);
  const dx = state.speed * dt;
  state.distance += dx;

  // --- Score & checkpoints
  state.score = state.distance * SCORE_PER_PX;
  const checkpoint = Math.floor(state.score / CHECKPOINT_EVERY) * CHECKPOINT_EVERY;
  if (checkpoint > state.lastCheckpoint) {
    state.lastCheckpoint = checkpoint;
    state.checkpointFlash = 1.2;
  }
  state.checkpointFlash = Math.max(0, state.checkpointFlash - dt);

  // --- Player
  if (input.jumpPressed) p.jumpBufferLeft = PHYSICS.jumpBuffer;
  else p.jumpBufferLeft = Math.max(0, p.jumpBufferLeft - dt);

  p.ducking = input.duckHeld;

  if (p.grounded && p.jumpBufferLeft > 0 && !p.ducking) {
    p.vy = PHYSICS.jumpVelocity;
    p.grounded = false;
    p.airTime = 0;
    p.jumpBufferLeft = 0;
  }

  if (!p.grounded) {
    p.airTime += dt;
    if (!input.jumpHeld && p.airTime >= PHYSICS.minJumpHold && p.vy > PHYSICS.jumpCutVelocity) {
      p.vy = PHYSICS.jumpCutVelocity;
    }
    const g = PHYSICS.gravity * (input.duckHeld ? PHYSICS.fastFallMultiplier : 1);
    p.vy -= g * dt;
    p.y += p.vy * dt;
    if (p.y <= 0) {
      p.y = 0;
      p.vy = 0;
      p.grounded = true;
    }
  }

  // --- Obstacles
  state.nextSpawnIn -= dx;
  if (state.nextSpawnIn <= 0) {
    spawnObstacle(state);
    state.nextSpawnIn = nextGap(state);
  }

  const box = playerBox(p);
  for (const o of state.obstacles) {
    o.x -= dx;
    if (!o.passed && o.x + o.w < PLAYER.x) {
      o.passed = true;
      state.obstaclesCleared += 1;
    }
    if (overlaps(box, o, HITBOX_INSET.player, HITBOX_INSET.obstacle)) {
      state.over = true;
    }
  }
  state.obstacles = state.obstacles.filter((o) => o.x + o.w > -40);

  return state;
}
