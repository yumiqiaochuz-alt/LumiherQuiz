import { useState, useEffect, useCallback } from "react";

type PersonalityType = "Thinker" | "Creator" | "Leader" | "Changemaker" | "Explorer";
type Screen = "intro" | "quiz" | "result";

interface Answer {
  text: string;
  emoji: string;
  type: PersonalityType;
}

interface Question {
  id: number;
  text: string;
  emoji: string;
  answers: Answer[];
}

interface PersonalityResult {
  type: PersonalityType;
  description: string;
  figure: string;
  figureBio: string;
  quote: string;
  typeEmoji: string;
}

interface PetalData {
  id: number;
  x: number;
  duration: number;
  delay: number;
  size: number;
  variant: number;
}

const QUOTES = [
  "You are growing even when it feels slow.",
  "Soft progress is still progress.",
  "You are allowed to take your time.",
  "Healing is not linear.",
  "Rest is part of the journey.",
  "You are enough, exactly as you are.",
  "Small steps still move mountains.",
  "Your sensitivity is your superpower.",
  "Every version of you has been worthy.",
  "Be gentle with yourself today.",
  "You do not have to rush your becoming.",
  "Your story is still being written.",
  "Breathe. You are where you need to be.",
  "Kindness begins with yourself.",
  "You are blooming at your own pace.",
];

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "When you sit down for a meal, you tend to...",
    emoji: "🍽️",
    answers: [
      { text: "Divide food into portions and eat methodically", emoji: "📐", type: "Thinker" },
      { text: "Mix everything together and enjoy the chaos", emoji: "🎨", type: "Creator" },
      { text: "Eat quickly — you have things to accomplish", emoji: "⚡", type: "Leader" },
      { text: "Try unusual flavor combos just to see what happens", emoji: "🧪", type: "Explorer" },
    ],
  },
  {
    id: 2,
    text: "Before heading out, your get-ready routine is...",
    emoji: "💄",
    answers: [
      { text: "Makeup first, always, in the exact same order", emoji: "✨", type: "Thinker" },
      { text: "Whatever feels expressive today", emoji: "🎭", type: "Creator" },
      { text: "Hair first — it takes the longest to style", emoji: "👑", type: "Leader" },
      { text: "Spontaneous — sometimes mascara in the car", emoji: "🚗", type: "Explorer" },
    ],
  },
  {
    id: 3,
    text: "Your daily planner looks like...",
    emoji: "📓",
    answers: [
      { text: "Color-coded with time blocks and priorities", emoji: "🗂️", type: "Thinker" },
      { text: "Covered in doodles and loose sticky notes", emoji: "🖍️", type: "Creator" },
      { text: "A clean action list sorted by impact", emoji: "✅", type: "Leader" },
      { text: "Nonexistent — I trust the flow", emoji: "🌊", type: "Explorer" },
    ],
  },
  {
    id: 4,
    text: "When stress hits, you...",
    emoji: "🌧️",
    answers: [
      { text: "Research solutions until you understand the problem", emoji: "🔍", type: "Thinker" },
      { text: "Journal, paint, or create something to process it", emoji: "🎨", type: "Creator" },
      { text: "Take immediate action to fix what you can", emoji: "🔧", type: "Leader" },
      { text: "Call someone you love and talk it through", emoji: "📞", type: "Changemaker" },
    ],
  },
  {
    id: 5,
    text: "Your phone home screen is...",
    emoji: "📱",
    answers: [
      { text: "Organized neatly by category and color", emoji: "📁", type: "Thinker" },
      { text: "A mood board — aesthetic wallpaper, scattered apps", emoji: "🌸", type: "Creator" },
      { text: "Minimal — only the essentials remain", emoji: "⚪", type: "Leader" },
      { text: "Colorful and packed with interesting widgets", emoji: "🌈", type: "Explorer" },
    ],
  },
  {
    id: 6,
    text: "When you disagree with someone, you...",
    emoji: "💬",
    answers: [
      { text: "Gather all the facts before you say a word", emoji: "📋", type: "Thinker" },
      { text: "Express how it made you feel, honestly", emoji: "💭", type: "Creator" },
      { text: "State your position clearly and directly", emoji: "🗣️", type: "Leader" },
      { text: "Try to understand their side and find common ground", emoji: "🤝", type: "Changemaker" },
    ],
  },
  {
    id: 7,
    text: "Your dream weekend looks like...",
    emoji: "🌿",
    answers: [
      { text: "Diving deep into a book or learning something new", emoji: "📚", type: "Thinker" },
      { text: "Painting, music, crafting — creating from scratch", emoji: "🎵", type: "Creator" },
      { text: "Organizing something meaningful with people you love", emoji: "🌟", type: "Leader" },
      { text: "Somewhere you have never been before", emoji: "🗺️", type: "Explorer" },
    ],
  },
  {
    id: 8,
    text: "Choosing a new restaurant, you go by...",
    emoji: "🌮",
    answers: [
      { text: "Reading every review and checking the full menu", emoji: "🔎", type: "Thinker" },
      { text: "The most beautiful photos on Instagram", emoji: "📸", type: "Creator" },
      { text: "Wherever gets you seated fastest", emoji: "⏱️", type: "Leader" },
      { text: "The most unusual menu you can find", emoji: "🌍", type: "Explorer" },
    ],
  },
  {
    id: 9,
    text: "Facing a major life decision, you...",
    emoji: "🔮",
    answers: [
      { text: "Build a detailed pros and cons list", emoji: "⚖️", type: "Thinker" },
      { text: "Follow your heart — data cannot measure feeling", emoji: "💗", type: "Creator" },
      { text: "Decide quickly and trust your sharp instincts", emoji: "⚡", type: "Leader" },
      { text: "Ask people you trust for their honest perspectives", emoji: "🌐", type: "Changemaker" },
    ],
  },
  {
    id: 10,
    text: "Your workspace has a personality — it is...",
    emoji: "🪴",
    answers: [
      { text: "Spotless — everything lives in its exact place", emoji: "📐", type: "Thinker" },
      { text: "Lovingly chaotic with personal touches everywhere", emoji: "🎨", type: "Creator" },
      { text: "Clean, purposeful, and distraction-free", emoji: "🎯", type: "Leader" },
      { text: "Covered in interesting things from all over", emoji: "🗿", type: "Explorer" },
    ],
  },
  {
    id: 11,
    text: "Stuck in a long queue, you...",
    emoji: "⏳",
    answers: [
      { text: "Calculate the expected wait and plan your next move", emoji: "🧮", type: "Thinker" },
      { text: "Sketch, doodle, or write something in your notes", emoji: "✏️", type: "Creator" },
      { text: "Strike up a conversation with whoever is nearby", emoji: "💬", type: "Changemaker" },
      { text: "Wander slightly to explore what else is around", emoji: "👀", type: "Explorer" },
    ],
  },
  {
    id: 12,
    text: "At a social gathering, you feel most...",
    emoji: "🌸",
    answers: [
      { text: "Quietly observant — you love watching the dynamics", emoji: "🔭", type: "Thinker" },
      { text: "Alive — it is your stage to express yourself", emoji: "✨", type: "Creator" },
      { text: "Energized and purposeful — people gravitate to you", emoji: "🧲", type: "Leader" },
      { text: "Curious — every person here is a new story", emoji: "🌍", type: "Explorer" },
    ],
  },
  {
    id: 13,
    text: "You show love to the people closest to you by...",
    emoji: "💕",
    answers: [
      { text: "Solving their problems before they have to ask", emoji: "🔧", type: "Thinker" },
      { text: "Making something personal and meaningful for them", emoji: "🎁", type: "Creator" },
      { text: "Showing up consistently when it matters most", emoji: "🕊️", type: "Changemaker" },
      { text: "Planning surprise experiences and adventures", emoji: "🗺️", type: "Explorer" },
    ],
  },
  {
    id: 14,
    text: "Your mornings tend to be...",
    emoji: "🌅",
    answers: [
      { text: "Precisely timed — the same ritual every single day", emoji: "⏰", type: "Thinker" },
      { text: "Slow and intuitive — you follow the morning mood", emoji: "☕", type: "Creator" },
      { text: "Fast and goal-oriented — hit the ground running", emoji: "🏃", type: "Leader" },
      { text: "Varied and curious — no two mornings are the same", emoji: "🌈", type: "Explorer" },
    ],
  },
  {
    id: 15,
    text: "If you could change one thing about the world...",
    emoji: "🌍",
    answers: [
      { text: "Solve a complex systemic problem through deep research", emoji: "🧬", type: "Thinker" },
      { text: "Transform culture through art and storytelling", emoji: "🎭", type: "Creator" },
      { text: "Build systems that give everyone equal opportunity", emoji: "⚡", type: "Leader" },
      { text: "Challenge the rules that hold people back", emoji: "🔥", type: "Changemaker" },
    ],
  },
];

