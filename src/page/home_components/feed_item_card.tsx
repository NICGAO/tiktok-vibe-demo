import { getColorCSSVar, TUXText, usePopMotion } from "@byted-tiktok/tux-web";
import {
  IconMusicNoteSAlt,
  IconMediaComment,
  IconMediaFavoriate,
  IconMediaFavoriateActive,
  IconMediaLike,
  IconMediaLikeActive,
  IconMediaShare,
  IconPlusSmall,
} from "@byted-tiktok/tux-icons";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { LongPressPanel } from "./long_press_panel";
import { SharePanel } from "./share_panel";

type RightRailActionButtonProps = {
  ariaLabel: string;
  icon: ReactNode;
  label: ReactNode;
  onClick?: () => void;
  pressed?: boolean;
};

function RightRailActionButton({
  ariaLabel,
  icon,
  label,
  onClick,
  pressed,
}: RightRailActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={pressed}
      onClick={onClick}
      className="flex flex-col items-center py-2 pr-1.5 pl-2.5 cursor-pointer"
    >
      {icon}
      <TUXText typographyPreset="P3-Semibold" className="w-11 text-center" style={{ lineHeight: "16px"}}>
        {label}
      </TUXText>
    </button>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", onChange);
    return () => mediaQueryList.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}

export type FeedItemCardProps = {
  index: number;
  total: number;
  content: FeedItemCardContent;
};

export type FeedItemCardMediaContent =
  | {
      type: "image";
      src: string;
      alt?: string;
    }
  | {
      type: "video";
      src: string;
      poster?: string;
      autoPlay?: boolean;
      muted?: boolean;
      loop?: boolean;
    };

export type FeedItemCardContent = {
  id: string;
  mediaType: FeedItemCardMediaContent["type"];
  mediaSrc: string;
  mediaAlt?: string;
  mediaPoster?: string;
  mediaAutoPlay?: boolean;
  mediaMuted?: boolean;
  mediaLoop?: boolean;
  nickname: string;
  description: string;
  avatarUrl: string;
  musicTitle: string;
  musicCoverUrl: string;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  shareCount: number;
};

