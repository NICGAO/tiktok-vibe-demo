import { TUXText } from "@byted-tiktok/tux-web";
import {
  TUXIconBellFill,
  TUXIconCamera,
  TUXIconNotificationBoxFill,
  TUXIconTwoPersonLargeFill,
} from "@byted-tiktok/tux-icons";

import { RingAvatar } from "../../../components/ring_avatar";
import {
  ROW_HEIGHT_CLASS,
  ROW_TRAILING_SIZE_CLASS,
} from "../model/constants";
import type {
  InboxRow,
  InboxRowLeading,
  InboxRowTrailing,
  InboxRowUnread,
} from "../model/types";

function UnreadBadge({ count }: { count: number }) {
  return (
    <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-tux-v2-ui-shape-primary px-1">
      <TUXText
        as="span"
        font="TikTokFont"
        typographyPreset="P3-Semibold"
        color="UIShapeText1OnPrimary"
        align="center"
      >
        {count}
      </TUXText>
    </div>
  );
}

function CameraTrailingButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex ${ROW_TRAILING_SIZE_CLASS} items-center justify-center rounded-full text-tux-v2-ui-text-3`}
    >
      <TUXIconCamera size={24} />
    </button>
  );
}

function renderRowLeading(leading: InboxRowLeading) {
  if (leading.kind === "avatar") {
    return (
      <RingAvatar
        src={leading.src}
        alt={leading.alt}
        size={leading.size}
        ringColor={leading.ringColor}
        showDot={leading.showDot}
        dotColor={leading.dotColor}
      />
    );
  }

  const Icon =
    leading.icon === "followers"
      ? TUXIconTwoPersonLargeFill
      : leading.icon === "activity"
        ? TUXIconBellFill
        : TUXIconNotificationBoxFill;

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: `${leading.size}px`,
        height: `${leading.size}px`,
        backgroundColor: leading.background,
        color: leading.iconColor,
      }}
    >
      <Icon size={leading.iconSize} />
    </div>
  );
}

function renderRowTrailing(trailing?: InboxRowTrailing, unread?: InboxRowUnread) {
  if (trailing?.kind === "camera") {
    return <CameraTrailingButton label={trailing.label} />;
  }

  if (unread?.kind === "count") {
    return <UnreadBadge count={unread.count} />;
  }

  if (unread?.kind === "dot") {
    return (
      <span
        className="h-2 w-2 rounded-full bg-tux-v2-ui-shape-primary"
        aria-hidden
      />
    );
  }

  return null;
}

type InboxRowCellProps = {
  row: InboxRow;
};

export function InboxRowCell({ row }: InboxRowCellProps) {
  const trailing = renderRowTrailing(row.trailing, row.unread);

  return (
    <button
      type="button"
      className={`flex ${ROW_HEIGHT_CLASS} w-full items-center bg-transparent py-2 pl-4 pr-2 text-left`}
    >
      <div className="mr-3 flex shrink-0 items-center justify-center overflow-visible">
        {renderRowLeading(row.leading)}
      </div>
      <div className="min-w-0 flex-1">
        <TUXText
          as="div"
          font="TikTokFont"
          typographyPreset={`H4-${row.titleWeight ?? "Regular"}`}
          color="UIText1"
          textDisplay="truncate"
          className="min-w-0"
        >
          {row.title}
        </TUXText>
        <div className="mt-0.5 flex min-w-0 items-center">
          <TUXText
            as="span"
            font="TikTokFont"
            typographyPreset={`P1-${row.previewEmphasis ? "Semibold" : "Regular"}`}
            color={row.previewEmphasis ? "UIText1" : "UIText3"}
            textDisplay="truncate"
            className="min-w-0 max-w-full shrink"
          >
            {row.preview}
          </TUXText>
          {row.time ? (
            <>
              <span className="mx-1 shrink-0 text-[14px] leading-[1.3] text-tux-v2-ui-text-3">
                ·
              </span>
              <TUXText
                as="span"
                font="TikTokFont"
                typographyPreset="P1-Regular"
                color="UIText3"
                className="shrink-0"
              >
                {row.time}
              </TUXText>
            </>
          ) : null}
        </div>
      </div>
      {trailing ? (
        <div
          className={`ml-3 flex ${ROW_TRAILING_SIZE_CLASS} shrink-0 items-center justify-center`}
        >
          {trailing}
        </div>
      ) : null}
    </button>
  );
}
