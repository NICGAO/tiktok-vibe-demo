import { TUXApp, TUXNavBar } from "@byted-tiktok/tux-web";

import AppFrame from "../components/sys/app_frame";
import RouteSwitcher from "../components/sys/route_switcher";
import StatusBar from "../components/sys/status_bar";
import ThemeSwitcher from "../components/sys/theme_switcher";
import { useTheme } from "../context/theme";

export default function RouterPage() {
  const { resolvedTheme } = useTheme();

  return (
    <TUXApp theme={resolvedTheme} textDirection="ltr" platform="iOS">
      <AppFrame desktopTopInset>
        <div className="flex flex-col h-full min-h-0">
          <StatusBar />
          <div className="flex flex-col flex-1 min-h-0">
            <TUXNavBar
              heightPreset={44}
              title="Router Page"
              showSeparator={true}
            />
          </div>
        </div>
      </AppFrame>

      <RouteSwitcher />

      <ThemeSwitcher />
    </TUXApp>
  );
}