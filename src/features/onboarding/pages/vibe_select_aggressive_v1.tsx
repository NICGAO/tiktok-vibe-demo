import { useMemo, useState } from "react";

type VibeKey =
  | "chaos"
  | "glow"
  | "cozy"
  | "cinema"
  | "hot-takes"
  | "deep-dive"
  | "aesthetic"
  | "live-wire";

type Mix = { energy: number; story: number; style: number }; // 0..100, sum=100-ish (demo)

type Vibe = {
  key: VibeKey;
  title: string;
  subtitle: string;
  mix: Mix;
};

const vibes: Vibe[] = [
  {
    key: "chaos",
    title: "CHAOS",
    subtitle: "Fast cuts. Loud edits. No chill.",
    mix: { energy: 78, story: 12, style: 10 },
  },
  {
    key: "glow",
    title: "GLOW",
    subtitle: "Shiny moments. Polished vibes.",
    mix: { energy: 34, story: 18, style: 48 },
  },
  {
    key: "cozy",
    title: "COZY",
    subtitle: "Soft focus. Small joys.",
    mix: { energy: 22, story: 34, style: 44 },
  },
  {
    key: "cinema",
    title: "CINEMA",
    subtitle: "Mood. Story. Visual tension.",
    mix: { energy: 28, story: 54, style: 18 },
  },
  {
    key: "hot-takes",
    title: "HOT TAKES",
    subtitle: "Opinion velocity, zero filler.",
    mix: { energy: 52, story: 44, style: 4 },
  },
  {
    key: "deep-dive",
    title: "DEEP DIVE",
    subtitle: "Niche loops. Context. Rabbit holes.",
    mix: { energy: 18, story: 66, style: 16 },
  },
  {
    key: "aesthetic",
    title: "AESTHETIC",
    subtitle: "Taste first. Save everything.",
    mix: { energy: 20, story: 12, style: 68 },
  },
  {
    key: "live-wire",
    title: "LIVE WIRE",
    subtitle: "Streams. Reactions. Real-time heat.",
    mix: { energy: 66, story: 26, style: 8 },
  },
];

type MixKey = keyof Mix;

