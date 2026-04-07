import type { CSSProperties } from "react";

export type HomeIndicatorProps = {
  className?: string;
  style?: CSSProperties;
};

/**
 * Home 指示条（仅 sm 及以上显示）。
 * 用于模拟移动端底部 Home Indicator 的视觉元素，方便统一维护。
 */
export default function HomeIndicator({
  className,
  style,
}: HomeIndicatorProps) {
  return (
    <div
      className={`hidden sm:flex justify-center items-end pb-2 w-full h-8.5 ${className ?? ""}`}
      style={style}
    >
      <div className="rounded-full w-36 h-1.25 bg-tux-v2-ui-text-1" />
    </div>
  );
}
