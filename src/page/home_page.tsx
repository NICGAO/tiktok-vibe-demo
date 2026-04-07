import { getColorCSSVar, TUXNavBar, TUXText } from "@byted-tiktok/tux-web";
import { IconLiveEntrance, IconMagnifyingGlass } from "@byted-tiktok/tux-icons";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import VerticalSnapPager from "../components/utilities/vertical_snap_pager";

import { homeFeedItemContents } from "./home_components/feed_item_card.config";
import { FeedItemCard } from "./home_components/feed_item_card";

type HomeTab = {
  id: "stem" | "explore" | "singapore" | "following" | "shop" | "for-you";
  label: string;
};

const HOME_TABS: HomeTab[] = [
  { id: "stem", label: "STEM" },
  { id: "explore", label: "Explore" },
  { id: "singapore", label: "Singapore" },
  { id: "following", label: "Following" },
  { id: "shop", label: "Shop" },
  { id: "for-you", label: "For You" },
];

export default function HomePage() {
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Partial<Record<HomeTab["id"], HTMLButtonElement | null>>>({});
  const hasInitScrollRef = useRef(false);
  const [tabsHasLeftFade, setTabsHasLeftFade] = useState(false);
  const [tabsHasRightFade, setTabsHasRightFade] = useState(false);
  const [activeTabId, setActiveTabId] = useState<HomeTab["id"]>("for-you");

  const overlayTextStyle: CSSProperties = {
    color: getColorCSSVar("UIText1"),
  };
  const tabEdgeMaskImage =
    tabsHasLeftFade && tabsHasRightFade
      ? "linear-gradient(to right, transparent 0, #000 32px, #000 calc(100% - 32px), transparent 100%)"
      : tabsHasLeftFade
        ? "linear-gradient(to right, transparent 0, #000 32px, #000 100%)"
        : tabsHasRightFade
          ? "linear-gradient(to right, #000 0, #000 calc(100% - 32px), transparent 100%)"
          : undefined;
  const tabEdgeMaskStyle: CSSProperties = tabEdgeMaskImage
    ? {
        WebkitMaskImage: tabEdgeMaskImage,
        maskImage: tabEdgeMaskImage,
      }
    : {};

  const pages = useMemo(
    () => {
      if (activeTabId === "for-you") {
        return homeFeedItemContents.map((content, index) => (
          <FeedItemCard
            key={content.id}
            index={index + 1}
            total={homeFeedItemContents.length}
            content={content}
          />
        ));
      }

      return [
        <div
          key={`empty-${activeTabId}`}
          className="bg-tux-v2-brand-tiktok-black w-full h-full"
        />,
      ];
    },
    [activeTabId],
  );

  const scrollTabToBestPosition = (tabId: HomeTab["id"]) => {
    const scrollEl = tabScrollRef.current;
    const targetButton = tabButtonRefs.current[tabId];
    if (!scrollEl || !targetButton) return;

    const maxScrollLeft = scrollEl.scrollWidth - scrollEl.clientWidth;
    if (maxScrollLeft <= 1) return;

    const targetCenter = targetButton.offsetLeft + targetButton.offsetWidth / 2;
    const targetRatio = targetCenter / Math.max(1, scrollEl.scrollWidth);

    let nextScrollLeft = 0;
    if (targetRatio <= 1 / 3) {
      nextScrollLeft = 0;
    } else if (targetRatio >= 2 / 3) {
      nextScrollLeft = maxScrollLeft;
    } else {
      nextScrollLeft = Math.min(
        maxScrollLeft,
        Math.max(0, targetCenter - scrollEl.clientWidth / 2),
      );
    }

    scrollEl.scrollTo({ left: nextScrollLeft, behavior: "smooth" });
  };

  useEffect(() => {
    const updateTabsFadeState = () => {
      const element = tabScrollRef.current;
      if (!element) return;

      const hasOverflow = element.scrollWidth - element.clientWidth > 1;
      if (hasOverflow && !hasInitScrollRef.current) {
        // Default to the right-most tab so "For You" is fully visible.
        element.scrollLeft = element.scrollWidth;
        hasInitScrollRef.current = true;
      }

      if (!hasOverflow) {
        setTabsHasLeftFade(false);
        setTabsHasRightFade(false);
        return;
      }

      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      const atStart = element.scrollLeft <= 1;
      const atEnd = maxScrollLeft - element.scrollLeft <= 1;

      setTabsHasLeftFade(!atStart);
      setTabsHasRightFade(!atEnd);
    };

    updateTabsFadeState();
    const element = tabScrollRef.current;
    element?.addEventListener("scroll", updateTabsFadeState, { passive: true });
    window.addEventListener("resize", updateTabsFadeState);

    return () => {
      element?.removeEventListener("scroll", updateTabsFadeState);
      window.removeEventListener("resize", updateTabsFadeState);
    };
  }, []);

  return (
    <div className="relative h-full min-h-0">
      <VerticalSnapPager pages={pages} gestureFill={false} />

      <div
        className="top-0 right-0 left-0 z-10 absolute pt-[env(safe-area-inset-top)] sm:pt-15.5"
      >
        <TUXNavBar
          heightPreset={44}
          backgroundOpacity={0}
          showSeparator={false}
          titleAlign="center"
          leading={
            <button
              type="button"
              aria-label="Live"
              className="flex justify-center items-center w-10 h-10"
            >
              <IconLiveEntrance
                className="text-tux-v2-ui-text-1"
                width={24}
                height={24}
              />
            </button>
          }
          trailing={
            <button
              type="button"
              aria-label="Search"
              className="flex justify-center items-center w-10 h-10"
            >
              <IconMagnifyingGlass
                className="text-tux-v2-ui-text-1"
                width={24}
                height={24}
              />
            </button>
          }
          customTitle={
            <div className="flex items-center h-full min-w-0">
              <div className="min-w-0 overflow-hidden" style={tabEdgeMaskStyle}>
                <div
                  ref={tabScrollRef}
                  className="flex items-center w-full overflow-x-auto hide-scrollbar"
                >
                  <div className="flex items-center min-w-max">
                    {HOME_TABS.map((tab) => {
                      const isActive = tab.id === activeTabId;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          className="relative flex items-center h-11 px-1.5 overflow-visible"
                          aria-label={tab.label}
                          ref={(node) => {
                            tabButtonRefs.current[tab.id] = node;
                          }}
                          onClick={() => {
                            setActiveTabId(tab.id);
                            scrollTabToBestPosition(tab.id);
                          }}
                        >
                          <span className="relative inline-flex items-center">
                            <TUXText
                              typographyPreset="H4-Semibold"
                              style={{ ...overlayTextStyle, opacity: isActive ? 1 : 0.7 }}
                            >
                              {tab.label}
                            </TUXText>
                            {isActive ? (
                              <span
                                className="left-1/2 absolute -translate-x-1/2"
                                style={{
                                  top: "calc(100% + 8px)",
                                  width: "24px",
                                  height: "2px",
                                  borderRadius: "9999px",
                                  backgroundColor: getColorCSSVar("UIText1"),
                                }}
                              />
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
