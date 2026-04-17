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

// Only used to drive preview visuals; users never pick categories.
const previewClusters: PreviewCluster[] = [
  {
    key: "a",
    preview: "/mixer-previews/a.jpg",
    energy: 0.95,
    story: 0.25,
    style: 0.35,
  },
  {
    key: "b",
    preview: "/mixer-previews/b.jpg",
    energy: 0.55,
    story: 0.2,
    style: 0.95,
  },
  {
    key: "c",
    preview: "/mixer-previews/c.jpg",
    energy: 0.35,
    story: 0.7,
    style: 0.45,
  },
  {
    key: "d",
    preview: "/mixer-previews/d.jpg",
    energy: 0.85,
    story: 0.35,
    style: 0.2,
  },
  {
    key: "e",
    preview: "/mixer-previews/e.jpg",
    energy: 0.55,
    story: 0.9,
    style: 0.25,
  },
  {
    key: "f",
    preview: "/mixer-previews/f.jpg",
    energy: 0.65,
    story: 0.6,
    style: 0.25,
  },
  {
    key: "g",
    preview: "/mixer-previews/g.jpg",
    energy: 0.25,
    story: 0.35,
    style: 0.85,
  },
  {
    key: "h",
    preview: "/mixer-previews/h.jpg",
    energy: 0.75,
    story: 0.35,
    style: 0.5,
  },
];

type AxisStyle = {
  label: string;
  gradA: string;
  gradB: string;
};

// Muted, premium accents (not candy neon).
const axis: Record<MixKey, AxisStyle> = {
  energy: { label: "Energy", gradA: "#7A5CFF", gradB: "#A08BFF" },
  story: { label: "Story", gradA: "#2D9CDB", gradB: "#7BC8F6" },
  style: { label: "Style", gradA: "#2ABF8B", gradB: "#7BE3C3" },
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

function randomMix(): Mix {
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

function Styles() {
  return (
    <style>{`
      .clean-bg {
        background: radial-gradient(circle at 20% 0%, rgba(210, 224, 255, 0.55) 0%, rgba(244, 244, 246, 0) 45%),
                    radial-gradient(circle at 90% 10%, rgba(223, 255, 244, 0.55) 0%, rgba(244, 244, 246, 0) 45%),
                    linear-gradient(180deg, #F4F4F6 0%, #F1F2F5 100%);
      }

      .soft-card {
        background: linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.86) 100%);
        border: 1px solid rgba(255,255,255,0.95);
        box-shadow: 0 20px 50px rgba(17, 19, 28, 0.10);
      }

      .soft-chip {
        background: rgba(255,255,255,0.72);
        border: 1px solid rgba(255,255,255,0.95);
        box-shadow: 0 10px 24px rgba(17, 19, 28, 0.08);
      }

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
  );
}

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
  const cssVars = {
    ["--fill" as any]: gradA,
    ["--fill2" as any]: gradB,
    ["--pct" as any]: `${value}%`,
  } as CSSProperties;

  return (
    <div style={cssVars}>
      <div className="flex items-center justify-between gap-3">
        <div style={{ fontWeight: 800, fontSize: 13, color: "#12131A" }}>{label}</div>
        <div className="soft-chip rounded-full px-3 py-1.5">
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

export default function FeedMixerPageCleanV2() {
  const [mix, setMix] = useState<Mix>({ energy: 34, story: 33, style: 33 });

  const countLabel = useMemo(() => `Mix · ${mix.energy}/${mix.story}/${mix.style}`, [mix]);
  const previewItems = useMemo(() => {
    return [...previewClusters]
      .map((cluster) => ({ cluster, score: scoreCluster(cluster, mix) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.cluster);
  }, [mix]);

  return (
    <div className="h-full min-h-0 flex flex-col clean-bg">
      <Styles />

      <div className="px-4 pt-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Back"
            className="soft-chip rounded-full w-10 h-10 flex items-center justify-center"
            onClick={navigateHome}
          >
            <IconChevronLeftOffsetLTR width={22} height={22} />
          </button>
          <button
            type="button"
            aria-label="Skip"
            className="soft-chip rounded-full px-4 h-10 flex items-center justify-center"
            onClick={navigateHome}
            style={{ fontWeight: 800, fontSize: 13, color: "#12131A" }}
          >
            Skip
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        <div className="px-4 pt-4 pb-32">
          <div className="relative">
            <div className="relative soft-card rounded-[46px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div style={{ fontWeight: 900, fontSize: 28, lineHeight: "32px", color: "#12131A" }}>
                    Feed Mixer
                  </div>
                  <div className="mt-1" style={{ fontWeight: 600, fontSize: 13, color: "#6B6E7A" }}>
                    Energy · Story · Style
                  </div>
                </div>
                <div className="soft-chip rounded-full px-3 py-1.5">
                  <div style={{ fontWeight: 900, fontSize: 12, color: "#12131A" }}>{countLabel}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  className="soft-chip rounded-full px-4 py-2"
                  onClick={() => setMix(randomMix())}
                  style={{ fontWeight: 900, fontSize: 13, color: "#12131A" }}
                >
                  Random
                </button>
                <button
                  type="button"
                  className="soft-chip rounded-full px-4 py-2"
                  onClick={() => setMix({ energy: 34, story: 33, style: 33 })}
                  style={{ fontWeight: 900, fontSize: 13, color: "#12131A" }}
                >
                  Reset
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <SliderRow
                  label={axis.energy.label}
                  value={mix.energy}
                  onChange={(value) => setMix((current) => applyLockedAxis(current, "energy", value))}
                  gradA={axis.energy.gradA}
                  gradB={axis.energy.gradB}
                />
                <SliderRow
                  label={axis.story.label}
                  value={mix.story}
                  onChange={(value) => setMix((current) => applyLockedAxis(current, "story", value))}
                  gradA={axis.story.gradA}
                  gradB={axis.story.gradB}
                />
                <SliderRow
                  label={axis.style.label}
                  value={mix.style}
                  onChange={(value) => setMix((current) => applyLockedAxis(current, "style", value))}
                  gradA={axis.style.gradA}
                  gradB={axis.style.gradB}
                />
              </div>

              <div className="mt-6">
                <div style={{ fontWeight: 900, fontSize: 13, color: "#6B6E7A" }}>Preview</div>
                <div className="mt-3 flex gap-3">
                  {previewItems.map((item) => (
                    <div
                      key={item.key}
                      className="relative overflow-hidden rounded-[28px]"
                      style={{
                        width: 110,
                        height: 148,
                        background: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(255,255,255,0.95)",
                        boxShadow: "0 18px 44px rgba(17, 19, 28, 0.10)",
                      }}
                    >
                      <img
                        src={item.preview}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{
                          filter: "saturate(0.72) contrast(1.02) brightness(0.98)",
                          transform: "scale(1.02)",
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.0) 55%, rgba(0,0,0,0.10) 100%)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  aria-label="Start My Feed"
                  className="w-full h-[52px] rounded-full flex items-center justify-center"
                  onClick={navigateHome}
                  style={{
                    background: "linear-gradient(180deg, #FFFFFF 0%, #F4F5FA 100%)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    boxShadow: "0 18px 44px rgba(17, 19, 28, 0.12)",
                    color: "#12131A",
                    fontWeight: 900,
                    fontSize: 16,
                  }}
                >
                  Start My Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