const RESULTS: Record<PersonalityType, PersonalityResult> = {
  Thinker: {
    type: "Thinker",
    description:
      "You move through the world with precision and curiosity. Before you act, you understand. Your methodical mind does not just solve problems — it anticipates them. You find beauty in patterns and meaning in the details others overlook.",
    figure: "Marie Curie",
    figureBio:
      "The first woman to win a Nobel Prize — twice. She did not wait for the world to make room for her. She built the room herself, with relentless curiosity and unwavering focus.",
    quote: "\"Nothing in life is to be feared, only to be understood.\"",
    typeEmoji: "🔬",
  },
  Creator: {
    type: "Creator",
    description:
      "You see the world as raw material waiting to become art. You feel deeply, express boldly, and leave beauty in your wake. Your emotions are your intelligence, and your imagination is your compass.",
    figure: "Frida Kahlo",
    figureBio:
      "She turned pain into paintings and wounds into wonder. Frida Kahlo never asked permission to be herself — she painted her truth so vividly the world had no choice but to see it.",
    quote: "\"I paint myself because I am so often alone and because I am the subject I know best.\"",
    typeEmoji: "🎨",
  },
  Leader: {
    type: "Leader",
    description:
      "You were born to move things forward. You see the path clearly when others are still mapping the terrain. Your confidence is earned clarity. People follow you because you actually go somewhere worth following.",
    figure: "Malala Yousafzai",
    figureBio:
      "At 15, she faced a bullet. At 17, she won the Nobel Peace Prize. Malala Yousafzai showed the world that one girl with a voice and a book is more powerful than any force that tries to silence her.",
    quote: "\"One child, one teacher, one book, one pen can change the world.\"",
    typeEmoji: "🌟",
  },
  Changemaker: {
    type: "Changemaker",
    description:
      "You feel the weight of what is unjust and refuse to normalize it. Your greatest power is connection — you build bridges where others build walls. Real change is made by people who love other people enough to act.",
    figure: "Rosa Parks",
    figureBio:
      "On December 1st, 1955, she stayed seated — and changed the course of history. Rosa Parks was not tired of walking. She was tired of giving in. That quiet, unshakeable dignity started a revolution.",
    quote: "\"You must never be fearful about what you are doing when it is right.\"",
    typeEmoji: "✊",
  },
  Explorer: {
    type: "Explorer",
    description:
      "You live at the edge of what is known, always leaning toward what could be. Boundaries are invitations to you, not barriers. Your restless curiosity is not a flaw — it is the engine that takes humanity somewhere new.",
    figure: "Amelia Earhart",
    figureBio:
      "She flew alone across the Atlantic when women were not supposed to drive alone at night. Amelia Earhart did not just break records — she shattered the invisible ceiling of what women were told to dream.",
    quote: "\"The most difficult thing is the decision to act. The rest is merely tenacity.\"",
    typeEmoji: "✈️",
  },
};

