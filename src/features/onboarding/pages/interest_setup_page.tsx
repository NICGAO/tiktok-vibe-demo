import { TUXButton, TUXNavBar, TUXText, getColorCSSVar } from "@byted-tiktok/tux-web";
import {
  IconChevronLeftOffsetLTR,
  TUXIconBellFill,
  TUXIconBookmarkFill,
  TUXIconLIVETVFill,
  TUXIconMessageSmileFill,
  TUXIconMusicNoteFill,
  TUXIconPersonStar,
  TUXIconPlayFill,
  TUXIconShoppingCartFillLTR,
} from "@byted-tiktok/tux-icons";
import { useMemo, useState, type ReactNode } from "react";

type InterestOption = {
  key: string;
  label: string;
  accent: string;
  blurb: string;
  imageUrl: string;
  icon: ReactNode;
};

const interestOptions: InterestOption[] = [
  {
    key: "live-music",
    label: "Live Music",
    accent: "LOUD",
    blurb: "Festival nights, fan edits, main-character choruses.",
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    icon: <TUXIconMusicNoteFill size={16} />,
  },
  {
    key: "street-style",
    label: "Street Style",
    accent: "COOL",
    blurb: "Looks, drops, and outfits with instant save energy.",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    icon: <TUXIconShoppingCartFillLTR size={16} />,
  },
  {
    key: "creator-lore",
    label: "Creator Lore",
    accent: "INSIDE",
    blurb: "Behind-the-scenes moments, fandom, and recurring characters.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    icon: <TUXIconPersonStar size={16} />,
  },
  {
    key: "late-night-live",
    label: "Late Night LIVE",
    accent: "RAW",
    blurb: "Unfiltered streams, chaos, and after-dark energy.",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    icon: <TUXIconLIVETVFill size={16} />,
  },
  {
    key: "mini-dramas",
    label: "Mini Dramas",
    accent: "PLOT",
    blurb: "Short stories, tension, and cliffhangers that hit fast.",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
    icon: <TUXIconPlayFill size={16} />,
  },
  {
    key: "commentary",
    label: "Hot Commentary",
    accent: "TALK",
    blurb: "Sharp takes, reaction videos, and timeline discourse.",
    imageUrl: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=900&q=80",
    icon: <TUXIconMessageSmileFill size={16} />,
  },
  {
    key: "wishlist",
    label: "Wishlists",
    accent: "SAVE",
    blurb: "Objects of desire, design picks, and future buys.",
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    icon: <TUXIconBookmarkFill size={16} />,
  },
  {
    key: "pop-alerts",
    label: "Pop Alerts",
    accent: "EARLY",
    blurb: "Launches, premieres, drops, and trend heat.",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    icon: <TUXIconBellFill size={16} />,
  },
];

const wheelSize = 286;
const orbitRadius = 104;
const segmentAngle = 360 / interestOptions.length;

function navigateHome() {
  window.location.assign("/");
}

