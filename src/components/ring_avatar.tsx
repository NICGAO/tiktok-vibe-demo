import { colorsV2Rgba, isColorV2, type ColorV2Name } from "@byted-tiktok/tux-color";
import { TUXAvatar, type TUXAvatarProps } from "@byted-tiktok/tux-web";
import type { CSSProperties } from "react";

const BASE_AVATAR_PRESET_SIZE = {
  large: 96,
  medium: 48,
  small: 32,
  tiny: 24,
} as const;

const STORY_RING_BRUSHES: Partial<Record<ColorV2Name, CSSProperties["background"]>> = {
  SocialStoryCreate:
    "linear-gradient(180deg, #25f4ee 0%, #16d7f2 38%, #00bbff 100%)",
  SocialStoryGradientGreen1:
    "linear-gradient(180deg, #25f4ee 0%, #16d7f2 38%, #00bbff 100%)",
};

type RingAvatarProps = Omit<TUXAvatarProps, "ringColor"> & {
  ringColor?: ColorV2Name | CSSProperties["background"];
  ringGapColor?: CSSProperties["background"];
  badgeBackground?: CSSProperties["background"];
  badgeSize?: number;
};

function getAvatarSize(sizePreset: NonNullable<TUXAvatarProps["sizePreset"]>, size?: number) {
  return size ?? BASE_AVATAR_PRESET_SIZE[sizePreset];
}

function getDotBadgeConfig(size: number) {
  const badgeSize =
    size > 96 ? 24 : size > 72 ? 20 : size > 48 ? 16 : size > 36 ? 14 : size > 20 ? 12 : 8;

  if (size > 64) {
    return { badgeSize, bottomOffset: 2, rightOffset: 2, badgeGap: size > 72 ? 3.5 : 3 };
  }
  if (size > 32) {
    return {
      badgeSize,
      bottomOffset: 0,
      rightOffset: 0,
      badgeGap: size > 40 ? 3 : size > 36 ? 2.5 : size > 28 ? 2 : 1.5,
    };
  }

  return { badgeSize, bottomOffset: -2, rightOffset: -2, badgeGap: size > 20 ? 1.5 : 1.5 };
}

function getIconBadgeConfig(size: number) {
  let badgeSize = 14;
  if (size > 96) badgeSize = 36;
  else if (size > 72) badgeSize = 24;
  else if (size > 56) badgeSize = 20;
  else if (size > 40) badgeSize = 18;
  else if (size > 36) badgeSize = 16;

  if (size > 96) {
    return { badgeSize, bottomOffset: 0, rightOffset: 0, badgeGap: 4 };
  }
  if (size > 64) {
    return { badgeSize, bottomOffset: 0, rightOffset: 4, badgeGap: 3.5 };
  }
  if (size > 48) {
    return { badgeSize, bottomOffset: 0, rightOffset: 0, badgeGap: 3 };
  }
  if (size > 32) {
    return {
      badgeSize,
      bottomOffset: -2,
      rightOffset: -2,
      badgeGap: size > 40 ? 3 : size > 36 ? 2.5 : 2,
    };
  }

  return { badgeSize, bottomOffset: -3, rightOffset: -3, badgeGap: 1.5 };
}

// Match TUXAvatar's stroke-width breakpoints so custom gradient rings scale the same way.
function getRingStrokeWidth(size: number) {
  if (size > 72) return 4;
  if (size > 56) return 3.5;
  if (size > 40) return 3;
  if (size > 24) return 2.5;
  if (size > 20) return 2;
  return 1.5;
}

function resolveRingBrush(ringColor?: RingAvatarProps["ringColor"]) {
  if (!ringColor || ringColor === "transparent") return undefined;
  if (typeof ringColor === "string" && isColorV2(ringColor)) {
    const token = ringColor as ColorV2Name;
    const customBrush = STORY_RING_BRUSHES[token];
    if (customBrush) return customBrush;
    return `var(--tux-v2-color-${colorsV2Rgba[token].cssVarName})`;
  }
  return ringColor;
}

