import { IconChevronLeftOffsetLTR } from "@byted-tiktok/tux-icons";
import { useMemo, useState, type CSSProperties } from "react";

type MixKey = "energy" | "story" | "style";
type Mix = Record<MixKey, number>; // integer percent, sum = 100

type PreviewCluster = {
  key: string;
  preview: string;
  energy: number;
  story: number;
  style: number;
};

// Internal clusters only drive the preview visuals; users never pick categories.
const previewClusters: PreviewCluster[] = [
  {
    key: "a",
    preview: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    energy: 0.95,
    story: 0.25,
    style: 0.35,
  },
  {
    key: "b",
    preview: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    energy: 0.55,
    story: 0.2,
    style: 0.95,
  },
  {
    key: "c",
    preview: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    energy: 0.35,
    story: 0.7,
    style: 0.45,
  },
  {
    key: "d",
    preview: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    energy: 0.85,
    story: 0.35,
    style: 0.2,
  },
  {
    key: "e",
    preview: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
    energy: 0.55,
    story: 0.9,
    style: 0.25,
  },
  {
    key: "f",
    preview: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=900&q=80",
    energy: 0.65,
    story: 0.6,
    style: 0.25,
  },
  {
    key: "g",
    preview: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    energy: 0.25,
    story: 0.35,
    style: 0.85,
  },
  {
    key: "h",
    preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    energy: 0.75,
    story: 0.35,
    style: 0.5,
  },
];

type AxisStyle = {
  label: string;
  accent: string;
  accent2: string;
};

const axis: Record<MixKey, AxisStyle> = {
  energy: { label: "Energy", accent: "#FF6A9A", accent2: "#FFC46A" },
  story: { label: "Story", accent: "#7A5CFF", accent2: "#69B7FF" },
  style: { label: "Style", accent: "#22C7A5", accent2: "#7CFFB2" },
};

function navigateHome() {
  window.location.assign("/");
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeMix(raw: Mix): Mix {
  const total = raw.energy + raw.story + raw.style;
  if (total === 100) {
    return raw;
  }
  if (total === 0) {
    return { energy: 34, story: 33, style: 33 };
  }
  const energy = clampPercent((raw.energy / total) * 100);
  const story = clampPercent((raw.story / total) * 100);
  const style = clampPercent(100 - energy - story);
  return { energy, story, style: clampPercent(style) };
}

function applyLockedAxis(current: Mix, axis: MixKey, nextValue: number): Mix {
  const next = clampPercent(nextValue);
  const otherKeys: MixKey[] = axis === "energy" ? ["story", "style"] : axis === "story" ? ["energy", "style"] : ["energy", "story"];
  const remaining = 100 - next;
  const otherTotal = current[otherKeys[0]] + current[otherKeys[1]];

  if (otherTotal <= 0) {
    const a = Math.floor(remaining / 2);
    const b = remaining - a;
    return normalizeMix({
      ...current,
      [axis]: next,
      [otherKeys[0]]: a,
      [otherKeys[1]]: b,
    });
  }

  const a = clampPercent((current[otherKeys[0]] / otherTotal) * remaining);
  const b = clampPercent(remaining - a);
  return normalizeMix({
    ...current,
    [axis]: next,
    [otherKeys[0]]: a,
    [otherKeys[1]]: b,
  });
}

function randomMix(): Mix {
  // Simple dirichlet-ish randomization with 3 uniforms.
  const a = Math.random();
  const b = Math.random();
  const c = Math.random();
  const sum = a + b + c;
  return normalizeMix({
    energy: Math.round((a / sum) * 100),
    story: Math.round((b / sum) * 100),
    style: Math.round((c / sum) * 100),
  });
}

function scoreCluster(cluster: PreviewCluster, mix: Mix) {
  const e = mix.energy / 100;
  const s = mix.story / 100;
  const st = mix.style / 100;
  return cluster.energy * e + cluster.story * s + cluster.style * st;
}

function MixerSlider({
  label,
  value,
  onChange,
  accent,
  accent2,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  accent: string;
  accent2: string;
}) {
  const cssVars = {
    ["--fill" as any]: accent,
    ["--fill2" as any]: accent2,
    ["--pct" as any]: `${value}%`,
  } as CSSProperties;

  return (
    <div style={cssVars}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="rounded-full"
            style={{
              width: 10,
              height: 10,
              background: "linear-gradient(135deg, var(--fill), var(--fill2))",
              boxShadow: "0 14px 30px rgba(80, 56, 160, 0.14)",
            }}
          />
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              lineHeight: "16px",
              color: "#14151A",
              letterSpacing: "0.01em",
            }}
          >
            {label}
          </div>
        </div>
        <div
          className="rounded-full px-3 py-1.5"
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 14px 30px rgba(80, 56, 160, 0.10)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 12, lineHeight: "14px", color: "#14151A" }}>
            {value}%
          </div>
        </div>
      </div>

      <div className="mt-3">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          aria-label={`${label} percentage`}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          className="mixer-range"
        />
      </div>
    </div>
  );
}

