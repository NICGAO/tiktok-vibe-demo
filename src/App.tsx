import "./App.css";
import { TUXApp } from "@byted-tiktok/tux-web";
import { useMemo, useState } from "react";
import {
  IconExpExp02IconFriends,
  IconExpExp02IconFriendsFill,
  IconExpExp02IconHome,
  IconExpExp02IconHomeFill,
  IconExpExp02IconInbox,
  IconExpExp02IconInboxFill,
  IconExpExp02IconProfile,
  IconExpExp02IconProfileFill,
} from "@byted-tiktok/tux-icons";

import Tabbar, { AppTabBarNav } from "./components/app/tabbar";
import CreationIcon from "./components/app/creation_icon";
import AppFrame from "./components/sys/app_frame";
import RouteSwitcher from "./components/sys/route_switcher";
import StatusBar from "./components/sys/status_bar";
import ThemeSwitcher from "./components/sys/theme_switcher";
import { useTheme } from "./context/theme";
import InboxPage from "./features/inbox/pages/inbox_page";
import CreationPage from "./page/creation_page";
import FriendsPage from "./page/friends_page";
import HomePage from "./page/home_page";
import ProfilePage from "./page/profile_page";

function App() {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = useMemo(
    () =>
      [
        {
          icon: IconExpExp02IconHome,
          activeIcon: IconExpExp02IconHomeFill,
          text: "Home",
          themeOverride: "dark",
        },
        {
          icon: IconExpExp02IconFriends,
          activeIcon: IconExpExp02IconFriendsFill,
          text: "Friends",
          themeOverride: "dark",
        },
        {
          icon: CreationIcon,
          activeIcon: CreationIcon,
          themeOverride: "dark",
        },
        {
          icon: IconExpExp02IconInbox,
          activeIcon: IconExpExp02IconInboxFill,
          text: "Inbox",
        },
        {
          icon: IconExpExp02IconProfile,
          activeIcon: IconExpExp02IconProfileFill,
          text: "Profile",
        },
      ] as const,
    [],
  );

  return (
    <TUXApp theme={resolvedTheme} textDirection="ltr" platform="iOS">
      <AppFrame>
        <div className="flex flex-col h-full min-h-0">
          <StatusBar />

          <Tabbar
            className="flex-1 min-h-0"
            activeIndex={activeTab}
            onChange={setActiveTab}
            iconSize={24}
            tabBarVisible={activeTab !== 4}
            tabs={tabs}
            pages={
              [
                <HomePage />,
                <FriendsPage />,
                <CreationPage />,
                <InboxPage />,
                <ProfilePage
                  bottomTabBar={
                    <AppTabBarNav
                      tabs={tabs}
                      activeIndex={4}
                      onChange={setActiveTab}
                      iconSize={24}
                    />
                  }
                />,
              ] as const
            }
          />
        </div>
      </AppFrame>

      <RouteSwitcher />
      <ThemeSwitcher />
    </TUXApp>
  );
}

export default App;
