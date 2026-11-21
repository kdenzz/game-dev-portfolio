import { questZones } from "./data.js";
import { useQuest } from "./hooks/useQuest.js";
import Header from "./components/Header.jsx";
import QuestHud from "./components/QuestHud.jsx";
import CheckpointToast from "./components/CheckpointToast.jsx";
import Hero from "./components/Hero.jsx";
import ProofStrip from "./components/ProofStrip.jsx";
import Work from "./components/Work.jsx";
import About from "./components/About.jsx";
import Toolkit from "./components/Toolkit.jsx";
import SideQuest from "./components/SideQuest.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const { activeIndex, xp, awardXp, toast, toastVisible } = useQuest(questZones);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <QuestHud zones={questZones} activeIndex={activeIndex} xp={xp} />
      <CheckpointToast toast={toast} visible={toastVisible} />

      <main id="main">
        <Hero />
        <ProofStrip />
        <Work onProjectDiscovered={() => awardXp(25)} />
        <About />
        <Toolkit />
        <SideQuest />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
