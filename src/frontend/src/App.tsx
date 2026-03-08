import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Heart,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  useAddPeriodEntry,
  useDeletePeriodEntry,
  useGetAllPeriodEntries,
} from "./hooks/useQueries";

// ────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────

const MOOD_CARDS = [
  {
    emoji: "🌸",
    quote: "You are strong, even when it doesn't feel like it.",
    src: "Your body, your power",
  },
  {
    emoji: "💆",
    quote: "Rest is not laziness. Rest is healing.",
    src: "Self-care wisdom",
  },
  {
    emoji: "🍫",
    quote: "Today you deserve all the chocolate and comfort.",
    src: "Sweet reminders",
  },
  {
    emoji: "💕",
    quote: "Your feelings are valid. Every single one of them.",
    src: "Emotional wellness",
  },
  {
    emoji: "🌙",
    quote: "Even the moon has phases. So do you, and that's beautiful.",
    src: "Nature's wisdom",
  },
  {
    emoji: "🛁",
    quote: "A warm bath, cozy socks — you deserve all of it.",
    src: "Cozy care",
  },
  {
    emoji: "✨",
    quote: "You are doing amazing, even on the hard days.",
    src: "Daily affirmation",
  },
  {
    emoji: "🌺",
    quote: "Take it one hour at a time. You've got this, Haniiiii.",
    src: "For you, always",
  },
];

const SELF_CARE_TIPS = [
  {
    emoji: "💧",
    title: "Stay Hydrated",
    desc: "Drink warm water or herbal tea to ease cramps and keep your body happy.",
  },
  {
    emoji: "🍫",
    title: "Eat The Chocolate",
    desc: "Dark chocolate is actually good for you during your period. No guilt allowed!",
  },
  {
    emoji: "🔥",
    title: "Use a Heating Pad",
    desc: "Place warmth on your lower belly or back for instant cramp relief.",
  },
  {
    emoji: "📺",
    title: "Watch Comfort Shows",
    desc: "Queue up your favorite comfort series and give yourself permission to do nothing.",
  },
  {
    emoji: "😴",
    title: "Rest Without Guilt",
    desc: "Your body is working extra hard. Sleep in, nap freely, be kind to yourself.",
  },
  {
    emoji: "🛁",
    title: "Take a Warm Bath",
    desc: "Add some bath salts or a bath bomb and let the warmth melt the tension away.",
  },
  {
    emoji: "🍵",
    title: "Sip Herbal Tea",
    desc: "Chamomile or ginger tea can help soothe cramps and calm your mood.",
  },
  {
    emoji: "🚶‍♀️",
    title: "Gentle Movement",
    desc: "A slow walk or light yoga can help ease pain and boost your mood naturally.",
  },
  {
    emoji: "📔",
    title: "Journal Your Feelings",
    desc: "Writing how you feel can help process emotions. You don't have to hold it all in.",
  },
];

const SYMPTOM_LIST = [
  "Cramps",
  "Mood Swings",
  "Bloating",
  "Headache",
  "Fatigue",
  "Back Pain",
  "Nausea",
  "Tender Breasts",
];

const SEVERITY_LABELS: { [key: number]: string } = {
  1: "Mild",
  2: "Moderate",
  3: "Severe",
};
const SEVERITY_COLORS: { [key: number]: string } = {
  1: "bg-green-100 text-green-700 border-green-200",
  2: "bg-yellow-100 text-yellow-700 border-yellow-200",
  3: "bg-red-100 text-red-700 border-red-200",
};

const HUG_MESSAGES = [
  "Sending you the biggest, warmest hug right now 🤗💕",
  "You are so incredibly loved, Haniiiii 💖",
  "Everything you're feeling right now is valid. You're doing great. ✨",
  "Rest your head, relax your shoulders. You are safe and cared for. 🌸",
  "Your resilience is beautiful. You carry so much grace. 💫",
  "Imagine a cozy blanket, a warm drink, and zero responsibilities right now. 🍵",
  "You are seen, you are heard, and you are so deeply appreciated. 💕",
  "The world is lucky to have someone as wonderful as you in it. 🌺",
  "It's okay to cry. It's okay to rest. It's okay to just be. 💝",
  "One breath at a time. One hour at a time. You've absolutely got this. ✨",
  "Today is a 'be gentle with yourself' kind of day. You deserve all the softness. 🌙",
  "You're not just surviving, you're blooming. Even on the hard days. 🌸",
];

