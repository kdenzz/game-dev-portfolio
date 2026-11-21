// Courier Run — canvas renderer. Draws everything from simple shapes in the site palette.
import { PLAYER, WORLD, playerBox } from "./engine.js";

const COLORS = {
  ink: "#10110f",
  inkRaised: "#181a17",
  inkSoft: "#20231f",
  paper: "#f1f0e9",
  muted: "#9a9d92",
  line: "rgba(241, 240, 233, 0.07)",
  acid: "#cbff4d",
  orange: "#ff744d",
};
const MONO = '"DM Mono", "SFMono-Regular", Consolas, monospace';
const GY = WORLD.groundY;

// Deterministic skyline, generated once and tiled for parallax.
const SKYLINE_WIDTH = 960;
const skyline = (() => {
  const buildings = [];
  let x = 0;
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  while (x < SKYLINE_WIDTH) {
    const w = 40 + rand() * 70;
    const h = 40 + rand() * 110;
    const windows = [];
    for (let wy = 10; wy < h - 10; wy += 14) {
      for (let wx = 8; wx < w - 8; wx += 12) if (rand() < 0.18) windows.push([wx, wy]);
    }
    buildings.push({ x, w, h, windows });
    x += w + 6 + rand() * 18;
  }
  return buildings;
})();

const toScreenY = (y, h) => GY - y - h; // engine y (up from ground) -> canvas y of top edge

function drawBackground(ctx, distance) {
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  // Grid, drifting slowly like the site background.
  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 1;
  const cell = 40;
  const off = (distance * 0.15) % cell;
  ctx.beginPath();
  for (let x = -off; x < WORLD.width; x += cell) {
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, GY);
  }
  for (let y = 0; y < GY; y += cell) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(WORLD.width, y + 0.5);
  }
  ctx.stroke();

  // Parallax skyline.
  const sx = (distance * 0.3) % SKYLINE_WIDTH;
  for (let tile = -1; tile <= 1; tile += 1) {
    for (const b of skyline) {
      const x = b.x - sx + tile * SKYLINE_WIDTH;
      if (x + b.w < 0 || x > WORLD.width) continue;
      ctx.fillStyle = COLORS.inkRaised;
      ctx.fillRect(x, GY - b.h, b.w, b.h);
      ctx.fillStyle = "rgba(203, 255, 77, 0.22)";
      for (const [wx, wy] of b.windows) ctx.fillRect(x + wx, GY - b.h + wy, 4, 4);
    }
  }

  // Ground line and moving dashes.
  ctx.fillStyle = COLORS.acid;
  ctx.fillRect(0, GY, WORLD.width, 2);
  ctx.fillStyle = "rgba(241, 240, 233, 0.18)";
  const dashOff = distance % 48;
  for (let x = -dashOff; x < WORLD.width; x += 48) ctx.fillRect(x, GY + 12, 18, 2);
  for (let x = -(distance * 1.3) % 90; x < WORLD.width; x += 90) ctx.fillRect(x + 30, GY + 26, 8, 2);
}

function drawPlayer(ctx, state) {
  const p = state.player;
  const box = playerBox(p);
  const x = PLAYER.x;
  const top = toScreenY(box.y, box.h);
  const ducking = p.ducking && p.grounded;
  const frame = Math.floor(state.distance / 26) % 2;

  if (ducking) {
    // Sliding pose: low body, parcel on the back.
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(x, top + 8, box.w, box.h - 12);
    ctx.fillStyle = COLORS.acid;
    ctx.fillRect(x + box.w - 14, top + 11, 10, 5); // visor
    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(x + 2, top, 16, 10); // parcel
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(x + 4, top + box.h - 4, 14, 4);
    ctx.fillRect(x + 24, top + box.h - 4, 14, 4);
    return;
  }

  // Head + visor.
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(x + 8, top, 20, 16);
  ctx.fillStyle = COLORS.acid;
  ctx.fillRect(x + 16, top + 5, 12, 5);
  // Torso.
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(x + 6, top + 17, 20, 17);
  // Parcel backpack.
  ctx.fillStyle = COLORS.orange;
  ctx.fillRect(x - 4, top + 15, 12, 14);
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(x + 1, top + 15, 2, 14);
  // Legs: alternate while running, tucked while airborne.
  ctx.fillStyle = COLORS.paper;
  if (!p.grounded) {
    ctx.fillRect(x + 8, top + 34, 7, 10);
    ctx.fillRect(x + 18, top + 34, 7, 8);
  } else if (frame === 0) {
    ctx.fillRect(x + 7, top + 34, 6, 14);
    ctx.fillRect(x + 19, top + 34, 6, 10);
  } else {
    ctx.fillRect(x + 7, top + 34, 6, 10);
    ctx.fillRect(x + 19, top + 34, 6, 14);
  }
}

function drawBlock(ctx, o) {
  const top = toScreenY(o.y, o.h);
  ctx.fillStyle = COLORS.inkSoft;
  ctx.fillRect(o.x, top, o.w, o.h);
  ctx.strokeStyle = COLORS.orange;
  ctx.lineWidth = 2;
  for (let cx = 0; cx < o.w; cx += 20) ctx.strokeRect(o.x + cx + 1, top + 1, 18, o.h - 2);
  // Glitch stripes.
  ctx.fillStyle = "rgba(255, 116, 77, 0.55)";
  for (let y = top + 6; y < GY - 4; y += 8) ctx.fillRect(o.x + 4, y, o.w - 8, 2);
}

function drawDrone(ctx, o, time) {
  const top = toScreenY(o.y, o.h) + Math.sin(time * 9 + o.phase) * 2;
  ctx.fillStyle = COLORS.acid;
  ctx.fillRect(o.x + 6, top + 6, o.w - 12, o.h - 8);
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(o.x + 12, top + 10, 6, 4); // eye
  // Rotors flicker between two widths.
  ctx.fillStyle = COLORS.paper;
  const blade = Math.floor(time * 30) % 2 ? 16 : 10;
  ctx.fillRect(o.x + 10 - blade / 2, top, blade, 2);
  ctx.fillRect(o.x + o.w - 10 - blade / 2, top, blade, 2);
  ctx.fillRect(o.x + 9, top + 2, 2, 4);
  ctx.fillRect(o.x + o.w - 11, top + 2, 2, 4);
}

function drawHud(ctx, state, best) {
  ctx.font = `500 13px ${MONO}`;
  ctx.textBaseline = "top";
  ctx.textAlign = "right";
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(`BEST ${String(Math.floor(best)).padStart(5, "0")}`, WORLD.width - 118, 16);
  ctx.fillStyle = COLORS.paper;
  ctx.fillText(`XP ${String(Math.floor(state.score)).padStart(5, "0")}`, WORLD.width - 20, 16);

  if (state.checkpointFlash > 0) {
    const alpha = Math.min(1, state.checkpointFlash / 0.3);
    ctx.globalAlpha = alpha;
    ctx.textAlign = "left";
    ctx.fillStyle = COLORS.acid;
    ctx.fillRect(20, 14, 8, 8);
    ctx.fillText(`CHECKPOINT ${state.lastCheckpoint} REACHED`, 36, 13);
    ctx.globalAlpha = 1;
  }
}

/** Draw one frame. `scale` maps world units to canvas pixels (includes devicePixelRatio). */
export function render(ctx, state, best, scale) {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  drawBackground(ctx, state.distance);
  for (const o of state.obstacles) {
    if (o.kind === "block") drawBlock(ctx, o);
    else drawDrone(ctx, o, state.time);
  }
  drawPlayer(ctx, state);
  drawHud(ctx, state, best);
}
