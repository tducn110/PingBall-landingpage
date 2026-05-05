import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TournamentInfo } from "./components/TournamentInfo";
import { TournamentFormat } from "./components/TournamentFormat";
import { Standings } from "./components/Standings";
import { RegistrationCTA } from "./components/RegistrationCTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <TournamentInfo />
      <TournamentFormat />
      <Standings />
      <RegistrationCTA />
      <Footer />
    </div>
  );
}