// ────────────────────────────────────────────────────────────
// FLOATING HEARTS COMPONENT
// ────────────────────────────────────────────────────────────

function FloatingHearts() {
  const hearts = [
    { left: "10%", delay: "0s", size: "text-xl" },
    { left: "25%", delay: "0.8s", size: "text-sm" },
    { left: "40%", delay: "1.6s", size: "text-2xl" },
    { left: "60%", delay: "0.4s", size: "text-lg" },
    { left: "75%", delay: "1.2s", size: "text-sm" },
    { left: "88%", delay: "2s", size: "text-xl" },
    { left: "50%", delay: "2.4s", size: "text-xs" },
  ];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {hearts.map((h, i) => (
        <span
          key={h.left}
          className={`absolute bottom-0 ${h.size} animate-float-heart`}
          style={{
            left: h.left,
            animationDelay: h.delay,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        >
          💕
        </span>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// NAVIGATION
// ────────────────────────────────────────────────────────────

function Navigation() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        background: "oklch(0.96 0.025 5 / 0.92)",
        borderColor: "oklch(0.88 0.04 5)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollTo("welcome")}
          className="font-dancing text-2xl font-bold"
          style={{ color: "oklch(0.62 0.14 10)" }}
        >
          Haniiiii 💕
        </button>
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Welcome", id: "welcome", ocid: "nav.welcome.link" },
            { label: "Mood Lift 🌸", id: "mood", ocid: "nav.mood.link" },
            {
              label: "Self-Care 💆‍♀️",
              id: "selfcare",
              ocid: "nav.selfcare.link",
            },
            { label: "Period Log 📅", id: "log", ocid: "nav.log.link" },
            { label: "Comfort 🤗", id: "comfort", ocid: "nav.comfort.link" },
          ].map(({ label, id, ocid }) => (
            <button
              key={id}
              type="button"
              data-ocid={ocid}
              onClick={() => scrollTo(id)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{
                color: "oklch(0.45 0.07 10)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "oklch(0.92 0.05 5)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "transparent";
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Mobile nav */}
        <div className="flex md:hidden gap-2">
          {[
            { icon: "🏠", id: "welcome" },
            { icon: "🌸", id: "mood" },
            { icon: "💆‍♀️", id: "selfcare" },
            { icon: "📅", id: "log" },
            { icon: "🤗", id: "comfort" },
          ].map(({ icon, id }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="text-xl p-1"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ────────────────────────────────────────────────────────────
// WELCOME SECTION
// ────────────────────────────────────────────────────────────

function WelcomeSection() {
  return (
    <section
      id="welcome"
      data-ocid="welcome.section"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.94 0.04 0) 0%, oklch(0.92 0.06 340) 35%, oklch(0.88 0.07 300) 70%, oklch(0.90 0.05 310) 100%)",
      }}
    >
      <FloatingHearts />

      {/* Decorative sparkles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[
          { top: "15%", left: "8%", delay: "0s" },
          { top: "30%", left: "90%", delay: "1s" },
          { top: "60%", left: "5%", delay: "0.5s" },
          { top: "75%", left: "85%", delay: "1.5s" },
          { top: "20%", left: "50%", delay: "2s" },
        ].map((pos, i) => (
          <span
            key={pos.delay}
            className="absolute text-pink-300 animate-sparkle"
            style={{
              top: pos.top,
              left: pos.left,
              animationDelay: pos.delay,
              fontSize: i % 2 === 0 ? "1.5rem" : "1rem",
            }}
          >
            ✨
          </span>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Floral image */}
        <div className="mb-6 flex justify-center">
          <img
            src="/assets/generated/floral-hero-transparent.dim_800x400.png"
            alt="Soft watercolor florals"
            className="w-full max-w-lg object-contain animate-gentle-float drop-shadow-lg"
            style={{ maxHeight: "220px" }}
          />
        </div>

        <h1
          className="font-dancing text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up"
          style={{ color: "oklch(0.48 0.14 10)", lineHeight: 1.2 }}
        >
          Hey Haniiiii,
          <br />
          <span style={{ color: "oklch(0.60 0.14 330)" }}>
            We've Got You 💕
          </span>
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up delay-200"
          style={{
            color: "oklch(0.40 0.06 10)",
            lineHeight: 1.8,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Your body is doing something incredible right now. It's okay to slow
          down, be gentle with yourself, and let the people who care about you
          hold you up today. You are so loved. 💕
        </p>

        <button
          type="button"
          data-ocid="welcome.primary_button"
          onClick={() =>
            document
              .getElementById("mood")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:scale-105 active:scale-95 animate-fade-in-up delay-400 shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.14 10), oklch(0.58 0.13 340))",
            boxShadow: "0 8px 30px oklch(0.72 0.13 10 / 0.35)",
          }}
        >
          <span>Scroll down for some love</span>
          <span className="text-xl">↓</span>
        </button>
      </div>

      {/* Bottom wave */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "60px" }}
      >
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M0,30 C360,60 720,0 1440,30 L1440,60 L0,60 Z"
            fill="oklch(0.97 0.015 5)"
          />
        </svg>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// MOOD LIFTING SECTION
// ────────────────────────────────────────────────────────────

function MoodSection() {
  const [current, setCurrent] = useState(0);
  const total = MOOD_CARDS.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Show 3 cards on desktop, 1 on mobile
  const getVisible = (): number[] => {
    const indices: number[] = [];
    for (let i = 0; i < 3; i++) {
      indices.push((current + i) % total);
    }
    return indices;
  };

  return (
    <section
      id="mood"
      data-ocid="mood.section"
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.97 0.015 5) 0%, oklch(0.95 0.03 320) 50%, oklch(0.96 0.02 290) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="font-dancing text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "oklch(0.50 0.12 10)" }}
          >
            A Little Love For You 🌸
          </h2>
          <p className="text-muted-foreground text-lg">
            Sweet reminders just for you, Haniiiii
          </p>
        </div>

        {/* Desktop: 3-card carousel */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            data-ocid="mood.pagination_prev"
            onClick={prev}
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-soft"
            style={{
              background: "oklch(0.92 0.05 5)",
              color: "oklch(0.60 0.14 10)",
            }}
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 grid grid-cols-3 gap-6">
            {getVisible().map((idx, i) => (
              <MoodCard
                key={idx}
                card={MOOD_CARDS[idx]}
                index={idx + 1}
                isCenter={i === 1}
              />
            ))}
          </div>

          <button
            type="button"
            data-ocid="mood.pagination_next"
            onClick={next}
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-soft"
            style={{
              background: "oklch(0.92 0.05 5)",
              color: "oklch(0.60 0.14 10)",
            }}
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden">
          <div className="flex items-center gap-4">
            <button
              type="button"
              data-ocid="mood.pagination_prev"
              onClick={prev}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-soft flex-shrink-0"
              style={{
                background: "oklch(0.92 0.05 5)",
                color: "oklch(0.60 0.14 10)",
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <MoodCard
                card={MOOD_CARDS[current]}
                index={current + 1}
                isCenter
              />
            </div>
            <button
              type="button"
              data-ocid="mood.pagination_next"
              onClick={next}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-soft flex-shrink-0"
              style={{
                background: "oklch(0.92 0.05 5)",
                color: "oklch(0.60 0.14 10)",
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {MOOD_CARDS.map((card, i) => (
              <button
                key={card.src}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to card ${i + 1}`}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background:
                    i === current
                      ? "oklch(0.62 0.14 10)"
                      : "oklch(0.82 0.06 10)",
                  transform: i === current ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Desktop dot indicators */}
        <div className="hidden md:flex justify-center gap-2 mt-8">
          {MOOD_CARDS.map((card, i) => (
            <button
              key={card.src}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to card ${i + 1}`}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background:
                  i === current ? "oklch(0.62 0.14 10)" : "oklch(0.82 0.06 10)",
                transform: i === current ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MoodCard({
  card,
  index,
  isCenter,
}: { card: (typeof MOOD_CARDS)[0]; index: number; isCenter: boolean }) {
  return (
    <div
      data-ocid={`mood.card.${index}`}
      className="relative rounded-3xl p-8 text-center transition-all duration-300"
      style={{
        background: isCenter
          ? "linear-gradient(135deg, oklch(0.94 0.06 0), oklch(0.88 0.08 340))"
          : "linear-gradient(135deg, oklch(0.97 0.02 320), oklch(0.94 0.04 300))",
        boxShadow: isCenter
          ? "0 12px 40px oklch(0.72 0.13 10 / 0.22), 0 2px 8px oklch(0.72 0.13 10 / 0.1)"
          : "0 4px 20px oklch(0.72 0.13 10 / 0.1)",
        transform: isCenter ? "scale(1.03)" : "scale(0.97)",
        border: `1.5px solid oklch(${isCenter ? "0.85 0.07 340" : "0.90 0.03 320"})`,
      }}
    >
      <div className="text-5xl mb-5">{card.emoji}</div>
      <p
        className="font-dancing text-xl md:text-2xl font-semibold mb-4"
        style={{ color: "oklch(0.38 0.1 10)", lineHeight: 1.4 }}
      >
        "{card.quote}"
      </p>
      <p className="text-sm" style={{ color: "oklch(0.58 0.07 340)" }}>
        — {card.src}
      </p>
      {isCenter && (
        <div className="absolute -top-3 -right-3 text-2xl animate-drift">
          💕
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SELF-CARE SECTION
// ────────────────────────────────────────────────────────────

const SELFCARE_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.95 0.04 5), oklch(0.90 0.07 340))",
  "linear-gradient(135deg, oklch(0.93 0.05 300), oklch(0.89 0.06 320))",
  "linear-gradient(135deg, oklch(0.94 0.06 20), oklch(0.91 0.05 5))",
  "linear-gradient(135deg, oklch(0.92 0.07 340), oklch(0.88 0.06 310))",
  "linear-gradient(135deg, oklch(0.95 0.03 310), oklch(0.92 0.04 290))",
  "linear-gradient(135deg, oklch(0.93 0.05 0), oklch(0.90 0.06 340))",
  "linear-gradient(135deg, oklch(0.91 0.06 290), oklch(0.88 0.07 310))",
  "linear-gradient(135deg, oklch(0.94 0.05 340), oklch(0.90 0.06 320))",
  "linear-gradient(135deg, oklch(0.95 0.04 10), oklch(0.91 0.05 340))",
];

function SelfCareSection() {
  return (
    <section
      id="selfcare"
      data-ocid="selfcare.section"
      className="py-20 px-4"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.96 0.02 290) 0%, oklch(0.97 0.02 5) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="font-dancing text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "oklch(0.50 0.12 10)" }}
          >
            Self-Care Just For You 💆‍♀️
          </h2>
          <p className="text-muted-foreground text-lg">
            Little acts of love for your body and soul
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SELF_CARE_TIPS.map((tip, i) => (
            <div
              key={tip.title}
              data-ocid={`selfcare.card.${i + 1}`}
              className="rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-rose cursor-default"
              style={{
                background: SELFCARE_GRADIENTS[i],
                border: "1.5px solid oklch(0.88 0.05 340 / 0.7)",
                boxShadow: "0 4px 20px oklch(0.72 0.13 10 / 0.08)",
              }}
            >
              <div className="text-4xl mb-4">{tip.emoji}</div>
              <h3
                className="font-dancing text-2xl font-bold mb-2"
                style={{ color: "oklch(0.40 0.11 10)" }}
              >
                {tip.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.42 0.06 10)" }}
              >
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// PERIOD LOG SECTION
// ────────────────────────────────────────────────────────────

type SelectedSymptom = { name: string; severity: number };

function PeriodLogSection() {
  const [activeTab, setActiveTab] = useState("log");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>(
    [],
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const { data: entries, isLoading: entriesLoading } = useGetAllPeriodEntries();
  const addEntry = useAddPeriodEntry();
  const deleteEntry = useDeletePeriodEntry();

  const toggleSymptom = (name: string) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.find((s) => s.name === name);
      if (exists) return prev.filter((s) => s.name !== name);
      return [...prev, { name, severity: 1 }];
    });
  };

  const setSeverity = (name: string, severity: number) => {
    setSelectedSymptoms((prev) =>
      prev.map((s) => (s.name === name ? { ...s, severity } : s)),
    );
  };

  const isSymptomSelected = (name: string) =>
    selectedSymptoms.some((s) => s.name === name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      toast.error("Please enter a start date 🌸");
      return;
    }
    setSaveStatus("saving");
    try {
      await addEntry.mutateAsync({
        startDate,
        endDate,
        notes,
        symptoms: selectedSymptoms.map((s) => ({
          name: s.name,
          severity: BigInt(s.severity),
        })),
      });
      setSaveStatus("saved");
      toast.success("Entry saved! You're doing amazing 💕");
      // Reset form
      setStartDate("");
      setEndDate("");
      setNotes("");
      setSelectedSymptoms([]);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("idle");
      toast.error("Something went wrong. Please try again 💕");
    }
  };

  return (
    <section
      id="log"
      data-ocid="log.section"
      className="py-20 px-4"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.97 0.02 5) 0%, oklch(0.95 0.03 310) 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="font-dancing text-4xl md:text-5xl font-bold mb-3"
            style={{ color: "oklch(0.50 0.12 10)" }}
          >
            Your Period Log 📅
          </h2>
          <p className="text-muted-foreground text-lg">
            Track your cycle with love and care
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="w-full mb-8 rounded-2xl p-1"
            style={{ background: "oklch(0.93 0.04 5)" }}
          >
            <TabsTrigger
              value="log"
              data-ocid="log.tab"
              className="flex-1 rounded-xl data-[state=active]:shadow-soft"
              style={{ fontFamily: "system-ui" }}
            >
              Log Entry 🌸
            </TabsTrigger>
            <TabsTrigger
              value="history"
              data-ocid="log.history.tab"
              className="flex-1 rounded-xl data-[state=active]:shadow-soft"
              style={{ fontFamily: "system-ui" }}
            >
              History 📖
            </TabsTrigger>
          </TabsList>

          {/* LOG ENTRY TAB */}
          <TabsContent value="log">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl p-8 space-y-6"
              style={{
                background: "oklch(0.99 0.008 5)",
                border: "1.5px solid oklch(0.90 0.04 340)",
                boxShadow: "0 8px 40px oklch(0.72 0.13 10 / 0.10)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="startDate"
                    className="font-dancing text-xl font-semibold block"
                    style={{ color: "oklch(0.50 0.12 10)" }}
                  >
                    Period Start 🌸
                  </label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    data-ocid="log.start_date.input"
                    className="rounded-xl"
                    style={{ borderColor: "oklch(0.85 0.07 340)" }}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="endDate"
                    className="font-dancing text-xl font-semibold block"
                    style={{ color: "oklch(0.50 0.12 10)" }}
                  >
                    Period End 🌙
                  </label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    data-ocid="log.end_date.input"
                    className="rounded-xl"
                    style={{ borderColor: "oklch(0.85 0.07 340)" }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional — fill in when it ends
                  </p>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-3">
                <p
                  className="font-dancing text-xl font-semibold block"
                  style={{ color: "oklch(0.50 0.12 10)" }}
                >
                  How are you feeling? 💕
                </p>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_LIST.map((symptom) => {
                    const selected = isSymptomSelected(symptom);
                    return (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => toggleSymptom(symptom)}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                        style={{
                          background: selected
                            ? "linear-gradient(135deg, oklch(0.65 0.14 10), oklch(0.60 0.13 340))"
                            : "oklch(0.94 0.04 5)",
                          color: selected ? "white" : "oklch(0.45 0.07 10)",
                          border: `1.5px solid ${selected ? "oklch(0.65 0.14 10)" : "oklch(0.86 0.05 340)"}`,
                          boxShadow: selected
                            ? "0 2px 8px oklch(0.72 0.13 10 / 0.25)"
                            : "none",
                        }}
                      >
                        {symptom}
                      </button>
                    );
                  })}
                </div>

                {/* Severity selectors for selected symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {selectedSymptoms.map((s) => (
                      <div
                        key={s.name}
                        className="flex items-center gap-3 flex-wrap"
                      >
                        <span
                          className="text-sm font-medium w-28"
                          style={{ color: "oklch(0.42 0.08 10)" }}
                        >
                          {s.name}:
                        </span>
                        <div className="flex gap-2">
                          {[1, 2, 3].map((sev) => (
                            <button
                              key={sev}
                              type="button"
                              onClick={() => setSeverity(s.name, sev)}
                              className="px-3 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
                              style={{
                                background:
                                  s.severity === sev
                                    ? "oklch(0.65 0.14 10)"
                                    : "oklch(0.94 0.03 5)",
                                color:
                                  s.severity === sev
                                    ? "white"
                                    : "oklch(0.48 0.06 10)",
                                border: `1px solid ${s.severity === sev ? "oklch(0.65 0.14 10)" : "oklch(0.86 0.05 340)"}`,
                              }}
                            >
                              {SEVERITY_LABELS[sev]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label
                  htmlFor="notes"
                  className="font-dancing text-xl font-semibold block"
                  style={{ color: "oklch(0.50 0.12 10)" }}
                >
                  Your Notes 📔
                </label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling today? Write anything... 💕"
                  data-ocid="log.notes.textarea"
                  rows={4}
                  className="rounded-xl resize-none"
                  style={{ borderColor: "oklch(0.85 0.07 340)" }}
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col items-center gap-3">
                {saveStatus === "saved" && (
                  <div
                    data-ocid="log.success_state"
                    className="text-center p-3 rounded-2xl w-full animate-fade-in-up"
                    style={{
                      background: "oklch(0.92 0.06 150)",
                      color: "oklch(0.35 0.12 150)",
                    }}
                  >
                    ✅ Entry saved beautifully! Your cycle is being cared for 💕
                  </div>
                )}
                <Button
                  type="submit"
                  data-ocid="log.submit_button"
                  disabled={saveStatus === "saving" || !startDate}
                  className="w-full rounded-2xl py-6 text-lg font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.14 10), oklch(0.60 0.13 340))",
                    boxShadow: "0 6px 24px oklch(0.72 0.13 10 / 0.30)",
                    border: "none",
                  }}
                >
                  {saveStatus === "saving" ? (
                    <span
                      data-ocid="log.loading_state"
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving your entry...
                    </span>
                  ) : (
                    "Save Entry 💾"
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history">
            <div className="space-y-4">
              {entriesLoading ? (
                <div data-ocid="log.loading_state" className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-3xl" />
                  ))}
                </div>
              ) : !entries || entries.length === 0 ? (
                <div
                  data-ocid="log.empty_state"
                  className="text-center py-16 rounded-3xl"
                  style={{
                    background: "oklch(0.99 0.008 5)",
                    border: "1.5px dashed oklch(0.85 0.06 340)",
                  }}
                >
                  <div className="text-5xl mb-4">🌸</div>
                  <p
                    className="font-dancing text-2xl font-semibold mb-2"
                    style={{ color: "oklch(0.55 0.10 10)" }}
                  >
                    No entries yet
                  </p>
                  <p className="text-muted-foreground">
                    Start logging your cycle! 🌸
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-2xl"
                    onClick={() => setActiveTab("log")}
                  >
                    Add your first entry 💕
                  </Button>
                </div>
              ) : (
                [...entries]
                  .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                  .map((entry, idx) => (
                    <PeriodEntryCard
                      key={entry.id.toString()}
                      entry={entry}
                      index={idx + 1}
                      onDelete={() => {
                        deleteEntry.mutate(entry.id, {
                          onSuccess: () => toast.success("Entry deleted 💕"),
                          onError: () =>
                            toast.error("Couldn't delete. Please try again."),
                        });
                      }}
                    />
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function PeriodEntryCard({
  entry,
  index,
  onDelete,
}: {
  entry: {
    id: bigint;
    startDate: string;
    endDate: string;
    notes: string;
    symptoms: Array<{ name: string; severity: bigint }>;
  };
  index: number;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-ocid={`log.item.${index}`}
      className="rounded-3xl p-6 transition-all"
      style={{
        background: "oklch(0.99 0.008 5)",
        border: "1.5px solid oklch(0.90 0.04 340)",
        boxShadow: "0 4px 16px oklch(0.72 0.13 10 / 0.08)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="font-dancing text-xl font-semibold"
              style={{ color: "oklch(0.50 0.12 10)" }}
            >
              🌸 {entry.startDate}
            </span>
            {entry.endDate && (
              <>
                <span className="text-muted-foreground text-sm">→</span>
                <span
                  className="font-dancing text-xl font-semibold"
                  style={{ color: "oklch(0.55 0.10 300)" }}
                >
                  🌙 {entry.endDate}
                </span>
              </>
            )}
          </div>

          {/* Symptoms */}
          {entry.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {entry.symptoms.map((s) => (
                <span
                  key={s.name}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${SEVERITY_COLORS[Number(s.severity)] || "bg-gray-100 text-gray-700"}`}
                >
                  {s.name} · {SEVERITY_LABELS[Number(s.severity)]}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {entry.notes && (
            <div>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "oklch(0.42 0.06 10)",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: expanded ? undefined : 2,
                  WebkitBoxOrient: "vertical" as const,
                }}
              >
                {entry.notes}
              </p>
              {entry.notes.length > 100 && (
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  className="mt-1 text-xs flex items-center gap-1 transition-colors"
                  style={{ color: "oklch(0.60 0.12 10)" }}
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" /> Read more
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Delete button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              data-ocid={`log.delete_button.${index}`}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
              style={{
                background: "oklch(0.96 0.03 25)",
                color: "oklch(0.55 0.15 25)",
              }}
              aria-label="Delete entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-dancing text-2xl">
                Delete this entry? 💕
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this period entry. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Keep it
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="rounded-xl"
                style={{ background: "oklch(0.57 0.24 27)", color: "white" }}
              >
                Yes, delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// COMFORT CORNER SECTION
// ────────────────────────────────────────────────────────────

function ComfortSection() {
  const [message, setMessage] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const lastIndexRef = useRef(-1);

  const sendHug = () => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * HUG_MESSAGES.length);
    } while (idx === lastIndexRef.current && HUG_MESSAGES.length > 1);
    lastIndexRef.current = idx;
    setMessage(HUG_MESSAGES[idx]);
    setAnimKey((k) => k + 1);
  };

  return (
    <section
      id="comfort"
      data-ocid="comfort.section"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.92 0.06 310) 0%, oklch(0.90 0.07 340) 40%, oklch(0.92 0.06 5) 100%)",
      }}
    >
      <FloatingHearts />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2
          className="font-dancing text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "oklch(0.40 0.12 10)" }}
        >
          Comfort Corner 🤗
        </h2>
        <p className="text-lg mb-10" style={{ color: "oklch(0.48 0.08 10)" }}>
          Need a little pick-me-up? Press the button below 💕
        </p>

        <button
          type="button"
          data-ocid="comfort.primary_button"
          onClick={sendHug}
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-white text-xl font-semibold shadow-rose transition-all hover:scale-105 active:scale-95 animate-pulse-soft"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.14 10), oklch(0.58 0.13 340), oklch(0.60 0.12 300))",
            boxShadow: "0 12px 40px oklch(0.65 0.14 10 / 0.40)",
            fontFamily: "system-ui",
          }}
        >
          <Heart className="w-6 h-6 fill-white" />
          Send Me A Hug 🤗
          <Sparkles className="w-5 h-5" />
        </button>

        {/* Message card */}
        {message && (
          <div
            key={animKey}
            data-ocid="comfort.card"
            className="mt-10 rounded-3xl p-8 animate-bounce-in"
            style={{
              background: "oklch(0.99 0.01 5 / 0.95)",
              border: "2px solid oklch(0.88 0.07 340)",
              boxShadow: "0 8px 40px oklch(0.72 0.13 10 / 0.18)",
            }}
          >
            <p
              className="font-dancing text-2xl md:text-3xl font-semibold"
              style={{ color: "oklch(0.45 0.12 10)", lineHeight: 1.5 }}
            >
              {message}
            </p>
            <div className="mt-4 flex justify-center gap-2 text-2xl">
              {["💕", "🌸", "✨"].map((e, i) => (
                <span
                  key={e}
                  className="animate-drift"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="relative py-12 px-4 text-center overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.93 0.05 340), oklch(0.90 0.06 10))",
      }}
    >
      <FloatingHearts />
      <div className="relative z-10 space-y-3">
        <p
          className="font-dancing text-2xl font-bold"
          style={{ color: "oklch(0.45 0.12 10)" }}
        >
          Made with 💕 just for Haniiiii
        </p>
        <p className="text-sm" style={{ color: "oklch(0.52 0.08 10)" }}>
          You are loved, you are strong, you are enough. 🌸
        </p>
        <p className="text-xs" style={{ color: "oklch(0.58 0.06 10)" }}>
          © {year}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────
// APP ROOT
// ────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <WelcomeSection />
          <MoodSection />
          <SelfCareSection />
          <PeriodLogSection />
          <ComfortSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
