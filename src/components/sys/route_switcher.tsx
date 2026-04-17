import { TUXMenu } from "@byted-tiktok/tux-web";
import {
  Icon3ptHamburgerMenu,
  IconArrowRightLTR,
  IconExpExp02IconHome,
  IconRoute,
} from "@byted-tiktok/tux-icons";
import { useMemo, useState } from "react";

export const ROUTER_PAGE_PATH = "/router_page";
export const ROOT_APP_PATH = "/";

export function isRouterPagePath(pathname: string) {
  return pathname === ROUTER_PAGE_PATH;
}

function navigateTo(pathname: string) {
  window.location.assign(pathname);
}

export default function RouteSwitcher() {
  const pathname = typeof window === "undefined" ? ROOT_APP_PATH : window.location.pathname;
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = useMemo(
    () => [
      {
        type: "item" as const,
        text: "Main App",
        leadingIcon: <IconExpExp02IconHome width={20} height={20} />,
        trailing:
          pathname === ROOT_APP_PATH ? (
            <span className="opacity-60 text-[12px]">Current</span>
          ) : (
            <IconArrowRightLTR width={16} height={16} />
          ),
        onClick: () => navigateTo(ROOT_APP_PATH),
      },
      {
        type: "item" as const,
        text: "Vibe Select",
        leadingIcon: <IconRoute width={20} height={20} />,
        trailing:
          pathname === ROUTER_PAGE_PATH ? (
            <span className="opacity-60 text-[12px]">Current</span>
          ) : (
            <IconArrowRightLTR width={16} height={16} />
          ),
        onClick: () => navigateTo(ROUTER_PAGE_PATH),
      },
    ],
    [pathname],
  );

  return (
    <div className="hidden sm:block bottom-4 left-4 z-50 fixed">
      <TUXMenu
        visible={menuVisible}
        onVisibleChange={setMenuVisible}
        placement="BlockStart-Start"
        items={menuItems}
        trigger={
          <button
            type="button"
            aria-label="Open route switcher"
            className="flex items-center gap-2 backdrop-blur-sm px-3 py-2 border rounded-full"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--tux-v2-color-ui-page-flat-1) 88%, transparent)",
              borderColor: "var(--tux-v2-color-ui-shape-neutral-3)",
              color: "var(--tux-v2-color-ui-text-1)",
            }}
          >
            <Icon3ptHamburgerMenu width={18} height={18} />
            <span className="font-semibold text-[13px] leading-4">Routes</span>
          </button>
        }
      />
    </div>
  );
}
