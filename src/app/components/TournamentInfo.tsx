import { FadeInView } from "./ui/FadeInView";
import { SectionHeader } from "./ui/SectionHeader";
import { RulesGrid } from "./info/RulesGrid";
import { VenueBanner } from "./info/VenueBanner";

export function TournamentInfo() {
  return (
    <section id="info" className="py-20 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <FadeInView>
          <SectionHeader eyebrow="Thông tin giải đấu" title="Thể lệ & Quy định" />
        </FadeInView>

        <RulesGrid />
        <VenueBanner />
      </div>
    </section>
  );
}