let nextPetalId = 0;

function makePetal(withDelay = false): PetalData {
  return {
    id: nextPetalId++,
    x: 2 + Math.random() * 93,
    duration: 8 + Math.random() * 10,
    delay: withDelay ? Math.random() * 14 : 0,
    size: 18 + Math.floor(Math.random() * 16),
    variant: Math.floor(Math.random() * 5) + 1,
  };
}

function Petal({
  petal,
  onFinish,
  onClick,
}: {
  petal: PetalData;
  onFinish: (id: number) => void;
  onClick: (id: number) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        left: `${petal.x}%`,
        top: 0,
        fontSize: `${petal.size}px`,
        animation: `pf${petal.variant} ${petal.duration}s ${petal.delay}s linear forwards`,
        zIndex: 30,
        cursor: "pointer",
        lineHeight: 1,
        userSelect: "none",
        filter: "drop-shadow(0 2px 6px rgba(210, 100, 140, 0.25))",
        pointerEvents: "auto",
      }}
      onClick={() => onClick(petal.id)}
      onAnimationEnd={() => onFinish(petal.id)}
    >
      🌸
    </div>
  );
}

function QuoteModal({ quote, onClose }: { quote: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "rgba(160, 80, 110, 0.18)", backdropFilter: "blur(10px)", zIndex: 50 }}
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full rounded-3xl p-8 text-center"
        style={{
          background: "rgba(255, 246, 250, 0.94)",
          backdropFilter: "blur(24px)",
          border: "1.5px solid rgba(210, 150, 180, 0.4)",
          boxShadow: "0 24px 70px rgba(180, 90, 130, 0.22)",
          animation: "fadeInScale 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-5">🌸</div>
        <p
          className="text-xl leading-relaxed mb-7"
          style={{ fontFamily: "'Fraunces', serif", color: "#4a2535", fontStyle: "italic", fontWeight: 400 }}
        >
          {quote}
        </p>
        <button
          onClick={onClose}
          className="px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #d4758e, #b85a72)",
            color: "#fff5f8",
            fontFamily: "'Nunito', sans-serif",
            boxShadow: "0 6px 20px rgba(190, 80, 110, 0.3)",
          }}
        >
          Close ✨
        </button>
      </div>
    </div>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ animation: "fadeInUp 0.7s ease-out" }}>
      <div className="max-w-lg w-full text-center">
        <div
          className="text-8xl mb-7 inline-block"
          style={{ filter: "drop-shadow(0 6px 16px rgba(210, 100, 140, 0.35))", animation: "gentleFloat 4s ease-in-out infinite" }}
        >
          🌸
        </div>
        <h1
          className="text-5xl md:text-6xl mb-4 leading-tight"
          style={{ fontFamily: "'Fraunces', serif", color: "#4a2535", fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          Who Are You, Really?
        </h1>
        <p
          className="text-lg mb-3"
          style={{ fontFamily: "'Nunito', sans-serif", color: "#c96b82", fontWeight: 600, letterSpacing: "0.02em" }}
        >
          A gentle journey of self-discovery
        </p>
        <p
          className="mb-10 leading-loose"
          style={{ fontFamily: "'Nunito', sans-serif", color: "#7a5565", fontSize: "1rem", maxWidth: "38ch", margin: "0 auto 2.5rem" }}
        >
          15 questions about your real-life habits — how you eat, get ready, make decisions, and dream. No right answers. Only honest ones.
        </p>
        <button
          onClick={onStart}
          className="px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #d4758e 0%, #c06078 55%, #a84f65 100%)",
            color: "#fff5f8",
            fontFamily: "'Nunito', sans-serif",
            boxShadow: "0 10px 35px rgba(190, 80, 110, 0.38)",
            letterSpacing: "0.01em",
          }}
        >
          Begin my journey 🌸
        </button>
        <p
          className="mt-8 text-sm"
          style={{ fontFamily: "'Nunito', sans-serif", color: "#b898a8", fontStyle: "italic" }}
        >
          Tap the falling petals for a little gift 💕
        </p>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2.5">
        <span style={{ fontFamily: "'Nunito', sans-serif", color: "#9a6575", fontSize: "0.82rem", fontWeight: 600 }}>
          Question {current} of {total}
        </span>
        <span style={{ fontFamily: "'Nunito', sans-serif", color: "#c96b82", fontSize: "0.82rem", fontWeight: 700 }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(210, 150, 170, 0.18)" }}>
        <div
          className="h-full rounded-full transition-all duration-600 ease-out"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #f4b3c5, #c96b82, #a84f65)" }}
        />
      </div>
    </div>
  );
}

