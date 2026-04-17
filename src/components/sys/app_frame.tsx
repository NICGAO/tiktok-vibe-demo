import { getColorCSSVar } from "@byted-tiktok/tux-web";
import type { ColorV2Name } from "@byted-tiktok/tux-color";
import type { ReactNode } from "react";
import HomeIndicator from "./home_indicator";

export type AppFrameProps = {
  children?: ReactNode;
  backgroundColor?: ColorV2Name;
  desktopTopInset?: boolean;
  desktopTopInsetClassName?: string;
};

const AppFrame = (
  {
    children,
    backgroundColor = "UIPageFlat1",
    desktopTopInset = false,
    desktopTopInsetClassName = "sm:pt-15.5",
  }: AppFrameProps
) => {
  return (
    <div
      className="fixed inset-0 w-full h-full"
      style={{ backgroundColor: "#222222" }}
    >
      <div
        data-app-frame-root="true"
        style={{
          backgroundColor: getColorCSSVar(backgroundColor),
          width: "min(100vw, 393px)",
          height: "min(100vh, 852px)",
        }}
        className={[
          "top-1/2 left-1/2 absolute overflow-hidden -translate-x-1/2 -translate-y-1/2",
          desktopTopInset ? desktopTopInsetClassName : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
        <HomeIndicator className="right-0 bottom-0 left-0 z-[2100] absolute pointer-events-none" />
      </div>
    </div>
  );
};

export default AppFrame;
