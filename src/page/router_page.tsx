import { TUXApp } from "@byted-tiktok/tux-web";

import AppFrame from "../components/sys/app_frame";
import RouteSwitcher from "../components/sys/route_switcher";
import StatusBar from "../components/sys/status_bar";
import ThemeSwitcher from "../components/sys/theme_switcher";
import { useTheme } from "../context/theme";
import VibeSelectAggressiveV1 from "../features/onboarding/pages/vibe_select_aggressive_v1";

export default function RouterPage() {
  const { resolvedTheme } = useTheme();

  return (
    <TUXApp theme={resolvedTheme} textDirection="ltr" platform="iOS">
      <AppFrame>
        <div className="flex flex-col h-full min-h-0">
          <StatusBar />
          <div className="flex flex-col flex-1 min-h-0">
            <VibeSelectAggressiveV1 />
          </div>
        </div>
      </AppFrame>

      <RouteSwitcher />

      <ThemeSwitcher />
    </TUXApp>
  );
}