function MixerStyle() {
  return (
    <style>{`
      .mixer-range {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 34px;
        background: transparent;
        outline: none;
      }

      .mixer-range::-webkit-slider-runnable-track {
        height: 10px;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--fill) 0%, var(--fill2) var(--pct), #EAEAF6 var(--pct), #EAEAF6 100%);
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,0.92),
          0 10px 24px rgba(80, 56, 160, 0.10);
      }

      .mixer-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 26px;
        height: 26px;
        border-radius: 999px;
        margin-top: -8px;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 36%, rgba(255,255,255,0.62) 100%);
        border: 1px solid rgba(255,255,255,0.95);
        box-shadow:
          0 22px 36px rgba(80, 56, 160, 0.16),
          0 2px 0 rgba(255,255,255,0.65) inset,
          0 0 0 8px rgba(255,255,255,0.22);
      }

      .mixer-range::-moz-range-track {
        height: 10px;
        border-radius: 999px;
        background: #EAEAF6;
        border: 1px solid rgba(255,255,255,0.85);
        box-shadow: 0 10px 24px rgba(80, 56, 160, 0.10);
      }

      .mixer-range::-moz-range-progress {
        height: 10px;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--fill), var(--fill2));
      }

      .mixer-range::-moz-range-thumb {
        width: 26px;
        height: 26px;
        border-radius: 999px;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 36%, rgba(255,255,255,0.62) 100%);
        border: 1px solid rgba(255,255,255,0.95);
        box-shadow: 0 22px 36px rgba(80, 56, 160, 0.16);
      }
    `}</style>
  );
}

