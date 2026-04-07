import { getColorCSSVar } from "@byted-tiktok/tux-web";
import { gsap } from "gsap";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type DragState = {
  pointerId: number | null;
  isDragging: boolean;
  startY: number;
  startTime: number;
  lastY: number;
  lastTime: number;
  velocityY: number;
  height: number;
  activeIndex: number;
  baseTrackY: number;
  trackY: number;
};

export type VerticalSnapPagerProps = {
  pages: ReactNode[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (activeIndex: number) => void;
  className?: string;
  style?: CSSProperties;

  /** Whether to show the full-screen color fill feedback while dragging. */
  gestureFill?: boolean;
};

/**
 * 手势判定参数（当前配置偏“很容易翻页”）
 * - 速度：用于快速甩动翻页（单位 px/ms）
 * - 位移：用于慢速轻拖翻页（单位 px）
 * - 进度：用于很小位移/很小速度时的兜底（按页面高度比例）
 */
const VELOCITY_THRESHOLD = 0.02; // px/ms
const MIN_TRAVEL_PX = 4; // px
const PROGRESS_THRESHOLD = 0.1; // fraction of page height

/** 惯性预测：根据松手瞬间速度向前推一小段时间（ms）以决定目标页 */
const INERTIA_PROJECT_MS = 160;

/**
 * 速度滤波（低通）：减少 pointermove 的抖动噪声。
 * 说明：不会改变方向，只让速度更“稳”，属于常见手势实现细节。
 */
const VELOCITY_FILTER_ALPHA = 0.35;

/** 边界阻尼：在第一页/最后一页继续拖拽时增加阻尼，避免无限滑出 */
const OVERSCROLL_RESISTANCE = 0.35;

/** 吸附动画时长（秒） */
const ANIMATION_DURATION = 0.45;
const DESKTOP_WHEEL_MIN_WIDTH = 768;
const WHEEL_TRIGGER_THRESHOLD_PX = 48;
const WHEEL_RESET_MS = 160;
const WHEEL_COOLDOWN_MS = 420;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function VerticalSnapPager({
  pages,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  className,
  style,
  gestureFill = true,
}: VerticalSnapPagerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const panelsRef = useRef<Array<HTMLDivElement | null>>([]);
  const gestureOverlayRef = useRef<HTMLDivElement | null>(null);

  const [internalActiveIndex, setInternalActiveIndex] = useState(() =>
    clamp(defaultActiveIndex, 0, Math.max(0, pages.length - 1)),
  );

  const resolvedActiveIndex = activeIndex ?? internalActiveIndex;

  const dragRef = useRef<DragState>({
    pointerId: null,
    isDragging: false,
    startY: 0,
    startTime: 0,
    lastY: 0,
    lastTime: 0,
    velocityY: 0,
    height: 0,
    activeIndex: resolvedActiveIndex,
    baseTrackY: 0,
    trackY: 0,
  });

  useEffect(() => {
    dragRef.current.activeIndex = resolvedActiveIndex;
  }, [resolvedActiveIndex]);

  const pageCount = pages.length;

  const fillColors = useMemo(() => {
    return {
      upFill: getColorCSSVar("UIShapeSuccess"),
      downFill: getColorCSSVar("UIShapeDanger"),
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const overlay = gestureOverlayRef.current;
    if (!root || !track) return;
    if (gestureFill && !overlay) return;
    if (pageCount <= 0) return;

    root.style.cursor = "grab";

    const setTrackY = gsap.quickSetter(track, "y", "px");
    const setOverlayOpacity = overlay ? gsap.quickSetter(overlay, "opacity") : null;
    const setOverlayBg = overlay ? gsap.quickSetter(overlay, "backgroundColor") : null;

    let lastFill: "up" | "down" | null = null;
    let relayoutRaf: number | null = null;
    let windowListenersAttached = false;
    let wheelLock = false;
    let wheelAccumulatedY = 0;
    let wheelResetTimer: number | null = null;
    let wheelUnlockTimer: number | null = null;

    // 将高频 move 合并到每帧一次（业界常用），减少重复计算/DOM 写入
    let moveRaf: number | null = null;
    let pendingMoveY: number | null = null;
    let pendingMoveTime: number | null = null;

    // ResizeObserver 也合并到 RAF，避免短时间内重复触发布局
    let resizeRaf: number | null = null;

    // 缓存上一次布局高度：避免每次 applyLayout 都重复写入所有 panel 的高度
    let lastAppliedHeight = 0;
    let lastAppliedPageCount = 0;

    /**
     * 计算布局与高度。
     * 注意：切换路由/tab 时容器可能短暂高度为 0，这里做 RAF 重试兜底。
     */
    const applyLayout = (attempt = 0) => {
      const height = root.getBoundingClientRect().height;
      if (height < 2) {
        if (attempt < 10) {
          if (relayoutRaf != null) cancelAnimationFrame(relayoutRaf);
          relayoutRaf = requestAnimationFrame(() => applyLayout(attempt + 1));
        }
        return;
      }

      dragRef.current.height = height;

      const shouldReflowPanels =
        Math.abs(height - lastAppliedHeight) > 0.5 || lastAppliedPageCount !== pageCount;
      if (shouldReflowPanels) {
        track.style.height = `${height * pageCount}px`;

        for (let index = 0; index < pageCount; index += 1) {
          const panel = panelsRef.current[index];
          if (panel) panel.style.height = `${height}px`;
        }

        lastAppliedHeight = height;
        lastAppliedPageCount = pageCount;
      }

      const y = dragRef.current.isDragging
        ? dragRef.current.trackY
        : -dragRef.current.activeIndex * height;
      dragRef.current.trackY = y;
      setTrackY(y);
    };

    applyLayout();

    const resizeObserver = new ResizeObserver(() => {
      if (resizeRaf != null) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        applyLayout();
      });
    });
    resizeObserver.observe(root);

    const snapToIndex = (nextIndex: number) => {
      const clamped = clamp(nextIndex, 0, pageCount - 1);

      onActiveIndexChange?.(clamped);
      if (activeIndex === undefined) setInternalActiveIndex(clamped);

      dragRef.current.activeIndex = clamped;

      const targetY = -clamped * dragRef.current.height;
      dragRef.current.trackY = targetY;

      gsap.killTweensOf(track);
      gsap.to(track, {
        y: targetY,
        duration: ANIMATION_DURATION,
        ease: "power3.out",
      });
    };

    const endDragUi = () => {
      dragRef.current.isDragging = false;
      dragRef.current.pointerId = null;
      root.style.cursor = "grab";

      lastFill = null;
      if (overlay) {
        gsap.killTweensOf(overlay);
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.18,
          ease: "power2.out",
        });
      }
    };

    const attachWindowListeners = () => {
      if (windowListenersAttached) return;
      windowListenersAttached = true;
      window.addEventListener("pointerup", onPointerUpOrCancel);
      window.addEventListener("pointercancel", onPointerUpOrCancel);
    };

    const detachWindowListeners = () => {
      if (!windowListenersAttached) return;
      windowListenersAttached = false;
      window.removeEventListener("pointerup", onPointerUpOrCancel);
      window.removeEventListener("pointercancel", onPointerUpOrCancel);
    };

    /**
     * 结束拖拽时的统一“物理判定”。
     * 说明：松手、丢 capture、失焦、切到后台——全部走同一套逻辑。
     */
    const getReleaseTargetIndex = () => {
      const height = dragRef.current.height;
      const absVy = Math.abs(dragRef.current.velocityY);
      const deltaTrackY = dragRef.current.trackY - dragRef.current.baseTrackY;
      const absDeltaTrackY = Math.abs(deltaTrackY);

      let nextIndex = dragRef.current.activeIndex;
      if (absVy > VELOCITY_THRESHOLD) {
        // 1) 先看速度：明显甩动就直接翻页
        nextIndex += dragRef.current.velocityY < 0 ? 1 : -1;
      } else if (absDeltaTrackY >= MIN_TRAVEL_PX) {
        // 2) 再看位移：慢速轻拖也尽量翻页
        nextIndex += deltaTrackY < 0 ? 1 : -1;
      } else {
        // 3) 最后兜底：用惯性预测位置 + 进度阈值来决定是否跨页
        const projectedTrackY =
          absVy > 0.12
            ? dragRef.current.trackY + dragRef.current.velocityY * INERTIA_PROJECT_MS
            : dragRef.current.trackY;

        const progress = -projectedTrackY / Math.max(1, height);
        const clampedProgress = clamp(progress, 0, pageCount - 1);
        const rounded = Math.round(clampedProgress);

        nextIndex = rounded;

        const deltaFromActive = clampedProgress - dragRef.current.activeIndex;
        if (nextIndex === dragRef.current.activeIndex) {
          if (deltaFromActive >= PROGRESS_THRESHOLD) nextIndex += 1;
          else if (deltaFromActive <= -PROGRESS_THRESHOLD) nextIndex -= 1;
          else {
            // keep current index
          }
        }
      }

      return nextIndex;
    };

    /** 统一收口：结束拖拽 UI、移除监听、按统一物理判定吸附到目标页 */
    const finishDrag = () => {
      if (moveRaf != null) {
        cancelAnimationFrame(moveRaf);
        moveRaf = null;
      }
      pendingMoveY = null;
      pendingMoveTime = null;

      applyLayout();
      endDragUi();
      detachWindowListeners();
      snapToIndex(getReleaseTargetIndex());
    };

    /**
     * 非正常结束（出界/失焦/切后台等）也按 finishDrag 的同一套判定吸附。
     * 注意：这里名字保留语义但不再“就近吸附”。
     */
    const forceFinishFromAbort = () => {
      if (!dragRef.current.isDragging) return;
      finishDrag();
    };

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;

      return Boolean(
        target.closest(
          "button, a, input, textarea, select, [role='button'], [role='link'], [data-no-drag]",
        ),
      );
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      // If the user is interacting with a real control, don't hijack it as a drag gesture.
      // Otherwise preventDefault() would suppress the ensuing click.
      if (isInteractiveTarget(event.target)) return;

      // 触屏下避免触发浏览器默认滚动/手势（配合 touch-action: none 更稳）
      if (event.cancelable) event.preventDefault();

      applyLayout();

      dragRef.current.pointerId = event.pointerId;
      dragRef.current.isDragging = true;
      dragRef.current.startY = event.clientY;
      dragRef.current.startTime = performance.now();
      dragRef.current.lastY = event.clientY;
      dragRef.current.lastTime = dragRef.current.startTime;
      dragRef.current.velocityY = 0;
      dragRef.current.baseTrackY = dragRef.current.trackY;

      // 重置 move 合并状态
      if (moveRaf != null) {
        cancelAnimationFrame(moveRaf);
        moveRaf = null;
      }
      pendingMoveY = null;
      pendingMoveTime = null;

      if (event.pointerType === "mouse") root.style.cursor = "grabbing";

      gsap.killTweensOf(track);

      if (overlay && setOverlayOpacity) {
        gsap.killTweensOf(overlay);
        setOverlayOpacity(0);
      }

      attachWindowListeners();

      try {
        // pointer capture 能保证移出元素后仍能收到 move/up；失败时由 window 监听兜底
        root.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    };

    const flushPendingMove = () => {
      moveRaf = null;
      if (!dragRef.current.isDragging) return;

      const clientY = pendingMoveY;
      const now = pendingMoveTime;
      if (clientY == null || now == null) return;

      const dy = clientY - dragRef.current.startY;
      const currentIndex = dragRef.current.activeIndex;
      const isAtTop = currentIndex === 0;
      const isAtBottom = currentIndex === pageCount - 1;

      let resistedDy = dy;
      if ((isAtTop && dy > 0) || (isAtBottom && dy < 0)) {
        // 到边界后加阻尼，避免拖到很远
        resistedDy = dy * OVERSCROLL_RESISTANCE;
      }

      const nextY = dragRef.current.baseTrackY + resistedDy;
      dragRef.current.trackY = nextY;
      setTrackY(nextY);

      if (overlay && setOverlayOpacity && setOverlayBg) {
        const height = Math.max(1, dragRef.current.height);
        const fillRatio = clamp(Math.abs(dy) / height, 0, 1);
        const nextFill = dy < 0 ? "up" : "down";

        if (nextFill !== lastFill) {
          setOverlayBg(nextFill === "up" ? fillColors.upFill : fillColors.downFill);
          lastFill = nextFill;
        }

        setOverlayOpacity(fillRatio * 0.75);
      }

      // 速度估算：用 dt 做瞬时速度，再做轻微低通滤波（更稳定）
      const dt = Math.max(1, now - dragRef.current.lastTime);
      const instantVy = (clientY - dragRef.current.lastY) / dt;
      dragRef.current.velocityY =
        dragRef.current.velocityY * (1 - VELOCITY_FILTER_ALPHA) +
        instantVy * VELOCITY_FILTER_ALPHA;
      dragRef.current.lastY = clientY;
      dragRef.current.lastTime = now;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragRef.current.isDragging) return;
      if (dragRef.current.pointerId !== event.pointerId) return;

      if (event.cancelable) event.preventDefault();

      // 合并到 RAF：只记录最新位置，下一帧统一更新 UI/速度
      pendingMoveY = event.clientY;
      pendingMoveTime = performance.now();
      if (moveRaf == null) moveRaf = requestAnimationFrame(flushPendingMove);
    };

    const onPointerUpOrCancel = (event: PointerEvent) => {
      if (!dragRef.current.isDragging) return;
      if (dragRef.current.pointerId !== event.pointerId) return;

      // 松手：按统一 finishDrag 收口（与出界/失焦等“放弃结束”同物理）
      finishDrag();
    };

    const onLostPointerCapture = () => {
      forceFinishFromAbort();
    };

    const onWindowBlur = () => {
      forceFinishFromAbort();
    };

    const onVisibilityChange = () => {
      if (document.hidden) forceFinishFromAbort();
    };

    const resetWheelAccumulator = () => {
      wheelAccumulatedY = 0;
      if (wheelResetTimer != null) {
        window.clearTimeout(wheelResetTimer);
        wheelResetTimer = null;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth < DESKTOP_WHEEL_MIN_WIDTH) return;
      if (dragRef.current.isDragging || pageCount <= 1) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();

      if (wheelLock) return;

      wheelAccumulatedY += event.deltaY;
      if (wheelResetTimer != null) window.clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelAccumulatedY = 0;
        wheelResetTimer = null;
      }, WHEEL_RESET_MS);

      if (Math.abs(wheelAccumulatedY) < WHEEL_TRIGGER_THRESHOLD_PX) return;

      const direction = wheelAccumulatedY > 0 ? 1 : -1;
      resetWheelAccumulator();

      const currentIndex = dragRef.current.activeIndex;
      const nextIndex = clamp(currentIndex + direction, 0, pageCount - 1);
      if (nextIndex === currentIndex) return;

      wheelLock = true;
      snapToIndex(nextIndex);
      wheelUnlockTimer = window.setTimeout(() => {
        wheelLock = false;
        wheelUnlockTimer = null;
      }, WHEEL_COOLDOWN_MS);
    };

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUpOrCancel);
    root.addEventListener("pointercancel", onPointerUpOrCancel);
    root.addEventListener("lostpointercapture", onLostPointerCapture);
    root.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      detachWindowListeners();
      if (moveRaf != null) cancelAnimationFrame(moveRaf);
      if (resizeRaf != null) cancelAnimationFrame(resizeRaf);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUpOrCancel);
      root.removeEventListener("pointercancel", onPointerUpOrCancel);
      root.removeEventListener("lostpointercapture", onLostPointerCapture);
      root.removeEventListener("wheel", onWheel);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      resetWheelAccumulator();
      if (wheelUnlockTimer != null) window.clearTimeout(wheelUnlockTimer);
      if (relayoutRaf != null) cancelAnimationFrame(relayoutRaf);
      root.style.cursor = "";
    };
  }, [activeIndex, fillColors.downFill, fillColors.upFill, gestureFill, onActiveIndexChange, pageCount]);

  if (pageCount <= 0) {
    return (
      <div
        ref={rootRef}
        className={className}
        style={{ touchAction: "none", ...(style ?? {}) }}
      />
    );
  }

  const overlayEl = gestureFill ? (
    <div
      ref={gestureOverlayRef}
      className="z-0 absolute inset-0 pointer-events-none"
      style={{ opacity: 0 }}
    />
  ) : null;

  return (
    <div
      ref={rootRef}
      className={`relative w-full h-full overflow-hidden select-none cursor-grab ${className ?? ""}`}
      style={{ touchAction: "none", ...(style ?? {}) }}
    >
      {overlayEl}

      <div
        ref={trackRef}
        className="z-10 relative w-full"
        style={{ willChange: "transform" }}
      >
        {pages.map((node, index) => (
          <div
            key={index}
            ref={(el) => {
              panelsRef.current[index] = el;
            }}
            className="relative w-full"
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
