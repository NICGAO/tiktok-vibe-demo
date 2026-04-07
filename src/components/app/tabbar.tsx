import { createElement, isValidElement, useEffect, useState } from "react";
import type {
  CSSProperties,
  ComponentType,
  ReactElement,
  ReactNode,
} from "react";

import { useTheme, type ThemeMode } from "../../context/theme";

type Five<T> = readonly [T, T, T, T, T];

export type TabbarIcon = ReactElement | ComponentType<any>;

export type TabbarTabItem = {
  icon: TabbarIcon;
  activeIcon: TabbarIcon;
  text?: ReactNode;
  themeOverride?: ThemeMode;
};

type TabbarBaseProps = {
  pages: Five<ReactNode>;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (activeIndex: number) => void;
  className?: string;
  style?: CSSProperties;
  iconSize?: number;
  themeOverrides?: Five<ThemeMode | undefined>;
  tabBarVisible?: boolean;
};

type TabbarPropsWithTabs = TabbarBaseProps & {
  tabs: Five<TabbarTabItem>;
};

type TabbarPropsWithIcons = TabbarBaseProps & {
  icons: Five<TabbarIcon>;
  activeIcons: Five<TabbarIcon>;
  texts?: Five<ReactNode | undefined>;
};

export type TabbarProps = TabbarPropsWithTabs | TabbarPropsWithIcons;

const renderIcon = (iconLike: TabbarIcon, size: number) => {
  if (isValidElement(iconLike)) return iconLike;

  return createElement(iconLike as never, { size, width: size, height: size });
};

const normalizeTabItems = (props: TabbarProps): Five<TabbarTabItem> => {
  if ("tabs" in props) {
    return props.tabs.map((tab, index) => ({
      ...tab,
      themeOverride: tab.themeOverride ?? props.themeOverrides?.[index],
    })) as unknown as Five<TabbarTabItem>;
  }

  return props.icons.map((icon, index) => ({
    icon,
    activeIcon: props.activeIcons[index],
    text: props.texts?.[index],
    themeOverride: props.themeOverrides?.[index],
  })) as unknown as Five<TabbarTabItem>;
};

export type AppTabBarNavProps = {
  tabs: Five<TabbarTabItem>;
  activeIndex: number;
  onChange: (activeIndex: number) => void;
  iconSize?: number;
  className?: string;
  style?: CSSProperties;
};

export const AppTabBarNav = ({
  tabs,
  activeIndex,
  onChange,
  iconSize = 24,
  className,
  style,
}: AppTabBarNavProps) => {
  return (
    <nav
      role="tablist"
      aria-label="Tabs"
      className={
        className ??
        "flex flex-col flex-none bg-tux-v2-ui-page-flat-1 shadow-[0_-1px_0_0_var(--tux-v2-color-ui-shape-neutral-3)] font-semibold text-[10px] text-tux-v2-ui-text-1-display leading-1"
      }
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        ...style,
      }}
    >
      <div className="flex flex-row justify-between">
        {tabs.map((tab, index) => {
          const selected = index === activeIndex;
          const icon = renderIcon(
            selected ? tab.activeIcon : tab.icon,
            iconSize,
          );

          return (
            <button
              key={index}
              className="flex-auto"
              type="button"
              role="tab"
              aria-selected={selected}
              data-active={selected ? "true" : "false"}
              onClick={() => onChange(index)}
            >
              <span className="flex flex-col justify-center items-center">
                <span className="leading-none">{icon}</span>
                {tab.text == null ? null : (
                  <span className="mt-0.75 leading-none">{tab.text}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="hidden sm:block w-full h-8.5" aria-hidden />
    </nav>
  );
};

const Tabbar = (props: TabbarProps) => {
  const {
    pages,
    activeIndex,
    defaultActiveIndex = 0,
    onChange,
    className,
    style,
    iconSize = 24,
    tabBarVisible = true,
  } = props;

  const { setForcedMode } = useTheme();
  const tabItems = normalizeTabItems(props);

  const [internalActiveIndex, setInternalActiveIndex] =
    useState(defaultActiveIndex);
  const resolvedActiveIndex = activeIndex ?? internalActiveIndex;

  const activeThemeOverride =
    tabItems[resolvedActiveIndex]?.themeOverride ?? null;

  useEffect(() => {
    setForcedMode(activeThemeOverride);
  }, [activeThemeOverride, setForcedMode]);

  useEffect(() => {
    return () => setForcedMode(null);
  }, [setForcedMode]);

  const setActiveIndex = (index: number) => {
    onChange?.(index);
    if (activeIndex === undefined) setInternalActiveIndex(index);
  };

  return (
    <div
      data-component="Tabbar"
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        position: "relative",
        ...style,
      }}
    >
      <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
        {pages.map((page, index) => (
          <div
            key={index}
            hidden={index !== resolvedActiveIndex}
            style={{ height: "100%", minHeight: 0 }}
          >
            {page}
          </div>
        ))}
      </div>

      {tabBarVisible ? (
        <AppTabBarNav
          tabs={tabItems}
          activeIndex={resolvedActiveIndex}
          onChange={setActiveIndex}
          iconSize={iconSize}
        />
      ) : null}
    </div>
  );
};

export default Tabbar;
