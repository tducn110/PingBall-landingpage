import { useState, startTransition } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Prizes } from "./components/Prizes";
import { TournamentInfo } from "./components/TournamentInfo";
import { TournamentFormat } from "./components/TournamentFormat";
import { Standings } from "./components/Standings";
import { RegistrationCTA } from "./components/RegistrationCTA";
import { Footer } from "./components/Footer";
import { PageIntro } from "./components/PageIntro";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {/* Main site — always visible, poster overlay sits on top */}
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <Hero />
        <Prizes />
        <TournamentInfo />
        <TournamentFormat />
        <Standings />
        <RegistrationCTA />
        <Footer />
      </div>

      {/* Poster overlay — renders on top, unmounts itself after animation */}
      {!introComplete && <PageIntro onDone={() => startTransition(() => setIntroComplete(true))} />}
    </>
  );
}