export default function FeedMixerPage() {
  const [mix, setMix] = useState<Mix>({ energy: 34, story: 33, style: 33 });

  const canContinue = true;
  const countLabel = useMemo(() => `Mix · ${mix.energy}/${mix.story}/${mix.style}`, [mix]);

  const previewItems = useMemo(() => {
    const ranked = [...previewClusters]
      .map((cluster) => ({ cluster, score: scoreCluster(cluster, mix) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.cluster);
    return ranked;
  }, [mix]);

  return (
    <div
      className="h-full min-h-0 flex flex-col"
      style={{
        backgroundColor: "#F5F2FF",
        backgroundImage:
          "radial-gradient(circle at 22% 12%, rgba(255, 213, 228, 0.85) 0%, transparent 48%), radial-gradient(circle at 84% 20%, rgba(195, 231, 255, 0.85) 0%, transparent 52%), radial-gradient(circle at 50% 88%, rgba(205, 255, 238, 0.75) 0%, transparent 56%), linear-gradient(180deg, #FAFAFF 0%, #F3F2FF 100%)",
      }}
    >
      <MixerStyle />
      <div className="sm:pt-15.5 px-4 pt-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Back"
            className="rounded-full w-10 h-10 flex items-center justify-center"
            onClick={navigateHome}
            style={{
              backgroundColor: "rgba(255,255,255,0.70)",
              border: "1px solid rgba(255,255,255,0.95)",
              boxShadow: "0 16px 34px rgba(80, 56, 160, 0.12)",
            }}
          >
            <IconChevronLeftOffsetLTR width={22} height={22} />
          </button>
          <button
            type="button"
            aria-label="Skip"
            className="rounded-full px-4 h-10 flex items-center justify-center"
            onClick={navigateHome}
            style={{
              backgroundColor: "rgba(255,255,255,0.70)",
              border: "1px solid rgba(255,255,255,0.95)",
              boxShadow: "0 16px 34px rgba(80, 56, 160, 0.10)",
              color: "#14151A",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Skip
          </button>
        </div>
      </div>

      <div
        className="flex-1 min-h-0 overflow-y-auto hide-scrollbar"
      >
        <div className="px-4 pt-1 pb-36">
          <div className="relative mt-3">
            <div
              className="absolute inset-0 rounded-[52px]"
              style={{
                transform: "rotate(-5deg) translateY(6px)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)",
                border: "1px solid rgba(255,255,255,0.80)",
                boxShadow: "0 28px 80px rgba(74, 60, 140, 0.12)",
              }}
            />
            <div
              className="absolute inset-0 rounded-[52px]"
              style={{
                transform: "rotate(4deg) translateY(12px)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.30) 100%)",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 28px 80px rgba(74, 60, 140, 0.10)",
              }}
            />
          <div
            className="relative rounded-[52px] p-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 100%)",
              border: "1px solid rgba(255,255,255,0.95)",
              boxShadow:
                "0 26px 70px rgba(74, 60, 140, 0.16), inset 0 1px 0 rgba(255,255,255,0.60)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="max-w-[210px]">
                  <div style={{ fontWeight: 800, fontSize: 28, lineHeight: "32px", color: "#14151A" }}>
                    Mix your feed
                  </div>
                </div>
                <div className="mt-1">
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#6B6E7A" }}>
                    Energy · Story · Style
                  </div>
                </div>
              </div>
              <div
                className="shrink-0 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 12px 26px rgba(74,60,140,0.10)",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 12, color: "#14151A" }}>{countLabel}</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMix(randomMix())}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: "rgba(255,255,255,0.86)",
                  border: "1px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 14px 26px rgba(74,60,140,0.10)",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 13, color: "#14151A" }}>Random</div>
              </button>
              <button
                type="button"
                onClick={() => setMix({ energy: 34, story: 33, style: 33 })}
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: "rgba(255,255,255,0.86)",
                  border: "1px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 14px 26px rgba(74,60,140,0.10)",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 13, color: "#14151A" }}>Reset</div>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <MixerSlider
                label={axis.energy.label}
                value={mix.energy}
                onChange={(value) => setMix((current) => applyLockedAxis(current, "energy", value))}
                accent={axis.energy.accent}
                accent2={axis.energy.accent2}
              />
              <MixerSlider
                label={axis.story.label}
                value={mix.story}
                onChange={(value) => setMix((current) => applyLockedAxis(current, "story", value))}
                accent={axis.story.accent}
                accent2={axis.story.accent2}
              />
              <MixerSlider
                label={axis.style.label}
                value={mix.style}
                onChange={(value) => setMix((current) => applyLockedAxis(current, "style", value))}
                accent={axis.style.accent}
                accent2={axis.style.accent2}
              />
            </div>

            <div className="mt-5">
              <div style={{ fontWeight: 800, fontSize: 13, color: "#6B6E7A" }}>Preview</div>
              <div className="mt-3 relative h-[174px]">
                {previewItems.map((item, index) => (
                  <div
                    key={item.key}
                    className="absolute overflow-hidden rounded-[28px]"
                    style={{
                      width: 240,
                      height: 160,
                      left: index * 26,
                      top: index * 8,
                      transform: `rotate(${(index - 1) * 6}deg)`,
                      backgroundColor: "rgba(255,255,255,0.86)",
                      border: "1px solid rgba(255,255,255,0.95)",
                      boxShadow: "0 26px 60px rgba(74, 60, 140, 0.14)",
                    }}
                  >
                    <img
                      src={item.preview}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{
                        filter: "saturate(0.72) contrast(1.02) brightness(0.92)",
                        transform: "scale(1.02)",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.0) 42%, rgba(0,0,0,0.10) 100%)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>

        </div>
      </div>

      <div
        className="right-0 left-0 z-20 absolute px-4 pt-3"
        style={{
          bottom: "max(10px, env(safe-area-inset-bottom, 0px))",
          background:
            "linear-gradient(to top, rgba(242,242,255,0.92) 54%, rgba(242,242,255,0) 100%)",
        }}
      >
        <div
          className="rounded-[28px] p-2"
          style={{
            backgroundColor: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 18px 44px rgba(74, 60, 140, 0.12)",
            backdropFilter: "blur(18px)",
          }}
        >
          <button
            type="button"
            aria-label="Start my feed"
            disabled={!canContinue}
            className="w-full h-[52px] rounded-full flex items-center justify-center"
            onClick={canContinue ? navigateHome : undefined}
            style={{
              background: canContinue
                ? "linear-gradient(90deg, #FF5C7A 0%, #6C5CE7 36%, #74B9FF 72%, #55EFC4 100%)"
                : "rgba(255,255,255,0.60)",
              border: "1px solid rgba(255,255,255,0.95)",
              boxShadow:
                "0 18px 44px rgba(74, 60, 140, 0.18), inset 0 1px 0 rgba(255,255,255,0.55)",
              opacity: canContinue ? 1 : 0.7,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 16, color: "#14151A" }}>Start My Feed</div>
          </button>
        </div>
      </div>
    </div>
  );
}