function pickRandomInterestKeys(count: number) {
  const shuffled = [...interestOptions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((item) => item.key);
}

function getNextRotation(currentRotation: number, nextIndex: number) {
  const currentNormalized = ((currentRotation % 360) + 360) % 360;
  const desiredNormalized = (360 - nextIndex * segmentAngle) % 360;
  const delta = (desiredNormalized - currentNormalized + 360) % 360;
  return currentRotation + 720 + delta;
}

export default function InterestSetupPage() {
  const [showSeparator, setShowSeparator] = useState(false);
  const [selectedInterestKeys, setSelectedInterestKeys] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const activeOption = interestOptions[activeIndex];
  const canContinue = selectedInterestKeys.length > 0;
  const selectedCountLabel = useMemo(() => `${selectedInterestKeys.length} picked`, [selectedInterestKeys]);

  const toggleSelected = (key: string) => {
    setSelectedInterestKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  const toggleActiveOption = () => {
    toggleSelected(activeOption.key);
  };

  const applyQuickPick = () => {
    const picked = pickRandomInterestKeys(3);
    setSelectedInterestKeys(picked);
    const firstPickedIndex = interestOptions.findIndex((item) => item.key === picked[0]);

    if (firstPickedIndex >= 0) {
      setActiveIndex(firstPickedIndex);
      setRotationDeg(getNextRotation(rotationDeg, firstPickedIndex));
    }
  };

  const spinWheel = () => {
    if (isSpinning) {
      return;
    }

    const currentIndex = activeIndex;
    let nextIndex = Math.floor(Math.random() * interestOptions.length);

    if (nextIndex === currentIndex) {
      nextIndex = (nextIndex + 3) % interestOptions.length;
    }

    const nextRotation = getNextRotation(rotationDeg, nextIndex);
    setIsSpinning(true);
    setRotationDeg(nextRotation);

    window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setIsSpinning(false);
    }, 1100);
  };

  return (
    <div
      className="h-full min-h-0 flex flex-col"
      style={{
        backgroundColor: getColorCSSVar("UIPageFlat1"),
        backgroundImage:
          "radial-gradient(circle at top, color-mix(in srgb, var(--tux-v2-color-ui-shape-primary) 12%, transparent) 0%, transparent 36%)",
      }}
    >
      <div className="sm:pt-15.5">
        <TUXNavBar
          heightPreset={44}
          fixed={false}
          showSeparator={showSeparator}
          backgroundColor="UIPageFlat1"
          leading={
            <button
              type="button"
              aria-label="Back to main app"
              className="flex items-center justify-center w-10.5 h-11"
              onClick={navigateHome}
            >
              <IconChevronLeftOffsetLTR width={22} height={22} />
            </button>
          }
          trailing={
            <button
              type="button"
              aria-label="Skip interest selection"
              className="pr-4 h-11 min-w-12 flex items-center justify-end"
              onClick={navigateHome}
            >
              <TUXText typographyPreset="P2-Semibold" color="UIText3">
                Skip
              </TUXText>
            </button>
          }
        />
      </div>

      <div
        className="flex-1 min-h-0 overflow-y-auto hide-scrollbar"
        onScroll={(event) => {
          const nextShowSeparator = event.currentTarget.scrollTop > 8;
          setShowSeparator((current) => (current === nextShowSeparator ? current : nextShowSeparator));
        }}
      >
        <div className="px-4 pt-1 pb-36">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="max-w-[218px]">
                <TUXText as="h1" typographyPreset="LargeTitle-Bold" color="UIText1">
                  Spin your mood.
                </TUXText>
              </div>
              <div className="mt-1">
                <TUXText typographyPreset="P3-Regular" color="UIText3">
                  Land on a vibe. Build your feed.
                </TUXText>
              </div>
            </div>
            <div
              className="shrink-0 rounded-full px-2.5 py-1"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 15%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 18%, transparent)",
                backdropFilter: "blur(18px)",
              }}
            >
              <TUXText typographyPreset="SmallText1-Semibold" color="UIText1">
                {selectedCountLabel}
              </TUXText>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <TUXButton
              text="Surprise Me"
              themePreset="secondary"
              shapePreset="capsule"
              sizePreset="small"
              paddingInline="16px"
              height="36px"
              backgroundColor="UIPageFlat1"
              borderStyle="solid"
              borderWidth="0.5px"
              borderColor="UIShapeNeutral3"
              onClick={applyQuickPick}
            />
          </div>

          <div className="mt-4 flex justify-center">
            <div
              className="relative"
              style={{
                width: wheelSize,
                height: wheelSize,
              }}
            >
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: getColorCSSVar("UIPageFlat1"),
                  border: `1px solid ${getColorCSSVar("UIShapeNeutral3")}`,
                  clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                  boxShadow: `0 8px 18px color-mix(in srgb, ${getColorCSSVar("UIShapePrimary")} 18%, transparent)`,
                }}
              />

              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 16%, transparent) 0%, color-mix(in srgb, var(--tux-v2-color-ui-page-flat-2) 88%, transparent) 68%)",
                  border: `1px solid ${getColorCSSVar("UIShapeNeutral3")}`,
                  boxShadow:
                    "inset 0 1px 0 color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 16%, transparent), 0 24px 50px color-mix(in srgb, var(--tux-v2-color-ui-shape-primary) 10%, transparent)",
                  backdropFilter: "blur(22px)",
                }}
              />

              <div
                className="absolute inset-[18px] rounded-full"
                style={{
                  border: `1px dashed ${getColorCSSVar("UIShapeNeutral3")}`,
                  opacity: 0.48,
                }}
              />

              <div
                className="absolute inset-0"
                style={{
                  transform: `rotate(${rotationDeg}deg)`,
                  transition: isSpinning ? "transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                }}
              >
                {interestOptions.map((option, index) => {
                  const angle = index * segmentAngle - 90;
                  const radian = (angle * Math.PI) / 180;
                  const left = wheelSize / 2 + Math.cos(radian) * orbitRadius;
                  const top = wheelSize / 2 + Math.sin(radian) * orbitRadius;
                  const selected = selectedInterestKeys.includes(option.key);
                  const isActive = option.key === activeOption.key;

                  return (
                    <div
                      key={option.key}
                      className="absolute"
                      style={{
                        left,
                        top,
                        transform: `translate(-50%, -50%) rotate(${-rotationDeg}deg)`,
                      }}
                    >
                      <div
                        className="overflow-hidden rounded-[22px] w-[92px] h-[64px]"
                        style={{
                          border: `1px solid ${isActive ? getColorCSSVar("UIShapePrimary") : "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 12%, transparent)"}`,
                          boxShadow: isActive
                            ? `0 10px 24px color-mix(in srgb, ${getColorCSSVar("UIShapePrimary")} 18%, transparent)`
                            : "none",
                        }}
                      >
                        <img
                          src={option.imageUrl}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          style={{
                            filter: "saturate(0.82) brightness(0.76) contrast(1.02)",
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: isActive
                              ? "linear-gradient(180deg, color-mix(in srgb, var(--tux-v2-color-ui-shape-primary) 22%, transparent) 0%, var(--tux-v2-color-ui-image-overlay-black-a50) 100%)"
                              : "linear-gradient(180deg, color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-black-a15) 52%, transparent) 0%, var(--tux-v2-color-ui-image-overlay-black-a50) 100%)",
                          }}
                        />
                        <div className="relative h-full p-2.5 flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="inline-flex items-center justify-center rounded-full w-5 h-5"
                              style={{
                                backgroundColor: selected
                                  ? getColorCSSVar("UIShapePrimary")
                                  : "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 18%, transparent)",
                                color: "var(--tux-v2-color-ui-image-overlay-white)",
                              }}
                            >
                              {option.icon}
                            </span>
                            <TUXText typographyPreset="SmallText1-Semibold" color="UIImageOverlayWhite">
                              {option.accent}
                            </TUXText>
                          </div>
                          <TUXText typographyPreset="P3-Semibold" color="UIImageOverlayWhite">
                            {option.label}
                          </TUXText>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  aria-label={isSpinning ? "Spinning mood wheel" : "Spin mood wheel"}
                  disabled={isSpinning}
                  className="rounded-full flex flex-col items-center justify-center"
                  onClick={spinWheel}
                  style={{
                    width: 112,
                    height: 112,
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 22%, transparent) 0%, color-mix(in srgb, var(--tux-v2-color-ui-page-flat-2) 96%, transparent) 100%)",
                    border: `1px solid ${getColorCSSVar("UIShapeNeutral3")}`,
                    boxShadow:
                      "inset 0 1px 0 color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 18%, transparent), 0 18px 40px color-mix(in srgb, var(--tux-v2-color-ui-shape-primary) 12%, transparent)",
                    backdropFilter: "blur(22px)",
                    transform: isSpinning ? "scale(0.98)" : "scale(1)",
                    transition: "transform 200ms ease",
                  }}
                >
                  <TUXText typographyPreset="H4-Semibold" color="UIText1">
                    {isSpinning ? "Spinning" : "Spin"}
                  </TUXText>
                  <TUXText typographyPreset="P3-Regular" color="UIText3">
                    Mood wheel
                  </TUXText>
                </button>
              </div>
            </div>
          </div>

          <div
            className="mt-4 overflow-hidden rounded-[28px]"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 12%, var(--tux-v2-color-ui-page-flat-2))",
              border: `1px solid ${getColorCSSVar("UIShapeNeutral3")}`,
              boxShadow:
                "inset 0 1px 0 color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 14%, transparent)",
              backdropFilter: "blur(18px)",
            }}
          >
            <div className="relative h-[116px]">
              <img
                src={activeOption.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "saturate(0.86) brightness(0.72)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-black-a50) 92%, transparent) 0%, color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-black-a15) 52%, transparent) 55%, transparent 100%)",
                }}
              />
              <div className="relative h-full p-4 flex items-center justify-between gap-3">
                <div className="min-w-0 max-w-[180px]">
                  <TUXText typographyPreset="P3-Semibold" color="UIImageOverlayWhite">
                    {activeOption.accent}
                  </TUXText>
                  <div className="mt-1">
                    <TUXText typographyPreset="H4-Semibold" color="UIImageOverlayWhite">
                      {activeOption.label}
                    </TUXText>
                  </div>
                  <div className="mt-1">
                    <TUXText typographyPreset="P3-Regular" color="UIImageOverlayWhite">
                      {activeOption.blurb}
                    </TUXText>
                  </div>
                </div>
                <div className="shrink-0">
                  <TUXButton
                    text={selectedInterestKeys.includes(activeOption.key) ? "Saved" : "Add"}
                    themePreset={selectedInterestKeys.includes(activeOption.key) ? "primary" : "secondary"}
                    shapePreset="capsule"
                    sizePreset="small"
                    paddingInline="16px"
                    height="36px"
                    onClick={toggleActiveOption}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedInterestKeys.length > 0 ? (
              interestOptions
                .filter((option) => selectedInterestKeys.includes(option.key))
                .map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className="rounded-full px-3 py-1.5"
                    onClick={() => toggleSelected(option.key)}
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 16%, transparent)",
                      border: `1px solid ${getColorCSSVar("UIShapeNeutral3")}`,
                    }}
                  >
                    <TUXText typographyPreset="SmallText1-Semibold" color="UIText1">
                      {option.label}
                    </TUXText>
                  </button>
                ))
            ) : (
              <TUXText typographyPreset="P3-Regular" color="UIText3">
                Spin and save a few moods.
              </TUXText>
            )}
          </div>
        </div>
      </div>

      <div
        className="right-0 left-0 z-20 absolute px-4 pt-3"
        style={{
          bottom: "max(10px, env(safe-area-inset-bottom, 0px))",
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--tux-v2-color-ui-page-flat-1) 96%, transparent) 54%, color-mix(in srgb, var(--tux-v2-color-ui-page-flat-1) 0%, transparent) 100%)",
        }}
      >
        <div
          className="rounded-[28px] p-2"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 14%, var(--tux-v2-color-ui-page-flat-2))",
            border: "1px solid color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 18%, transparent)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "inset 0 1px 0 color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 18%, transparent)",
          }}
        >
          <button
            type="button"
            aria-label={canContinue ? "Start my feed" : "Spin and pick one mood"}
            disabled={!canContinue}
            className="w-full h-[52px] rounded-full flex items-center justify-center"
            onClick={canContinue ? navigateHome : undefined}
            style={{
              background: canContinue
                ? "linear-gradient(180deg, color-mix(in srgb, var(--tux-v2-color-ui-shape-primary) 92%, white 8%) 0%, var(--tux-v2-color-ui-shape-primary) 100%)"
                : getColorCSSVar("UIPageFlat1"),
              border: `0.5px solid ${canContinue ? "color-mix(in srgb, var(--tux-v2-color-ui-shape-primary) 60%, white 40%)" : getColorCSSVar("UIShapeNeutral3")}`,
              boxShadow: canContinue
                ? `0 14px 30px color-mix(in srgb, ${getColorCSSVar("UIShapePrimary")} 28%, transparent), inset 0 1px 0 color-mix(in srgb, white 45%, transparent)`
                : "none",
              opacity: canContinue ? 1 : 0.7,
            }}
          >
            <TUXText typographyPreset="H4-Semibold" color={canContinue ? "UIShapeText1OnPrimary" : "UIText3"}>
              {canContinue ? "Start My Feed" : "Spin and pick one"}
            </TUXText>
          </button>
        </div>
      </div>
    </div>
  );
}
