import { TUXText } from "@byted-tiktok/tux-web";
import {
  TUXIconPlusTinyFill,
  TUXIconVerticalBars,
} from "@byted-tiktok/tux-icons";

import { RingAvatar } from "../../../components/ring_avatar";
import {
  BUBBLE_TAIL_HEIGHT,
  STORY_CARD_WIDTH_CLASS,
} from "../model/constants";
import type { StoryBadgeIcon, StoryItem } from "../model/types";
import { ThoughtBubble } from "./thought_bubble";

function renderStoryBadgeIcon(icon: StoryBadgeIcon, iconSize: number, iconColor: string) {
  const Icon = icon === "plus" ? TUXIconPlusTinyFill : TUXIconVerticalBars;

  return (
    <span
      aria-hidden
      className="flex items-center justify-center"
      style={{ color: iconColor }}
    >
      <Icon size={iconSize} />
    </span>
  );
}

type StorySkylightCellProps = {
  story: StoryItem;
};

export function StorySkylightCell({ story }: StorySkylightCellProps) {
  const { name, src, ringColor, showDot, badge, bubble } = story;

  return (
    <div className="relative flex-none">
      <button
        type="button"
        className={`flex ${STORY_CARD_WIDTH_CLASS} flex-col items-center gap-3 rounded-[var(--tux-v2-radius-container-level0-large)] text-left outline-none transition-transform active:scale-[0.98]`}
        aria-label={`Open story for ${name}`}
      >
        <div className="relative h-[78px] w-[78px] shrink-0">
          <RingAvatar
            src={src}
            alt={name}
            size={78}
            ringColor={ringColor}
            showDot={showDot}
            dotColor="MiscOnlineShape"
            badgeIcon={
              badge
                ? renderStoryBadgeIcon(
                    badge.icon,
                    badge.iconSize,
                    badge.iconColor,
                  )
                : undefined
            }
            badgeBackground={badge?.background}
            badgeSize={badge?.size}
          />
        </div>
        <TUXText
          as="div"
          font="TikTokFont"
          typographyPreset="SmallText1-Semibold"
          color="UIText1"
          align="center"
          textDisplay="truncate"
          className="w-full"
        >
          {name}
        </TUXText>
      </button>
      {bubble ? (
        <div
          className="absolute top-0 left-1/2 z-10 flex flex-col items-center"
          style={{
            transform: `translateX(-50%) translateY(calc(-100% + ${BUBBLE_TAIL_HEIGHT}px))`,
          }}
        >
          <ThoughtBubble text={bubble.text} isFilled={bubble.filled} />
        </div>
      ) : null}
    </div>
  );
}