function QuizScreen({
  question,
  questionIndex,
  total,
  onAnswer,
}: {
  question: Question;
  questionIndex: number;
  total: number;
  onAnswer: (type: PersonalityType) => void;
}) {
  const [selected, setSelected] = useState<PersonalityType | null>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<PersonalityType | null>(null);

  useEffect(() => {
    setVisible(false);
    setSelected(null);
    setHovered(null);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [questionIndex]);

  const handleAnswer = (type: PersonalityType) => {
    if (selected) return;
    setSelected(type);
    setTimeout(() => onAnswer(type), 480);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 py-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: "opacity 0.42s ease-out, transform 0.42s ease-out",
      }}
    >
      <div className="max-w-2xl w-full">
        <ProgressBar current={questionIndex + 1} total={total} />
        <div
          className="rounded-3xl p-7 md:p-10"
          style={{
            background: "rgba(255, 245, 250, 0.76)",
            backdropFilter: "blur(22px)",
            border: "1.5px solid rgba(210, 155, 180, 0.28)",
            boxShadow: "0 10px 50px rgba(170, 90, 120, 0.11)",
          }}
        >
          <div className="text-5xl mb-4 text-center">{question.emoji}</div>
          <h2
            className="text-center mb-8 text-2xl md:text-3xl"
            style={{ fontFamily: "'Fraunces', serif", color: "#4a2535", fontWeight: 500, lineHeight: 1.4 }}
          >
            {question.text}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {question.answers.map((answer) => {
              const isSelected = selected === answer.type;
              const isDimmed = selected !== null && selected !== answer.type;
              const isHovered = !selected && hovered === answer.type;
              return (
                <button
                  key={answer.type}
                  onClick={() => handleAnswer(answer.type)}
                  disabled={!!selected}
                  onMouseEnter={() => !selected && setHovered(answer.type)}
                  onMouseLeave={() => setHovered(null)}
                  className="w-full text-left rounded-2xl p-4 transition-all duration-250"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(212, 117, 145, 0.22), rgba(180, 80, 110, 0.16))"
                      : isHovered
                      ? "rgba(255, 240, 247, 0.9)"
                      : "rgba(255, 248, 252, 0.6)",
                    border: isSelected
                      ? "1.5px solid rgba(192, 96, 120, 0.55)"
                      : isHovered
                      ? "1.5px solid rgba(210, 150, 175, 0.5)"
                      : "1.5px solid rgba(210, 155, 180, 0.22)",
                    opacity: isDimmed ? 0.38 : 1,
                    transform: isSelected ? "scale(1.015)" : isHovered ? "scale(1.008)" : "scale(1)",
                    backdropFilter: "blur(8px)",
                    cursor: selected ? "default" : "pointer",
                    boxShadow: isSelected
                      ? "0 6px 24px rgba(192, 90, 120, 0.18)"
                      : isHovered
                      ? "0 4px 16px rgba(210, 130, 160, 0.12)"
                      : "none",
                    outline: "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{answer.emoji}</span>
                    <span
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        color: isSelected ? "#5a2038" : "#7a5565",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: "0.94rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {answer.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ type, onRestart }: { type: PersonalityType; onRestart: () => void }) {
  const result = RESULTS[type];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const glassCard = {
    background: "rgba(255, 245, 250, 0.78)",
    backdropFilter: "blur(22px)",
    border: "1.5px solid rgba(210, 155, 180, 0.3)",
    boxShadow: "0 10px 50px rgba(170, 90, 120, 0.1)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 py-12"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-7xl mb-5" style={{ filter: "drop-shadow(0 4px 14px rgba(210, 100, 140, 0.32))" }}>
            {result.typeEmoji}
          </div>
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ fontFamily: "'Nunito', sans-serif", color: "#c96b82", fontWeight: 800 }}
          >
            You are a
          </p>
          <h1
            className="text-5xl md:text-6xl"
            style={{ fontFamily: "'Fraunces', serif", color: "#4a2535", fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            {result.type}
          </h1>
        </div>

        <div className="rounded-3xl p-7 md:p-9 mb-5" style={glassCard}>
          <p
            className="text-lg leading-loose"
            style={{ fontFamily: "'Nunito', sans-serif", color: "#5a3545", lineHeight: 1.9 }}
          >
            {result.description}
          </p>
        </div>

        <div className="rounded-3xl p-7 md:p-9 mb-7" style={glassCard}>
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "'Nunito', sans-serif", color: "#c96b82", fontWeight: 800 }}
          >
            Your historical kindred spirit
          </p>
          <h2
            className="text-3xl md:text-4xl mb-5"
            style={{ fontFamily: "'Fraunces', serif", color: "#4a2535", fontWeight: 500 }}
          >
            {result.figure}
          </h2>
          <p
            className="mb-7 leading-loose"
            style={{ fontFamily: "'Nunito', sans-serif", color: "#6a4555", lineHeight: 1.85 }}
          >
            {result.figureBio}
          </p>
          <div
            className="rounded-2xl p-6"
            style={{ background: "rgba(210, 140, 170, 0.1)", border: "1px solid rgba(210, 140, 170, 0.22)" }}
          >
            <p
              className="text-center italic leading-relaxed"
              style={{ fontFamily: "'Fraunces', serif", color: "#7a3548", fontWeight: 400, fontSize: "1.1rem", lineHeight: 1.7 }}
            >
              {result.quote}
            </p>
            <p
              className="text-center mt-3 text-sm"
              style={{ fontFamily: "'Nunito', sans-serif", color: "#b07080", fontWeight: 600 }}
            >
              — {result.figure}
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onRestart}
            className="px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #d4758e 0%, #c06078 55%, #a84f65 100%)",
              color: "#fff5f8",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 10px 35px rgba(190, 80, 110, 0.38)",
            }}
          >
            Begin again 🌸
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<PersonalityType, number>>({
    Thinker: 0,
    Creator: 0,
    Leader: 0,
    Changemaker: 0,
    Explorer: 0,
  });
  const [result, setResult] = useState<PersonalityType | null>(null);
  const [petals, setPetals] = useState<PetalData[]>([]);
  const [activeQuote, setActiveQuote] = useState<string | null>(null);

  useEffect(() => {
    setPetals(Array.from({ length: 20 }, (_, i) => makePetal(i > 0)));
  }, []);

  const handlePetalFinish = useCallback((id: number) => {
    setPetals((prev) => [...prev.filter((p) => p.id !== id), makePetal(false)]);
  }, []);

  const handlePetalClick = useCallback((id: number) => {
    setActiveQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setPetals((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      setTimeout(() => setPetals((p) => [...p, makePetal(false)]), 1800);
      return filtered;
    });
  }, []);

  const handleStart = () => {
    setScreen("quiz");
    setCurrentQuestion(0);
    setScores({ Thinker: 0, Creator: 0, Leader: 0, Changemaker: 0, Explorer: 0 });
  };

  const handleAnswer = (type: PersonalityType) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);
    if (currentQuestion + 1 >= QUESTIONS.length) {
      const winner = (Object.keys(newScores) as PersonalityType[]).reduce((a, b) =>
        newScores[a] >= newScores[b] ? a : b
      );
      setResult(winner);
      setScreen("result");
    } else {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const handleRestart = () => {
    setScreen("intro");
    setCurrentQuestion(0);
    setResult(null);
    setScores({ Thinker: 0, Creator: 0, Leader: 0, Changemaker: 0, Explorer: 0 });
  };

  return (
    <>
      <style>{`
        @keyframes pf1 {
          0%   { transform: translateY(-50px) translateX(0) rotate(0deg); opacity: 0; }
          8%   { opacity: 0.82; }
          30%  { transform: translateY(30vh) translateX(26px) rotate(112deg); opacity: 0.82; }
          65%  { transform: translateY(65vh) translateX(-19px) rotate(242deg); opacity: 0.78; }
          92%  { opacity: 0.68; }
          100% { transform: translateY(108vh) translateX(13px) rotate(374deg); opacity: 0; }
        }
        @keyframes pf2 {
          0%   { transform: translateY(-50px) translateX(0) rotate(14deg); opacity: 0; }
          8%   { opacity: 0.88; }
          40%  { transform: translateY(40vh) translateX(-32px) rotate(157deg); opacity: 0.83; }
          75%  { transform: translateY(75vh) translateX(22px) rotate(294deg); opacity: 0.74; }
          92%  { opacity: 0.68; }
          100% { transform: translateY(108vh) translateX(-9px) rotate(403deg); opacity: 0; }
        }
        @keyframes pf3 {
          0%   { transform: translateY(-50px) translateX(0) rotate(-9deg); opacity: 0; }
          8%   { opacity: 0.78; }
          25%  { transform: translateY(25vh) translateX(17px) rotate(82deg); opacity: 0.83; }
          55%  { transform: translateY(55vh) translateX(-26px) rotate(202deg); opacity: 0.79; }
          80%  { transform: translateY(80vh) translateX(31px) rotate(314deg); opacity: 0.73; }
          92%  { opacity: 0.62; }
          100% { transform: translateY(108vh) translateX(6px) rotate(394deg); opacity: 0; }
        }
        @keyframes pf4 {
          0%   { transform: translateY(-50px) translateX(0) rotate(21deg); opacity: 0; }
          8%   { opacity: 0.88; }
          35%  { transform: translateY(35vh) translateX(-22px) rotate(132deg); opacity: 0.84; }
          70%  { transform: translateY(70vh) translateX(37px) rotate(263deg); opacity: 0.79; }
          92%  { opacity: 0.68; }
          100% { transform: translateY(108vh) translateX(11px) rotate(424deg); opacity: 0; }
        }
        @keyframes pf5 {
          0%   { transform: translateY(-50px) translateX(0) rotate(-4deg); opacity: 0; }
          8%   { opacity: 0.84; }
          45%  { transform: translateY(45vh) translateX(21px) rotate(173deg); opacity: 0.84; }
          80%  { transform: translateY(80vh) translateX(-16px) rotate(322deg); opacity: 0.74; }
          92%  { opacity: 0.68; }
          100% { transform: translateY(108vh) translateX(9px) rotate(443deg); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className="relative min-h-screen overflow-x-hidden"
        style={{ background: "linear-gradient(158deg, #fef0f5 0%, #fce8ef 30%, #fdf5f9 65%, #fff0f4 100%)" }}
      >
        {petals.map((petal) => (
          <Petal key={petal.id} petal={petal} onFinish={handlePetalFinish} onClick={handlePetalClick} />
        ))}

        {activeQuote && <QuoteModal quote={activeQuote} onClose={() => setActiveQuote(null)} />}

        <div style={{ position: "relative", zIndex: 10 }}>
          {screen === "intro" && <IntroScreen onStart={handleStart} />}
          {screen === "quiz" && (
            <QuizScreen
              question={QUESTIONS[currentQuestion]}
              questionIndex={currentQuestion}
              total={QUESTIONS.length}
              onAnswer={handleAnswer}
            />
          )}
          {screen === "result" && result && <ResultScreen type={result} onRestart={handleRestart} />}
        </div>
      </div>
    </>
  );
}