function resolveColorValue(color?: CSSProperties["background"]) {
  if (!color) return undefined;
  if (typeof color === "string" && isColorV2(color)) {
    const token = color as ColorV2Name;
    return `var(--tux-v2-color-${colorsV2Rgba[token].cssVarName})`;
  }
  return color;
}

function createRingMask(innerRadius: number, outerRadius: number) {
  const innerStart = Math.max(innerRadius - 0.5, 0);
  const outerEnd = outerRadius + 0.5;
  return `radial-gradient(circle, transparent ${innerStart}px, #000 ${innerRadius}px, #000 ${outerRadius}px, transparent ${outerEnd}px)`;
}

export function RingAvatar({
  ringColor,
  ringGapColor = "var(--tux-v2-color-ui-page-flat-1)",
  badgeBackground = "var(--tux-v2-color-ui-shape-primary)",
  badgeSize,
  sizePreset = "medium",
  size,
  showDot,
  badgeIcon,
  dotColor = "MiscOnlineShape",
  ...avatarProps
}: RingAvatarProps) {
  const ringBrush = resolveRingBrush(ringColor);
  const avatarSize = getAvatarSize(sizePreset, size);
  const avatarRadius = avatarSize / 2;
  const ringStrokeWidth = getRingStrokeWidth(avatarSize);
  // TUXAvatar uses outline + outlineOffset, which is equivalent to gap === stroke width.
  const ringGap = ringStrokeWidth;
  const gapScale = (avatarSize + 2 * ringGap) / avatarSize;
  const ringScale = (avatarSize + 2 * (ringGap + ringStrokeWidth)) / avatarSize;
  const gapMask = createRingMask(avatarRadius / gapScale, avatarRadius);
  const ringMask = createRingMask((avatarRadius + ringGap) / ringScale, avatarRadius);
  const badgeConfig = badgeIcon
    ? {
        ...getIconBadgeConfig(avatarSize),
        ...(badgeSize ? { badgeSize } : null),
      }
    : getDotBadgeConfig(avatarSize);
  const badgeFill = resolveColorValue(badgeBackground);
  const dotFill = resolveColorValue(dotColor);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        width: `${avatarSize}px`,
        height: `${avatarSize}px`,
        flexShrink: 0,
      }}
    >
      {ringBrush ? (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "9999px",
              background: ringBrush,
              transform: `scale(${ringScale})`,
              transformOrigin: "center",
              mask: ringMask,
              WebkitMask: ringMask,
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "9999px",
              background: ringGapColor,
              transform: `scale(${gapScale})`,
              transformOrigin: "center",
              mask: gapMask,
              WebkitMask: gapMask,
              pointerEvents: "none",
            }}
          />
        </>
      ) : null}
      <div style={{ position: "relative", zIndex: 1 }}>
        <TUXAvatar {...avatarProps} sizePreset={sizePreset} size={size} />
      </div>
      {badgeIcon ? (
        <div
          style={{
            position: "absolute",
            right: `${badgeConfig.rightOffset}px`,
            bottom: `${badgeConfig.bottomOffset}px`,
            zIndex: 2,
            display: "flex",
            width: `${badgeConfig.badgeSize}px`,
            height: `${badgeConfig.badgeSize}px`,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            background: badgeFill,
            boxShadow: `0 0 0 ${badgeConfig.badgeGap}px var(--tux-v2-color-ui-page-flat-1)`,
          }}
        >
          {badgeIcon}
        </div>
      ) : showDot ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: `${badgeConfig.rightOffset}px`,
            bottom: `${badgeConfig.bottomOffset}px`,
            zIndex: 2,
            width: `${badgeConfig.badgeSize}px`,
            height: `${badgeConfig.badgeSize}px`,
            borderRadius: "9999px",
            background: dotFill,
            boxShadow: `0 0 0 ${badgeConfig.badgeGap}px var(--tux-v2-color-ui-page-flat-1)`,
          }}
        />
      ) : null}
    </div>
  );
}
