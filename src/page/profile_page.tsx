import {
  TUXAvatar,
  TUXButton,
  TUXListCell,
  TUXNavBar,
  TUXTabBar,
  TUXTag,
  TUXText,
  getColorCSSVar,
} from "@byted-tiktok/tux-web";
import {
  IconQRCode,
  TUXIconGear,
  TUXIcon3LinesHorizontal,
  TUXIconWalletFill,
  TUXIconWallet,
  TUXIconARectangleFill,
  TUXIconArrowTriangleDownLargeFill,
  TUXIconArrowLeftArrowRightFill,
  TUXIconArrowToLeftFill,
  TUXIconArrowTurnUpRightFill,
  TUXIconArchive,
  TUXIconClockFill,
  TUXIconBellFill,
  TUXIconCellularDataFill,
  IconChevronLeftOffsetLTR,
  TUXIconChevronRightSlimThinLTR,
  TUXIconClock,
  IconArrowDownCloud,
  TUXIconPersonStar,
  TUXIconDraft,
  TUXIconExpExp03IconFootprint,
  TUXIconFamilyFill,
  TUXIconGearFill,
  TUXIconHourglassFill,
  TUXIconInfoCircleFill,
  TUXIconLIVETVFill,
  TUXIconLockLargeFill,
  TUXIconMessageSmileFill,
  TUXIconMusicNoteFill,
  TUXIconPersonPlus,
  TUXIconPencil,
  TUXIconPersonFill,
  TUXIconPlayFill,
  TUXIconExpProfileExpIconPlaylistFill,
  TUXIconPlusTinyFill,
  TUXIconShieldFill,
  TUXIconTrashBinFill,
  TUXIconColorVerifiedBadge,
  TUXIconExpProfileExpIconMusicFill,
  TUXIconExpProfileExpIconShowcaseFill,
  TUXIconExpProfileExpIconCollectionFill,
  TUXIconExpProfileExpIconRepostFill,
  TUXIconExpProfileExpIconHeartFill,
  TUXIconExpProfileExpIconBookmarkFill,



} from "@byted-tiktok/tux-icons";
import { useCallback, useId, useMemo, useState, type ReactNode } from "react";

import PagePushStage, { usePagePushStage } from "../hooks/page_push";
import { TUXIconBookmarkFill } from "@byted-tiktok/tux-icons";
import { TUXIconShoppingCartFillLTR } from "@byted-tiktok/tux-icons";
import { TUXIconFlagFill } from "@byted-tiktok/tux-icons";
import { TUXIconVerticalRectanglePlayFill } from "@byted-tiktok/tux-icons";
import { TUXIconContrastFill } from "@byted-tiktok/tux-icons";

void TUXTag;

type TopTabKey =
  | "posts"
  | "private"
  | "shop"
  | "unknown"
  | "bookmarks"
  | "likes";

type ProfilePageProps = {
  bottomTabBar?: ReactNode;
};

