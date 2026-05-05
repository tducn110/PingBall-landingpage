import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import posterSrc from "../../imports/Poster.png";

// ── Config ────────────────────────────────────────────────────────────────────
const POSTER_H = 520;                         // bigger = fewer cards on screen
const POSTER_ASPECT = 1414 / 2000;
const POSTER_W = Math.round(POSTER_H * POSTER_ASPECT); // ~368px

const INTRO_HOLD_MS = 900;  // hold before falling
const STAGGER_MS    = 60;   // ms between column waves
const FALL_DURATION = 0.65; // seconds each card takes to fall

// ── Types ─────────────────────────────────────────────────────────────────────
interface PosterCard {
  id: number;
  col: number;
  row: number;
  delay: number;
  tilt: number;
  scale: number;
}

function buildWall(vw: number, vh: number): PosterCard[] {
  const cols = Math.ceil(vw / POSTER_W) + 1;
  const rows = Math.ceil(vh / POSTER_H) + 1;
  const cards: PosterCard[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = row * cols + col;
      cards.push({
        id,
        col,
        row,
        delay: (col + row * 0.35) * STAGGER_MS,
        tilt: ((id * 31) % 9) - 4,
        scale: 0.94 + ((id * 17) % 12) / 100,
      });
    }
  }
  return cards;
}

// ── Single poster card ─────────────────────────────────────────────────────────
function PosterCard({ card, falling, vh }: { card: PosterCard; falling: boolean; vh: number }) {
  const driftX = ((card.id * 53) % 60) - 30;
  const spinDir = card.id % 2 === 0 ? 1 : -1;
  const finalRotate = card.tilt + (falling ? spinDir * ((card.id * 7) % 6 + 2) : 0);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: card.col * POSTER_W,
        top: card.row * POSTER_H,
        width: POSTER_W,
        height: POSTER_H,
        padding: 3,
        willChange: "transform",
      }}
      animate={
        falling
          ? {
              y: vh * 1.5 + card.row * 40,  // bottom rows fall a bit further
              x: driftX,
              rotate: finalRotate,
            }
          : { y: 0, x: 0, rotate: card.tilt }
      }
      transition={
        falling
          ? {
              delay: card.delay / 1000,
              duration: FALL_DURATION,
              // Gravity: slow start, fast finish — feels natural
              ease: [0.2, 0, 0.8, 1],
            }
          : { duration: 0 }
      }
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 5,
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <img
          src={posterSrc}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            userSelect: "none",
          }}
        />
      </div>
    </motion.div>
  );
}

// ── Overlay that fades out smoothly at the end ────────────────────────────────
export function PageIntro({ onDone }: { onDone: () => void }) {
  const [dims] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [phase, setPhase] = useState<"show" | "fall" | "done">("show");
  const cards = useRef(buildWall(dims.w, dims.h)).current;

  // Start falling after hold
  useEffect(() => {
    const t = setTimeout(() => setPhase("fall"), INTRO_HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  // Fire onDone AFTER last card fully done — no crossfade needed
  useEffect(() => {
    if (phase !== "fall") return;
    const lastCardFinish =
      Math.max(...cards.map((c) => c.delay)) + FALL_DURATION * 1000 + 80;
    const t1 = setTimeout(() => onDone(), lastCardFinish);
    const t2 = setTimeout(() => setPhase("done"), lastCardFinish + 50);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase, cards, onDone]);

  if (phase === "done") return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        backgroundColor: "#080f1e",
        pointerEvents: phase === "fall" ? "none" : "all",
      }}
      // Smooth fade-out of the background itself as cards leave
      animate={phase === "fall" ? { backgroundColor: "rgba(8,15,30,0)" } : {}}
      transition={
        phase === "fall"
          ? { duration: FALL_DURATION + 0.3, delay: 0.2, ease: "easeIn" }
          : {}
      }
    >
      {cards.map((card) => (
        <PosterCard
          key={card.id}
          card={card}
          falling={phase === "fall"}
          vh={dims.h}
        />
      ))}
    </motion.div>
  );
}