export function FeedItemCard({ index, total, content }: FeedItemCardProps) {
  void index;
  void total;

  const cardRootRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLongPressPanelVisible, setIsLongPressPanelVisible] = useState(false);
  const [isSharePanelVisible, setIsSharePanelVisible] = useState(false);
  const [longPressPanelRoot, setLongPressPanelRoot] = useState<HTMLElement | null>(null);
  const [avatarSrc, setAvatarSrc] = useState(content.avatarUrl);
  const [isMusicMarqueeActive, setIsMusicMarqueeActive] = useState(false);
  const [musicMarqueeDistance, setMusicMarqueeDistance] = useState(0);
  const [musicMarqueeDuration, setMusicMarqueeDuration] = useState(8);
  const musicViewportRef = useRef<HTMLDivElement>(null);
  const musicMeasureRef = useRef<HTMLSpanElement>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTrackingRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
  } | null>(null);

  useEffect(() => {
    setAvatarSrc(content.avatarUrl);
  }, [content.avatarUrl, content.id]);

  useEffect(() => {
    const frameRoot = cardRootRef.current?.closest(
      "[data-app-frame-root='true']",
    ) as HTMLElement | null;
    setLongPressPanelRoot(frameRoot ?? null);
  }, []);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current != null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const cancelLongPressTracking = useCallback(() => {
    clearLongPressTimer();
    longPressTrackingRef.current = null;
  }, [clearLongPressTimer]);

  useEffect(() => {
    const LONG_PRESS_MOVE_CANCEL_PX = 10;

    const onWindowPointerMove = (event: PointerEvent) => {
      const tracking = longPressTrackingRef.current;
      if (!tracking || event.pointerId !== tracking.pointerId) return;

      const deltaX = Math.abs(event.clientX - tracking.startX);
      const deltaY = Math.abs(event.clientY - tracking.startY);
      if (
        deltaX >= LONG_PRESS_MOVE_CANCEL_PX ||
        deltaY >= LONG_PRESS_MOVE_CANCEL_PX
      ) {
        cancelLongPressTracking();
      }
    };

    const onWindowPointerEnd = (event: PointerEvent) => {
      const tracking = longPressTrackingRef.current;
      if (!tracking || event.pointerId !== tracking.pointerId) return;
      cancelLongPressTracking();
    };

    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerEnd);
    window.addEventListener("pointercancel", onWindowPointerEnd);

    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerEnd);
      window.removeEventListener("pointercancel", onWindowPointerEnd);
    };
  }, [cancelLongPressTracking]);

  useEffect(() => {
    return () => cancelLongPressTracking();
  }, [cancelLongPressTracking]);

  const prefersReducedMotion = usePrefersReducedMotion();

  const timeoutsRef = useRef<number[]>([]);
  useEffect(() => {
    return () => {
      for (const timeoutId of timeoutsRef.current) {
        window.clearTimeout(timeoutId);
      }
      timeoutsRef.current = [];
    };
  }, []);

  const [likePopActive, setLikePopActive] = useState(false);
  const [favoritePopActive, setFavoritePopActive] = useState(false);

  const likeScale = usePopMotion({
    active: !prefersReducedMotion && likePopActive,
    from: 1,
    to: 1.18,
    bounciness: 6,
    speed: 18,
  });

  const favoriteScale = usePopMotion({
    active: !prefersReducedMotion && favoritePopActive,
    from: 1,
    to: 1.18,
    bounciness: 6,
    speed: 18,
  });

  const triggerLikeToggle = () => {
    if (prefersReducedMotion) {
      setIsLiked((value) => !value);
      return;
    }

    if (likePopActive) return;

    setLikePopActive(true);
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setIsLiked((value) => !value);
      }, 90),
    );
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setLikePopActive(false);
      }, 180),
    );
  };

  const triggerFavoriteToggle = () => {
    if (prefersReducedMotion) {
      setIsFavorited((value) => !value);
      return;
    }

    if (favoritePopActive) return;

    setFavoritePopActive(true);
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setIsFavorited((value) => !value);
      }, 90),
    );
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setFavoritePopActive(false);
      }, 180),
    );
  };

  const textShadowColor = getColorCSSVar("FeedTopTabTextShadowA66");

  const overlayTextStyle: CSSProperties = {
    color: getColorCSSVar("UIText1"),
    textShadow: `0px 1px 3px ${textShadowColor}`,
  };
  const leftOverlayTextStyle: CSSProperties = {
    color: getColorCSSVar("UIText1"),
  };
  const musicTextFadeStyle: CSSProperties = {
    ...leftOverlayTextStyle,
    WebkitMaskImage:
      "linear-gradient(to right, #000 0%, #000 calc(100% - 24px), transparent 100%)",
    maskImage:
      "linear-gradient(to right, #000 0%, #000 calc(100% - 24px), transparent 100%)",
  };
  const formatCount = (value: number) =>
    new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  const onMediaPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as Element).closest("button, [data-no-long-press]")) return;

    cancelLongPressTracking();
    longPressTrackingRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };

    longPressTimerRef.current = window.setTimeout(() => {
      setIsLongPressPanelVisible(true);
      cancelLongPressTracking();
    }, 600);
  };

  useEffect(() => {
    const updateMarqueeState = () => {
      if (prefersReducedMotion) {
        setIsMusicMarqueeActive(false);
        return;
      }

      const viewportWidth = musicViewportRef.current?.clientWidth ?? 0;
      const textWidth = musicMeasureRef.current?.scrollWidth ?? 0;
      const marqueeGap = 24;

      if (textWidth > viewportWidth + 1) {
        const distance = textWidth + marqueeGap;
        setIsMusicMarqueeActive(true);
        setMusicMarqueeDistance(distance);
        setMusicMarqueeDuration(Math.max(5, distance / 26));
      } else {
        setIsMusicMarqueeActive(false);
      }
    };

    updateMarqueeState();

    const resizeObserver = new ResizeObserver(updateMarqueeState);
    if (musicViewportRef.current) resizeObserver.observe(musicViewportRef.current);
    if (musicMeasureRef.current) resizeObserver.observe(musicMeasureRef.current);

    window.addEventListener("resize", updateMarqueeState);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMarqueeState);
    };
  }, [content.musicTitle, prefersReducedMotion]);

  const readabilityOverlayBackground =
    "linear-gradient(0deg, rgba(0, 0, 0, 0.00) 82.45%, rgba(0, 0, 0, 0.00) 83.87%, rgba(0, 0, 0, 0.01) 85.18%, rgba(0, 0, 0, 0.03) 86.4%, rgba(0, 0, 0, 0.05) 87.55%, rgba(0, 0, 0, 0.08) 88.64%, rgba(0, 0, 0, 0.11) 89.69%, rgba(0, 0, 0, 0.14) 90.72%, rgba(0, 0, 0, 0.17) 91.74%, rgba(0, 0, 0, 0.19) 92.76%, rgba(0, 0, 0, 0.22) 93.81%, rgba(0, 0, 0, 0.25) 94.9%, rgba(0, 0, 0, 0.27) 96.05%, rgba(0, 0, 0, 0.29) 97.27%, rgba(0, 0, 0, 0.30) 98.58%, rgba(0, 0, 0, 0.30) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.00) 83.84%, rgba(0, 0, 0, 0.00) 85.14%, rgba(0, 0, 0, 0.01) 86.35%, rgba(0, 0, 0, 0.03) 87.47%, rgba(0, 0, 0, 0.04) 88.53%, rgba(0, 0, 0, 0.06) 89.54%, rgba(0, 0, 0, 0.08) 90.51%, rgba(0, 0, 0, 0.11) 91.45%, rgba(0, 0, 0, 0.13) 92.39%, rgba(0, 0, 0, 0.16) 93.33%, rgba(0, 0, 0, 0.18) 94.3%, rgba(0, 0, 0, 0.20) 95.31%, rgba(0, 0, 0, 0.22) 96.36%, rgba(0, 0, 0, 0.23) 97.49%, rgba(0, 0, 0, 0.24) 98.7%, rgba(0, 0, 0, 0.24) 100%)";

  return (
    <div
      ref={cardRootRef}
      className="relative bg-tux-v2-brand-tiktok-black w-full h-full overflow-hidden"
      onPointerDownCapture={onMediaPointerDown}
    >
      {/* Config-driven media */}
      <div
        className="top-0 right-0 left-0 absolute"
        style={{ bottom: "var(--app-tabbar-height, 0px)" }}
      >
        {content.mediaType === "video" ? (
          <video
            src={content.mediaSrc}
            poster={content.mediaPoster}
            className="w-full h-full object-cover"
            autoPlay={content.mediaAutoPlay ?? true}
            muted={content.mediaMuted ?? true}
            loop={content.mediaLoop ?? true}
            playsInline
          />
        ) : (
          <img
            src={content.mediaSrc}
            alt={content.mediaAlt ?? "Feed background"}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <LongPressPanel
        visible={isLongPressPanelVisible}
        onVisibleChange={setIsLongPressPanelVisible}
        root={longPressPanelRoot}
      />
      <SharePanel
        visible={isSharePanelVisible}
        onVisibleChange={setIsSharePanelVisible}
        root={longPressPanelRoot}
      />

      {/* Top & bottom readability overlays */}
      <div
        className="top-0 right-0 left-0 absolute pointer-events-none"
        style={{
          bottom: "var(--app-tabbar-height, 0px)",
          background: readabilityOverlayBackground,
        }}
      />

      {/* Bottom info + right rail */}
      <div
        className="top-0 right-0 left-0 z-0 absolute flex items-end"
        style={{ bottom: "var(--app-tabbar-height, 0px)" }}
      >
        <div className="flex justify-between items-end gap-3 w-full">
          {/* Bottom-left text */}
          <div className="flex flex-col flex-1 gap-1 pt-2 pr-4 pb-2.5 pl-3 min-w-0">
            <TUXText typographyPreset="H3-Semibold" style={leftOverlayTextStyle}>
              {content.nickname}
            </TUXText>
            <TUXText typographyPreset="H4-Regular" style={leftOverlayTextStyle}>
              {content.description}
            </TUXText>

            <div className="flex items-center gap-2 mt-1 min-w-0">
              <IconMusicNoteSAlt
                className="text-tux-v2-ui-text-1"
                width={14}
                height={14}
              />
              <div
                ref={musicViewportRef}
                className="relative flex-1 min-w-0 overflow-hidden whitespace-nowrap"
                style={musicTextFadeStyle}
              >
                <span
                  ref={musicMeasureRef}
                  aria-hidden
                  className="top-0 left-0 absolute invisible pointer-events-none whitespace-nowrap P1-Regular"
                >
                  {content.musicTitle}
                </span>
                {isMusicMarqueeActive ? (
                  <div
                    className="feed-music-marquee-track"
                    style={
                      {
                        "--music-marquee-distance": `${musicMarqueeDistance}px`,
                        "--music-marquee-duration": `${musicMarqueeDuration}s`,
                      } as CSSProperties
                    }
                  >
                    <TUXText typographyPreset="P1-Regular" style={leftOverlayTextStyle} className="inline-block pr-6 whitespace-nowrap">
                      {content.musicTitle}
                    </TUXText>
                    <TUXText typographyPreset="P1-Regular" style={leftOverlayTextStyle} className="inline-block whitespace-nowrap" aria-hidden>
                      {content.musicTitle}
                    </TUXText>
                  </div>
                ) : (
                  <TUXText typographyPreset="P1-Regular" style={leftOverlayTextStyle} className="block truncate">
                    {content.musicTitle}
                  </TUXText>
                )}
              </div>
            </div>
          </div>

          {/* Right action rail */}
          <div className="z-20 flex flex-col items-center">

            <div className="relative flex flex-col items-center py-2.5 pr-1.5 pl-2.5">
              <div
                aria-label="Open profile"
                className="bg-tux-v2-ui-page-flat-1 rounded-full w-11 h-11 overflow-hidden"
                style={{ boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.2)" }}
              >
                <img
                  src={avatarSrc}
                  alt={`${content.nickname} avatar`}
                  className="w-full h-full object-cover"
                  onError={() => {
                    setAvatarSrc(`https://picsum.photos/seed/${content.id}-avatar/128/128`);
                  }}
                />
              </div>
              <div
                aria-label="Follow"
                className="-mt-2.5 rounded-full"
                style={{ backgroundColor: getColorCSSVar("UIShapePrimary") }}
              >
                <span
                  className="w-5 h-5"
                >
                  <IconPlusSmall
                    className="text-tux-v2-ui-text-1"
                    width={20}
                    height={20}
                  />
                </span>
              </div>
            </div>

            <RightRailActionButton
              ariaLabel="Like"
              pressed={isLiked}
              onClick={triggerLikeToggle}
              icon={
                <div
                  className="flex justify-center items-center w-8 h-8"
                  style={{ transform: `scale(${likeScale})` }}
                >
                  {isLiked ? (
                    <IconMediaLikeActive
                      className="text-tux-v2-ui-shape-danger"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <IconMediaLike
                      className="text-tux-v2-ui-text-1"
                      width={32}
                      height={32}
                    />
                  )}
                </div>
              }
              label={
                <span style={overlayTextStyle}>
                  {formatCount(content.likeCount)}
                </span>
              }
            />

            <RightRailActionButton
              ariaLabel="Comment"
              icon={
                <IconMediaComment
                  className="text-tux-v2-ui-text-1"
                  width={32}
                  height={32}
                />
              }
              label={
                <span style={overlayTextStyle}>
                  {formatCount(content.commentCount)}
                </span>
              }
            />

            <RightRailActionButton
              ariaLabel="Favorite"
              pressed={isFavorited}
              onClick={triggerFavoriteToggle}
              icon={
                <div
                  className="flex justify-center items-center w-8 h-8"
                  style={{ transform: `scale(${favoriteScale})` }}
                >
                  {isFavorited ? (
                    <IconMediaFavoriateActive
                      className="text-tux-v2-ui-shape-primary"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <IconMediaFavoriate
                      className="text-tux-v2-ui-text-1"
                      width={32}
                      height={32}
                    />
                  )}
                </div>
              }
              label={
                <span style={overlayTextStyle}>
                  {formatCount(content.favoriteCount)}
                </span>
              }
            />

            <RightRailActionButton
              ariaLabel="Share"
              onClick={() => setIsSharePanelVisible(true)}
              icon={
                <IconMediaShare
                  className="text-tux-v2-ui-text-1"
                  width={32}
                  height={32}
                />
              }
              label={
                <span style={overlayTextStyle}>
                  {formatCount(content.shareCount)}
                </span>
              }
            />

            <div
              aria-label="Music"
              className="pt-2 pr-2 pb-3 pl-3">
              <div
                className="block bg-tux-v2-ui-page-flat-1 rounded-full w-10 h-10"
                style={{ boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.2)" }}
              >
                <img
                  src={content.musicCoverUrl}
                  alt={`${content.musicTitle} cover`}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