export default function ProfilePage({ bottomTabBar }: ProfilePageProps) {
  const watchHistoryGradientId = useId().replace(/:/g, "");
  const ordersGradientId = `${watchHistoryGradientId}-orders`;
  const showcaseGradientId = `${watchHistoryGradientId}-showcase`;
  const topTabs = useMemo<
    Array<{ key: TopTabKey; icon: ReactNode; indicatorWidth?: number }>
  >(
    () => [
        {
          key: "posts",
          icon: (
            <span className="flex items-center gap-0.5">
              <TUXIconExpProfileExpIconCollectionFill size={20} />
              <TUXIconArrowTriangleDownLargeFill size={12} />
            </span>
          ),
          indicatorWidth: 45,
        },
        {
          key: "private",
          icon: <TUXIconExpProfileExpIconMusicFill size={20} />,
        },
        {
          key: "shop",
          icon: <TUXIconExpProfileExpIconShowcaseFill size={20} />,
        },
        {
          key: "unknown",
          icon: <TUXIconExpProfileExpIconRepostFill size={20} />,
        },
        {
          key: "bookmarks",
          icon: <TUXIconExpProfileExpIconBookmarkFill size={20} />,
        },
        {
          key: "likes",
          icon: <TUXIconExpProfileExpIconHeartFill size={20} />,
        },
      ],
    [],
  );

  const [activeTopTab, setActiveTopTab] = useState<TopTabKey>("posts");

  const videoItems = useMemo<
    Array<{
      key: string;
      thumbnailSrc: string;
      title?: string;
      badge?: string;
      metric: string;
      metricIcon: "draft" | "play";
    }>
  >(
    () => [
      {
        key: "drafts",
        thumbnailSrc: "https://picsum.photos/seed/tux-drafts/258/346",
        title: "Drafts · 2",
        metric: "84.6MB",
        metricIcon: "draft",
      },
      {
        key: "pinned-1",
        thumbnailSrc: "https://picsum.photos/seed/tux-pinned-1/258/346",
        badge: "Pinned",
        metric: "6.5M",
        metricIcon: "play",
      },
      {
        key: "pinned-2",
        thumbnailSrc: "https://picsum.photos/seed/tux-pinned-2/258/346",
        badge: "Pinned",
        metric: "12.4M",
        metricIcon: "play",
      },
      {
        key: "v-4",
        thumbnailSrc: "https://picsum.photos/seed/tux-thumb-4/258/346",
        metric: "8.8M",
        metricIcon: "play",
      },
      {
        key: "v-5",
        thumbnailSrc: "https://picsum.photos/seed/tux-thumb-5/258/346",
        metric: "1.2M",
        metricIcon: "play",
      },
      {
        key: "v-6",
        thumbnailSrc: "https://picsum.photos/seed/tux-thumb-6/258/346",
        metric: "23.1M",
        metricIcon: "play",
      },
      {
        key: "v-7",
        thumbnailSrc: "https://picsum.photos/seed/tux-thumb-7/258/346",
        metric: "3.4M",
        metricIcon: "play",
      },
      {
        key: "v-8",
        thumbnailSrc: "https://picsum.photos/seed/tux-thumb-8/258/346",
        metric: "9.7M",
        metricIcon: "play",
      },
      {
        key: "v-9",
        thumbnailSrc: "https://picsum.photos/seed/tux-thumb-9/258/346",
        metric: "15.2M",
        metricIcon: "play",
      },
    ],
    [],
  );

  // Settings page section data
  const settingsSections: Array<{
    key: string;
    title: string;
    items: Array<{
      key: string;
      label: string;
      icon: ReactNode;
      trailing?: ReactNode;
    }>;
  }> = [
    {
      key: "account",
      title: "Account",
      items: [
        { key: "account", label: "Account", icon: <TUXIconPersonFill size={20} /> },
        { key: "privacy", label: "Privacy", icon: <TUXIconLockLargeFill size={20} /> },
        { key: "security", label: "Security", icon: <TUXIconShieldFill size={20} /> },
        { key: "balance", label: "Balance", icon: <TUXIconWalletFill size={20} /> },
        { key: "share-profile", label: "Share profile", icon: <TUXIconArrowTurnUpRightFill size={20} /> },
      ],
    },
    {
      key: "content-display",
      title: "Content & Display",
      items: [
        { key: "notifications", label: "Notifications", icon: <TUXIconBellFill size={20} /> },
        { key: "live", label: "LIVE", icon: <TUXIconLIVETVFill size={20} /> },
        { key: "music", label: "Music", icon: <TUXIconMusicNoteFill size={20} /> },
        { key: "activity-center", label: "Activity center", icon: <TUXIconClockFill size={20} /> },
        { key: "content-preferences", label: "Content preferences", icon: <TUXIconBookmarkFill size={20} /> },
        { key: "ads", label: "Ads", icon: <TUXIconShoppingCartFillLTR size={20} /> },
        { key: "playback", label: "Playback", icon: <TUXIconVerticalRectanglePlayFill size={24} /> },
        { key: "language", label: "Language", icon: <TUXIconARectangleFill size={20} /> },
        { key: "display", label: "Display", icon: <TUXIconContrastFill size={20} /> },
        { key: "screen-time", label: "Screen time", icon: <TUXIconHourglassFill size={20} /> },
        { key: "family-pairing", label: "Family Pairing", icon: <TUXIconFamilyFill size={20} /> },
      ],
    },
    {
      key: "cache-cellular",
      title: "Cache & Cellular",
      items: [
        { key: "free-up-space", label: "Free up space", icon: <TUXIconTrashBinFill size={20} /> },
        { key: "data-saver", label: "Data Saver", icon: <TUXIconCellularDataFill size={20} /> },
      ],
    },
    {
      key: "support-about",
      title: "Support & About",
      items: [
        { key: "report", label: "Report a problem", icon: <TUXIconFlagFill size={20} /> },
        { key: "support", label: "Support", icon: <TUXIconMessageSmileFill size={20} /> },
        { key: "terms", label: "Terms and Policies", icon: <TUXIconInfoCircleFill size={20} /> },
      ],
    },
    {
      key: "login",
      title: "Login",
      items: [
        {
          key: "switch",
          label: "Switch account",
          icon: <TUXIconArrowLeftArrowRightFill size={20} />,
          trailing: (
            <div className="flex items-center gap-3">
              <TUXAvatar
                size={32}
                src="https://picsum.photos/seed/tux-account-switch/64/64"
                alt=""
                ringColor="UIShapeNeutral3"
              />
              <div style={{ color: getColorCSSVar("UITextPlaceholder") }}>
                <TUXIconChevronRightSlimThinLTR size={16} />
              </div>
            </div>
          ),
        },
        { key: "logout", label: "Log out", icon: <TUXIconArrowToLeftFill size={20} /> },
      ],
    },
  ];

  const pageStage = usePagePushStage({
    initialPage: buildProfilePage(),
    initialKey: "profile",
    durationMs: 300,
    pageOffset: "80%",
  });
  const { pop, push, replace } = pageStage;

  const handleTopTabChange = useCallback(
    (nextActiveTopTab: TopTabKey) => {
      setActiveTopTab(nextActiveTopTab);
      replace(buildProfilePage(nextActiveTopTab), "profile");
    },
    [replace],
  );

  const handleCloseMenu = useCallback(
    (trigger?: HTMLElement | null) => {
      pop({
        trigger,
        incomingPage: buildProfilePage(),
        outgoingPage: buildMenuPage(),
        incomingPageOffset: "80%",
        outgoingPageOffset: "30%",
      });
    },
    [pop],
  );

  const handleOpenSettings = useCallback(
    (trigger?: HTMLElement | null) => {
      push({
        trigger,
        outgoingKey: "menu",
        outgoingPage: buildMenuPage(),
        outgoingPageOffset: "30%",
        incomingKey: "settings",
        incomingPage: buildSettingsPage(),
        incomingPageOffset: "30%",
      });
    },
    [push],
  );

  const handleCloseSettings = useCallback(
    (trigger?: HTMLElement | null) => {
      pop({
        trigger,
        incomingPage: buildMenuPage(),
        outgoingPage: buildSettingsPage(),
        incomingPageOffset: "30%",
        outgoingPageOffset: "30%",
      });
    },
    [pop],
  );

  const handleOpenMenu = useCallback(
    (trigger?: HTMLElement | null) => {
      push({
        trigger,
        outgoingKey: "profile",
        outgoingPage: buildProfilePage(),
        outgoingPageOffset: "88%",
        incomingKey: "menu",
        incomingPage: buildMenuPage(),
        incomingPageOffset: "30%",
      });
    },
    [push],
  );

  function buildSettingsPage() {
    function SettingsPageContent() {
      const [showSeparator, setShowSeparator] = useState(false);

      return (
        <div
          className="h-full min-h-0 flex flex-col overflow-hidden"
          style={{ backgroundColor: getColorCSSVar("UIPageGrouped1") }}
        >
          <div className="sm:pt-15.5">
            <TUXNavBar
              heightPreset={44}
              fixed={false}
              showSeparator={showSeparator}
              backgroundColor="UIPageGrouped1"
              leading={
                <button
                  type="button"
                  aria-label="Back"
                  className="flex items-center justify-center w-10.5 h-11"
                  onClick={(event) => handleCloseSettings(event.currentTarget)}
                >
                  <IconChevronLeftOffsetLTR width={22} height={22} />
                </button>
              }
            />
          </div>

          <div
            className="flex-1 min-h-0 overflow-y-auto"
            onScroll={(event) => {
              const nextShowSeparator = event.currentTarget.scrollTop > 6;
              setShowSeparator((current) =>
                current === nextShowSeparator ? current : nextShowSeparator,
              );
            }}
          >
            <div className="px-4 pt-6 pb-3">
              <TUXText as="h1" typographyPreset="LargeTitle-Bold" color="UIText1">
                Settings and privacy
              </TUXText>
            </div>

            <div className="px-2 pb-6 flex flex-col gap-2">
              {settingsSections.map((section) => (
                <div key={section.key} className="flex flex-col gap-2">
                  <div className="px-4 pt-2 pb-1">
                    <TUXText typographyPreset="P1-Regular" color="UIText3">
                      {section.title}
                    </TUXText>
                  </div>

                  <div
                    className="rounded-lg overflow-hidden flex flex-col py-1.5"
                    style={{ backgroundColor: getColorCSSVar("UIPageGrouped2") }}
                  >
                    {section.items.map((item) => (
                      <TUXListCell
                        key={item.key}
                        title={item.label}
                        leadingIcon={
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: 20,
                              height: 20,
                              color: getColorCSSVar("UITextPlaceholder"),
                            }}
                          >
                            {item.icon}
                          </div>
                        }
                        trailing={
                          item.trailing ?? (
                            <div style={{ color: getColorCSSVar("UITextPlaceholder") }}>
                              <TUXIconChevronRightSlimThinLTR size={16} />
                            </div>
                          )
                        }
                        onClick={() => undefined}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="py-6">
              <TUXText typographyPreset="P3-Regular" color="UIText2" className="block text-center">
                V22.2.0
              </TUXText>
            </div>
          </div>
        </div>
      );
    }

    return <SettingsPageContent />;
  }

  function buildMenuPage() {
    return (
      <div className="flex h-full w-full justify-end">
        <button
          type="button"
          aria-label="Close menu"
          className="flex-1 h-full"
          onClick={(event) => handleCloseMenu(event.currentTarget)}
          style={{ backgroundColor: "transparent" }}
        />

        <div
          className="h-full max-w-full overflow-y-auto"
          style={{ width: 330, backgroundColor: getColorCSSVar("UIPageGrouped2") }}
        >
          <div className="flex flex-col items-center h-full w-full px-2 sm:pt-15.5">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-col rounded-xl">
                <div className="px-0">
                  <div className="px-0 pt-3.5 pb-1">
                    <div className="px-4">
                      <TUXText typographyPreset="P2-Semibold" color="UIText3">
                        Assets
                      </TUXText>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    <TUXListCell
                      title="Balance"
                      leadingIcon={
                        <div
                          className="flex items-center justify-center"
                          style={{ width: 20, height: 20, color: getColorCSSVar("UIText1") }}
                        >
                          <TUXIconWallet size={20} />
                        </div>
                      }
                      trailing={
                        <div style={{ color: getColorCSSVar("UIShapeNeutral2") }}>
                          <TUXIconChevronRightSlimThinLTR size={16} />
                        </div>
                      }
                      onClick={(event) => handleCloseMenu(event.currentTarget as HTMLElement)}
                    />
                  </div>
                </div>
              </div>

              <div className="px-2">
                <div
                  style={{
                    height: "0.5px",
                    backgroundColor: getColorCSSVar("UIShapeNeutral3"),
                  }}
                />
              </div>

              <div className="flex flex-col rounded-xl overflow-hidden">
                <div className="pt-3.5 pb-1 px-4">
                  <TUXText typographyPreset="P2-Semibold" color="UIText3">
                    Personal tools
                  </TUXText>
                </div>

                {(
                  [
                    {
                      key: "activity-center",
                      text: "Activity center",
                      leading: <TUXIconClock size={20} />,
                    },
                    {
                      key: "archive",
                      text: "Archive",
                      leading: <TUXIconArchive size={20} />,
                    },
                    {
                      key: "offline-videos",
                      text: "Offline videos",
                      leading: <IconArrowDownCloud width="20" height="20" />,
                    },
                    {
                      key: "qr",
                      text: "Your QR code",
                      leading: <IconQRCode width="20" height="20" />,
                    },
                  ] as const
                ).map((item) => (
                  <div key={item.key} className="overflow-hidden rounded-lg">
                    <TUXListCell
                      title={item.text}
                      leadingIcon={
                        <div
                          className="flex items-center justify-center"
                          style={{ width: 20, height: 20, color: getColorCSSVar("UIText1") }}
                        >
                          {item.leading}
                        </div>
                      }
                      trailing={
                        <div style={{ color: getColorCSSVar("UIShapeNeutral2") }}>
                          <TUXIconChevronRightSlimThinLTR size={16} />
                        </div>
                      }
                      onClick={(event) => handleCloseMenu(event.currentTarget as HTMLElement)}
                    />
                  </div>
                ))}
              </div>

              <div className="px-2">
                <div
                  style={{
                    height: "0.5px",
                    backgroundColor: getColorCSSVar("UIShapeNeutral3"),
                  }}
                />
              </div>

              <div className="flex flex-col rounded-xl">
                <div className="pt-3.5 pb-1 px-4">
                  <TUXText typographyPreset="P2-Semibold" color="UIText3">
                    Creation and business tools
                  </TUXText>
                </div>
                <div className="overflow-hidden rounded-lg">
                  <TUXListCell
                    title="TikTok studio"
                    leadingIcon={
                      <div
                        className="flex items-center justify-center"
                        style={{ width: 20, height: 20, color: getColorCSSVar("UIText1") }}
                      >
                        <TUXIconPersonStar size={20} />
                      </div>
                    }
                    trailing={
                      <div style={{ color: getColorCSSVar("UIShapeNeutral2") }}>
                        <TUXIconChevronRightSlimThinLTR size={16} />
                      </div>
                    }
                    onClick={(event) => handleCloseMenu(event.currentTarget as HTMLElement)}
                  />
                </div>
              </div>

              <div className="px-2">
                <div
                  style={{
                    height: "0.5px",
                    backgroundColor: getColorCSSVar("UIShapeNeutral3"),
                  }}
                />
              </div>

              <div className="overflow-hidden rounded-lg">
                <TUXListCell
                  title="Settings and privacy"
                  leadingIcon={
                    <div
                      className="flex items-center justify-center"
                      style={{ width: 20, height: 20, color: getColorCSSVar("UIText1") }}
                    >
                      <TUXIconGear size={20} />
                    </div>
                  }
                  trailing={
                    <div style={{ color: getColorCSSVar("UIShapeNeutral2"), paddingRight: 0 }}>
                      <TUXIconChevronRightSlimThinLTR size={16} />
                    </div>
                  }
                  onClick={(event) => handleOpenSettings(event.currentTarget as HTMLElement)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function buildProfilePage(currentTopTab: TopTabKey = activeTopTab) {
    function ProfilePageContent() {
      const [showSeparator, setShowSeparator] = useState(false);

      return (
        <div className="bg-tux-v2-ui-page-flat-1 h-full min-h-0 flex flex-col overflow-hidden">
          <div className="sm:pt-15.5">
            <TUXNavBar
              heightPreset={44}
              fixed={false}
              showSeparator={showSeparator}
              backgroundColor="UIPageFlat1"
              backgroundOpacity={1}
              leading={
                <button
                  type="button"
                  aria-label="Edit"
                  className="flex items-center justify-center w-10.5 h-11"
                >
                  <TUXIconPencil size={22} />
                </button>
              }
              trailing={
                <div className="flex items-center">
                  <button
                    type="button"
                    aria-label="My visitors"
                    className="flex items-center justify-center w-10.5 h-11"
                  >
                    <TUXIconExpExp03IconFootprint size={22} />
                  </button>
                  <button
                    type="button"
                    aria-label="Add friend"
                    className="flex items-center justify-center w-10.5 h-11"
                  >
                    <TUXIconPersonPlus size={22} />
                  </button>
                  <button
                    type="button"
                    aria-label="Menu"
                    className="flex items-center justify-center w-10.5 h-11"
                    onClick={(event) => handleOpenMenu(event.currentTarget)}
                  >
                    <TUXIcon3LinesHorizontal size={24} />
                  </button>
                </div>
              }
            />
          </div>
          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
            onScroll={(event) => {
              const nextShowSeparator = event.currentTarget.scrollTop > 6;
              setShowSeparator((current) =>
                current === nextShowSeparator ? current : nextShowSeparator,
              );
            }}
          >
          <div className="px-4 pt-3 pb-4 relative">
            <div className="flex flex-col gap-4.5">
              <div className="flex flex-col gap-0.5 max-w-[250px]">
                <div className="flex items-center gap-1 min-w-0">
                  <TUXText
                    as="h1"
                    typographyPreset="LargeTitle-Bold"
                    textDisplay="truncate"
                    color="UIText1"
                  >
                    Coldplay
                  </TUXText>
                  <button
                    type="button"
                    aria-label="Switch account"
                    className="flex items-center justify-center w-5 h-5"
                  >
                    <TUXIconArrowTriangleDownLargeFill size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-1 min-w-0">
                  <TUXText typographyPreset="P3-Semibold" color="UIText3" textDisplay="truncate">
                    @coldplay
                  </TUXText>
                  <TUXIconColorVerifiedBadge size={10} />
                  <TUXText typographyPreset="P3-Semibold" color="UIText3">
                    ·
                  </TUXText>
                  <TUXText typographyPreset="P3-Semibold" color="UIText3" textDisplay="truncate">
                    Artist
                  </TUXText>
                </div>
              </div>

              <div className="flex items-center gap-6 w-[250px]">
                {(
                  [
                    { value: "36", label: "Following" },
                    { value: "8.1M", label: "Followers" },
                    { value: "88.3M", label: "Likes" },
                  ] as const
                ).map((item) => (
                  <div key={item.label} className="flex flex-col items-start text-left">
                    <TUXText typographyPreset="H4-Semibold" color="UIText1">
                      {item.value}
                    </TUXText>
                    <TUXText typographyPreset="P3-Regular" color="UIText3">
                      {item.label}
                    </TUXText>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute top-2 right-4">
              <div className="relative">
                <TUXAvatar
                  size={96}
                  src="https://picsum.photos/seed/tux-profile-avatar/192/192"
                  alt="Profile avatar"
                  ringColor="UIShapeSecondary"
                  badgeIcon={
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: getColorCSSVar("UIShapeSecondary"),
                        color: "var(--tux-v2-color-ui-image-overlay-white)",
                      }}
                    >
                      <TUXIconPlusTinyFill size={24} />
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          <div className="px-4 pb-3">
            <div className="flex flex-col gap-0.5">
              <TUXText typographyPreset="P3-Regular" color="UIText3">
                He/him/his
              </TUXText>
              <TUXText typographyPreset="P2-Regular" color="UIText1">
                Tik Official Coldplay Tok. The new album, Moon Music, out now. Your Japanese bestie🇯🇵🫶#comedy
              </TUXText>
            </div>
            <div className="mt-1">
              <TUXText typographyPreset="P2-Semibold" color="UIText1">
                lemon8-app.com/bimbingan{" "}
                <span style={{ color: getColorCSSVar("UIText1") }}>and</span> 1 more
              </TUXText>
            </div>
          </div>

          <div className="px-4 pb-2">
            <div className="flex items-center gap-2">
              <TUXButton
                text="Watch history"
                themePreset="secondary"
                shapePreset="capsule"
                sizePreset="small"
                leadingIcon={
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                  >
                    <defs>
                      <linearGradient
                        id={watchHistoryGradientId}
                        x1="0"
                        y1="48"
                        x2="0"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#F5A0FF" />
                        <stop offset="71.87%" stopColor="#FE2C55" />
                      </linearGradient>
                    </defs>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      fill={`url(#${watchHistoryGradientId})`}
                      d="M24 46a22 22 0 1 0 0-44 22 22 0 0 0 0 44Zm-1.15-20.36A2 2 0 0 1 22 24V13a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9.44a1 1 0 0 0 .43.82l7.9 5.53a1 1 0 0 1 .24 1.4l-1.14 1.63a1 1 0 0 1-1.4.25l-9.18-6.43Z"
                    />
                  </svg>
                }
                backgroundColor="UIPageFlat1"
                borderStyle="solid"
                borderWidth="0.5px"
                borderColor="UIShapeNeutral3"
                paddingInline="9px"
                height="29px"
              />
              <TUXButton
                text="Your orders"
                themePreset="secondary"
                shapePreset="capsule"
                sizePreset="small"
                leadingIcon={
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                  >
                    <defs>
                      <linearGradient
                        id={ordersGradientId}
                        x1="0"
                        y1="48"
                        x2="0"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#F5A0FF" />
                        <stop offset="71.87%" stopColor="#FE2C55" />
                      </linearGradient>
                    </defs>
                    <path
                      fill={`url(#${ordersGradientId})`}
                      d="M4.96 6a14.67 14.67 0 0 1 .94.03c.06.18.12.43.23.9l4.79 20.63c.19.83.36 1.56.54 2.15.2.64.45 1.25.87 1.83a6 6 0 0 0 2.5 1.98c.65.28 1.31.39 1.97.43.62.05 1.37.05 2.22.05H34.2c1.46 0 2.74 0 3.86-.46a6 6 0 0 0 2.47-1.92c.74-.97 1.05-2.2 1.42-3.62l2.98-11.58c.15-.61.3-1.2.39-1.7a4.1 4.1 0 0 0-.07-1.88 4 4 0 0 0-1.75-2.26 4.1 4.1 0 0 0-1.81-.54c-.5-.04-1.1-.04-1.74-.04h-29L10 5.97c-.1-.4-.18-.79-.29-1.12-.11-.37-.28-.8-.58-1.21a4 4 0 0 0-2.97-1.61C5.82 2 5.42 2 5.01 2H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3.96ZM15.25 44.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5ZM36.25 44.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z"
                    />
                  </svg>
                }
                backgroundColor="UIPageFlat1"
                borderStyle="solid"
                borderWidth="0.5px"
                borderColor="UIShapeNeutral3"
                paddingInline="9px"
                height="29px"
              />
              <TUXButton
                text="Showcase"
                themePreset="secondary"
                shapePreset="capsule"
                sizePreset="small"
                leadingIcon={
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                  >
                    <defs>
                      <linearGradient
                        id={showcaseGradientId}
                        x1="0"
                        y1="48"
                        x2="0"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#F5A0FF" />
                        <stop offset="71.87%" stopColor="#FE2C55" />
                      </linearGradient>
                    </defs>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      fill={`url(#${showcaseGradientId})`}
                      d="M33 11v-1a9 9 0 0 0-18 0v1c-2.67 0-4.07.03-5.2.56a6 6 0 0 0-2.57 2.29c-.7 1.13-.87 2.63-1.23 5.63L4.47 32.49c-.5 4.33-.76 6.5-.07 8.17a7 7 0 0 0 3.08 3.46c1.58.88 3.76.88 8.11.88h16.82c4.35 0 6.53 0 8.11-.88a7 7 0 0 0 3.08-3.46c.7-1.68.44-3.84-.07-8.17L42 19.48c-.36-3-.53-4.5-1.23-5.63a6 6 0 0 0-2.57-2.29c-1.13-.53-2.53-.56-5.2-.56Zm-9-6a5 5 0 0 0-5 5v1h10v-1a5 5 0 0 0-5-5Zm-4.5 13.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM31 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                    />
                  </svg>
                }
                backgroundColor="UIPageFlat1"
                borderStyle="solid"
                borderWidth="0.5px"
                borderColor="UIShapeNeutral3"
                paddingInline="9px"
                height="29px"
              />
            </div>
          </div>

          <div className="mt-2">
            <div>
              <TUXTabBar
                items={topTabs.map((tab) => ({
                  itemKey: tab.key,
                  leadingIcon: tab.icon,
                }))}
                activeKey={currentTopTab}
                onChange={(key) => handleTopTabChange(key as TopTabKey)}
                showSeparator={false}
                showFadingEdge={false}
              />
            </div>
            <div
              style={{
                height: "0.5px",
                backgroundColor: getColorCSSVar("UIShapeNeutral3"),
              }}
            />

            <div className="flex items-center gap-4.5 px-4 py-3">
              <div
                className="flex items-center justify-center w-4 h-4"
                style={{ color: getColorCSSVar("UIShapeNeutral2") }}
              >
                <TUXIconGearFill size={15} />
              </div>
              <button
                type="button"
                className="flex items-center gap-1"
                style={{ color: getColorCSSVar("UIShapeNeutral2") }}
              >
                <TUXIconExpProfileExpIconPlaylistFill size={14} />
                <TUXText typographyPreset="P2-Semibold" color="UIText1">
                  Moon Music
                </TUXText>
              </button>
              <button
                type="button"
                className="flex items-center gap-1"
                style={{ color: getColorCSSVar("UIShapeNeutral2") }}
              >
                <TUXIconExpProfileExpIconPlaylistFill size={14} />
                <TUXText typographyPreset="P2-Semibold" color="UIText1">
                  Jonny
                </TUXText>
              </button>
            </div>

            <div
              className="w-full"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.5px",
              }}
            >
              {videoItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="relative overflow-hidden"
                  style={{
                    backgroundColor: getColorCSSVar("UIShapeNeutral4"),
                    aspectRatio: "129 / 173",
                  }}
                  aria-label="Video"
                >
                  <img
                    alt=""
                    src={item.thumbnailSrc}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, var(--tux-v2-color-ui-image-overlay-black-a15), transparent 45%)",
                    }}
                  />

                  <div
                    className="absolute left-0 right-0 bottom-0"
                    style={{
                      height: 52,
                      background:
                        "linear-gradient(to top, var(--tux-v2-color-ui-image-overlay-black-a50), transparent)",
                    }}
                  />

                  {item.title ? (
                    <div
                      className="absolute left-1.5 top-1.5"
                      style={{
                        color: "var(--tux-v2-color-ui-image-overlay-white)",
                      }}
                    >
                      <TUXText typographyPreset="P2-Semibold" color="UIImageOverlayWhite">
                        {item.title}
                      </TUXText>
                    </div>
                  ) : null}

                  {item.badge ? (
                    <div className="absolute left-1.5 top-1.5">
                      <div
                        className="px-1.5 py-0.5 rounded flex items-center justify-center"
                        style={{
                          height: 18,
                          backgroundColor: getColorCSSVar("UIShapePrimary"),
                          color: getColorCSSVar("UIShapeText1OnPrimary"),
                        }}
                      >
                        <TUXText
                          typographyPreset="P3-Semibold"
                          color="UIShapeText1OnPrimary"
                          className="block"
                          style={{ transform: "translateY(0.5px)" }}
                        >
                          {item.badge}
                        </TUXText>
                      </div>
                    </div>
                  ) : null}

                  <div
                    className="absolute left-1 bottom-1.5 flex items-center gap-0.5"
                    style={{
                      color: "var(--tux-v2-color-ui-image-overlay-white)",
                    }}
                  >
                    <span className="flex items-center justify-center w-4 h-4">
                      {item.metricIcon === "draft" ? (
                        <TUXIconDraft size={14} />
                      ) : (
                        <TUXIconPlayFill size={14} />
                      )}
                    </span>
                    <TUXText typographyPreset="P2-Semibold" color="UIImageOverlayWhite">
                      {item.metric}
                    </TUXText>
                  </div>
                </button>
              ))}
            </div>
          </div>
          </div>
          {bottomTabBar ? <div className="flex-none">{bottomTabBar}</div> : null}
        </div>
      );
    }

    return <ProfilePageContent />;
  }

  return <PagePushStage manager={pageStage} className="h-full min-h-0" />;
}