function navigateHome() {
  window.location.assign("/");
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeMix(raw: Mix): Mix {
  const total = raw.energy + raw.story + raw.style;
  if (total === 100) return raw;
  if (total === 0) return { energy: 34, story: 33, style: 33 };
  const energy = clampPercent((raw.energy / total) * 100);
  const story = clampPercent((raw.story / total) * 100);
  const style = clampPercent(100 - energy - story);
  return { energy, story, style: clampPercent(style) };
}

function applyLockedAxis(current: Mix, axisKey: MixKey, nextValue: number): Mix {
  const next = clampPercent(nextValue);
  const otherKeys: MixKey[] =
    axisKey === "energy" ? ["story", "style"] : axisKey === "story" ? ["energy", "style"] : ["energy", "story"];

  const remaining = 100 - next;
  const otherTotal = current[otherKeys[0]] + current[otherKeys[1]];

  if (otherTotal <= 0) {
    const a = Math.floor(remaining / 2);
    const b = remaining - a;
    return normalizeMix({
      ...current,
      [axisKey]: next,
      [otherKeys[0]]: a,
      [otherKeys[1]]: b,
    });
  }

  const a = clampPercent((current[otherKeys[0]] / otherTotal) * remaining);
  const b = clampPercent(remaining - a);
  return normalizeMix({
    ...current,
    [axisKey]: next,
    [otherKeys[0]]: a,
    [otherKeys[1]]: b,
  });
}

const axisStyle: Record<MixKey, { label: string; gradA: string; gradB: string }> = {
  energy: { label: "Energy", gradA: "#7A5CFF", gradB: "#A08BFF" },
  story: { label: "Story", gradA: "#2D9CDB", gradB: "#7BC8F6" },
  style: { label: "Style", gradA: "#2ABF8B", gradB: "#7BE3C3" },
};

function SliderRow({
  label,
  value,
  onChange,
  gradA,
  gradB,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  gradA: string;
  gradB: string;
}) {
  return (
    <div
      style={
        {
          ["--fill" as any]: gradA,
          ["--fill2" as any]: gradB,
          ["--pct" as any]: `${value}%`,
        } as any
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div style={{ fontWeight: 800, fontSize: 13, color: "#12131A" }}>{label}</div>
        <div
          className="rounded-full px-3 py-1.5"
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 10px 24px rgba(17, 19, 28, 0.08)",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 12, color: "#12131A" }}>{value}%</div>
        </div>
      </div>
      <div className="mt-3">
        <input
          className="slider"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          aria-label={`${label} percentage`}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
        />
      </div>
    </div>
  );
}

export default function VibeSelectAggressiveV1() {
  const [selected, setSelected] = useState<VibeKey | null>(null);
  const chosen = useMemo(() => vibes.find((v) => v.key === selected) ?? null, [selected]);
  const [mix, setMix] = useState<Mix>({ energy: 34, story: 33, style: 33 });

  return (
    <div className="h-full min-h-0 flex flex-col vibe-lite">
      <style>{`
        .vibe-lite {
          background: radial-gradient(circle at 50% 65%, rgba(180, 240, 255, 0.55) 0%, rgba(245,245,247,0) 55%),
                      linear-gradient(180deg, #F4F4F6 0%, #F1F2F5 100%);
          color: #12131A;
        }

        .glass-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 100%);
          border: 1px solid rgba(255,255,255,0.95);
          border-radius: 46px;
          box-shadow: 0 26px 70px rgba(17, 19, 28, 0.12);
        }

        .chip {
          border-radius: 999px;
          padding: 10px 12px;
          border: 1px solid rgba(18, 19, 26, 0.10);
          background: rgba(255,255,255,0.72);
          box-shadow: 0 10px 24px rgba(17, 19, 28, 0.06);
          transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease, background 120ms ease;
        }

        .chip:active { transform: scale(0.985); }

        .chip[data-selected="true"] {
          background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240, 252, 255, 0.90) 100%);
          border-color: rgba(40, 150, 210, 0.30);
          box-shadow: 0 16px 34px rgba(40, 150, 210, 0.10), 0 10px 24px rgba(17, 19, 28, 0.08);
          transform: translateY(-1px);
        }

        .cta {
          height: 52px;
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.95);
          background: linear-gradient(180deg, #FFFFFF 0%, #F4F5FA 100%);
          box-shadow: 0 18px 44px rgba(17, 19, 28, 0.12);
          font-weight: 900;
          font-size: 16px;
          color: #12131A;
        }

        .cta[disabled] { opacity: 0.55; box-shadow: none; }

        .slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 32px;
          background: transparent;
          outline: none;
        }

        .slider::-webkit-slider-runnable-track {
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--fill) 0%, var(--fill2) var(--pct), #E6E7EC var(--pct), #E6E7EC 100%);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.95);
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 999px;
          margin-top: -8px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 40%, rgba(255,255,255,0.62) 100%);
          border: 1px solid rgba(255,255,255,0.95);
          box-shadow: 0 16px 30px rgba(17, 19, 28, 0.14);
        }

        .slider::-moz-range-track {
          height: 10px;
          border-radius: 999px;
          background: #E6E7EC;
          border: 1px solid rgba(255,255,255,0.95);
        }

        .slider::-moz-range-progress {
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--fill), var(--fill2));
        }

        .slider::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 40%, rgba(255,255,255,0.62) 100%);
          border: 1px solid rgba(255,255,255,0.95);
          box-shadow: 0 16px 30px rgba(17, 19, 28, 0.14);
        }
      `}</style>

      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        <div className="px-4 pt-4 pb-10">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-full"
                  style={{
                    width: 42,
                    height: 42,
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(220, 242, 255, 1) 40%, rgba(190, 230, 255, 1) 100%)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    boxShadow: "0 16px 34px rgba(17, 19, 28, 0.10)",
                  }}
                />
                <div>
                  <div style={{ fontWeight: 900, fontSize: 22, lineHeight: "26px" }}>Pick your vibe</div>
                  <div style={{ marginTop: 4, fontWeight: 600, fontSize: 13, color: "#6B6E7A" }}>
                    Tap once. Start watching.
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label="Skip"
                className="chip"
                onClick={navigateHome}
                style={{ padding: "8px 12px", fontWeight: 800, fontSize: 13, color: "#12131A" }}
              >
                Skip
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {vibes.map((vibe) => (
                <button
                  key={vibe.key}
                  type="button"
                  className="chip"
                  data-selected={selected === vibe.key ? "true" : "false"}
                  onClick={() => {
                    setSelected(vibe.key);
                    setMix(normalizeMix(vibe.mix));
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 12, letterSpacing: "0.02em" }}>{vibe.title}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div style={{ fontWeight: 900, fontSize: 16, color: "#12131A" }}>
                  {chosen ? chosen.title : "Tune your mix"}
                </div>
                <div style={{ marginTop: 4, fontWeight: 600, fontSize: 13, color: "#6B6E7A" }}>
                  {chosen ? chosen.subtitle : "Pick one vibe, then fine-tune Energy · Story · Style."}
                </div>
              </div>
              <div
                className="rounded-full px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 10px 24px rgba(17, 19, 28, 0.08)",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 12, color: "#12131A" }}>
                  {mix.energy}/{mix.story}/{mix.style}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              <SliderRow
                label={axisStyle.energy.label}
                value={mix.energy}
                onChange={(value) => setMix((current) => applyLockedAxis(current, "energy", value))}
                gradA={axisStyle.energy.gradA}
                gradB={axisStyle.energy.gradB}
              />
              <SliderRow
                label={axisStyle.story.label}
                value={mix.story}
                onChange={(value) => setMix((current) => applyLockedAxis(current, "story", value))}
                gradA={axisStyle.story.gradA}
                gradB={axisStyle.story.gradB}
              />
              <SliderRow
                label={axisStyle.style.label}
                value={mix.style}
                onChange={(value) => setMix((current) => applyLockedAxis(current, "style", value))}
                gradA={axisStyle.style.gradA}
                gradB={axisStyle.style.gradB}
              />
            </div>

            <div className="mt-5">
              <button type="button" className="cta" disabled={!selected} onClick={navigateHome}>
                {selected ? "Start My Feed" : "Pick One Vibe"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
