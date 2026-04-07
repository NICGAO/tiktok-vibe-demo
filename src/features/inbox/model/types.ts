export type StoryBadgeIcon = "plus" | "vertical-bars";

export type StoryItem = {
  id: string;
  name: string;
  src: string;
  ringColor?: string;
  showDot?: boolean;
  badge?: {
    icon: StoryBadgeIcon;
    background: string;
    iconColor: string;
    iconSize: number;
    size: number;
  };
  bubble?: {
    text: string;
    filled: boolean;
  };
};

export type InboxRowLeading =
  | {
      kind: "icon-bubble";
      icon: "followers" | "activity" | "system";
      background: string;
      iconColor: string;
      iconSize: number;
      size: number;
    }
  | {
      kind: "avatar";
      src: string;
      alt: string;
      size: number;
      ringColor?: string;
      showDot?: boolean;
      dotColor?: string;
    };

export type InboxRowTrailing = {
  kind: "camera";
  label: string;
};

export type InboxRowUnread =
  | {
      kind: "count";
      count: number;
    }
  | {
      kind: "dot";
    };

export type InboxRow = {
  id: string;
  title: string;
  preview: string;
  time?: string;
  unread?: InboxRowUnread;
  leading: InboxRowLeading;
  trailing?: InboxRowTrailing;
  previewEmphasis?: boolean;
  titleWeight?: "Regular" | "Semibold";
};
