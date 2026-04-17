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
  imageSeed: string;
  icon: ReactNode;
};

const interestOptions: InterestOption[] = [
  {
    key: "live-music",
    label: "Live Music",
    accent: "LOUD",
    imageSeed: "simple-live-music",
    icon: <TUXIconMusicNoteFill size={16} />,
  },
  {
    key: "street-style",
    label: "Street Style",
    accent: "COOL",
    imageSeed: "simple-street-style",
    icon: <TUXIconShoppingCartFillLTR size={16} />,
  },
  {
    key: "creator-lore",
    label: "Creator Lore",
    accent: "INSIDE",
    imageSeed: "simple-creator-lore",
    icon: <TUXIconPersonStar size={16} />,
  },
  {
    key: "late-night-live",
    label: "Late Night LIVE",
    accent: "RAW",
    imageSeed: "simple-late-night-live",
    icon: <TUXIconLIVETVFill size={16} />,
  },
  {
    key: "mini-dramas",
    label: "Mini Dramas",
    accent: "PLOT",
    imageSeed: "simple-mini-dramas",
    icon: <TUXIconPlayFill size={16} />,
  },
  {
    key: "commentary",
    label: "Hot Commentary",
    accent: "TALK",
    imageSeed: "simple-commentary",
    icon: <TUXIconMessageSmileFill size={16} />,
  },
  {
    key: "wishlist",
    label: "Wishlists",
    accent: "SAVE",
    imageSeed: "simple-wishlist",
    icon: <TUXIconBookmarkFill size={16} />,
  },
  {
    key: "pop-alerts",
    label: "Pop Alerts",
    accent: "EARLY",
    imageSeed: "simple-pop-alerts",
    icon: <TUXIconBellFill size={16} />,
  },
];

function navigateHome() {
  window.location.assign("/");
}

function pickRandomInterestKeys(count: number) {
  const shuffled = [...interestOptions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((item) => item.key);
}

export default function InterestSetupPage() {
  const [showSeparator, setShowSeparator] = useState(false);
  const [selectedInterestKeys, setSelectedInterestKeys] = useState<string[]>([]);

  const canContinue = selectedInterestKeys.length > 0;
  const selectedCountLabel = useMemo(() => `${selectedInterestKeys.length} picked`, [selectedInterestKeys]);
  const toggleInterest = (key: string) => {
    setSelectedInterestKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  const applyQuickPick = () => {
    setSelectedInterestKeys(pickRandomInterestKeys(3));
  };

  return (
    <div
      className="h-full min-h-0 flex flex-col"
      style={{
        backgroundColor: getColorCSSVar("UIPageFlat1"),
        backgroundImage:
          "radial-gradient(circle at top, color-mix(in srgb, var(--tux-v2-color-ui-shape-primary) 12%, transparent) 0%, transparent 42%)",
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
        <div className="px-4 pt-1.5 pb-36">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="max-w-[228px]">
                <TUXText as="h1" typographyPreset="LargeTitle-Bold" color="UIText1">
                  What do you want to watch?
                </TUXText>
              </div>
            </div>
            <div
              className="shrink-0 rounded-full px-2.5 py-1"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 16%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 18%, transparent)",
                backdropFilter: "blur(20px)",
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

          <div
            className="mt-3.5 grid grid-cols-2 gap-2.5"
            style={{ gridAutoRows: "156px" }}
          >
            {interestOptions.map((option) => {
              const selected = selectedInterestKeys.includes(option.key);

              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={selected}
                  className="relative overflow-hidden rounded-[28px] text-left transition-transform duration-200 active:scale-[0.985]"
                  onClick={() => toggleInterest(option.key)}
                  style={{
                    minHeight: 156,
                    transform: selected ? "translateY(-1px)" : "translateY(0px)",
                    border: `1.5px solid ${selected ? getColorCSSVar("UIShapePrimary") : "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 12%, transparent)"}`,
                    boxShadow: selected
                      ? `0 18px 38px color-mix(in srgb, ${getColorCSSVar("UIShapePrimary")} 18%, transparent)`
                      : "0 10px 28px color-mix(in srgb, var(--tux-v2-color-ui-shape-neutral-1) 8%, transparent)",
                  }}
                >
                  <img
                    src={`https://picsum.photos/seed/${option.imageSeed}/640/860`}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      filter: "saturate(0.88) contrast(1.04) brightness(0.82)",
                      transform: "scale(1.03)",
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        selected
                          ? "linear-gradient(180deg, color-mix(in srgb, var(--tux-v2-color-ui-shape-primary) 22%, transparent) 0%, color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-black-a15) 45%, transparent) 44%, var(--tux-v2-color-ui-image-overlay-black-a50) 100%)"
                          : "linear-gradient(180deg, color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-black-a15) 58%, transparent) 0%, transparent 42%, var(--tux-v2-color-ui-image-overlay-black-a50) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 10%, transparent) 0%, transparent 24%)",
                    }}
                  />
                  {selected ? (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 1px ${getColorCSSVar("UIShapePrimary")}`,
                      }}
                    />
                  ) : null}

                  <div className="relative h-full flex flex-col justify-between p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="inline-flex items-center gap-1 rounded-full px-1.75 py-1"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 14%, transparent)",
                          backdropFilter: "blur(16px)",
                          border:
                            "1px solid color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 14%, transparent)",
                          boxShadow:
                            "inset 0 1px 0 color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 12%, transparent)",
                        }}
                      >
                        <span
                          className="flex items-center justify-center rounded-full w-4.5 h-4.5"
                          style={{
                            backgroundColor:
                              selected
                                ? "color-mix(in srgb, var(--tux-v2-color-ui-shape-primary) 82%, transparent)"
                                : "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 18%, transparent)",
                            color: selected
                              ? "var(--tux-v2-color-ui-image-overlay-white)"
                              : "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 88%, transparent)",
                          }}
                        >
                          {option.icon}
                        </span>
                        <TUXText typographyPreset="SmallText1-Regular" color="UIImageOverlayWhite">
                          {option.accent}
                        </TUXText>
                      </div>

                      <div
                        aria-hidden="true"
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: 20,
                          height: 20,
                          border: selected
                            ? `5px solid ${getColorCSSVar("UIShapePrimary")}`
                            : "1.5px solid color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 56%, transparent)",
                          backgroundColor: selected
                            ? "var(--tux-v2-color-ui-image-overlay-white)"
                            : "color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-black-a15) 55%, transparent)",
                          boxShadow: selected
                            ? `0 0 0 2px color-mix(in srgb, var(--tux-v2-color-ui-image-overlay-white) 36%, transparent)`
                            : "none",
                        }}
                      />
                    </div>

                    <div>
                      <TUXText typographyPreset="H4-Semibold" color="UIImageOverlayWhite">
                        {option.label}
                      </TUXText>
                    </div>
                  </div>
                </button>
              );
            })}
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
            aria-label={canContinue ? "Enter Feed" : "Pick one to continue"}
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
              {canContinue ? "Enter Feed" : "Pick one to continue"}
            </TUXText>
          </button>
        </div>
      </div>
    </div>
  );
}
