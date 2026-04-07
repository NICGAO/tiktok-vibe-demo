import { TUXNavBar, TUXNavBarIconAction } from "@byted-tiktok/tux-web";
import {
  TUXIconEllipsisHorizontal,
  TUXIconMagnifyingGlass,
  TUXIconTwoPersonPlus,
} from "@byted-tiktok/tux-icons";
import { useState } from "react";

import { inboxRows, inboxStories } from "../data/mock";
import { InboxRowCell } from "../components/inbox_row_cell";
import { InboxNavBarTitle } from "../components/inbox_navbar_title";
import { StorySkylightCell } from "../components/story_skylight_cell";

export default function InboxPage() {
  const [navBarBackgroundOpacity, setNavBarBackgroundOpacity] = useState(0);
  const [navBarShowSeparator, setNavBarShowSeparator] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col bg-tux-v2-ui-page-flat-1 sm:pt-15.5">
      <TUXNavBar
        heightPreset={44}
        customTitle={<InboxNavBarTitle />}
        showSeparator={navBarShowSeparator}
        backgroundColor="UIPageFlat1"
        backgroundOpacity={navBarBackgroundOpacity}
        leading={
          <TUXNavBarIconAction
            aria-label="Invite friends"
            width="44px"
            height="44px"
            icon={
              <TUXIconTwoPersonPlus
                size={24}
                color="var(--tux-v2-color-ui-text-1)"
              />
            }
          />
        }
        trailing={
          <div className="flex items-center">
            <TUXNavBarIconAction
              aria-label="Search inbox"
              width="44px"
              height="44px"
              icon={
                <TUXIconMagnifyingGlass
                  size={24}
                  color="var(--tux-v2-color-ui-text-1)"
                />
              }
            />
            <TUXNavBarIconAction
              aria-label="More inbox actions"
              width="44px"
              height="44px"
              icon={
                <TUXIconEllipsisHorizontal
                  size={24}
                  color="var(--tux-v2-color-ui-text-1)"
                />
              }
            />
          </div>
        }
      />

      <div
        className="min-h-0 flex-1 overflow-y-auto"
        onScroll={(event) => {
          const { scrollTop } = event.currentTarget;
          const nextOpacity = scrollTop > 0 ? 1 : 0;
          const nextShowSeparator = scrollTop > 6;

          setNavBarBackgroundOpacity((currentOpacity) =>
            currentOpacity === nextOpacity ? currentOpacity : nextOpacity,
          );
          setNavBarShowSeparator((current) =>
            current === nextShowSeparator ? current : nextShowSeparator,
          );
        }}
      >
        <section className="px-0 pb-0 pt-0">
          <div className="hide-scrollbar flex gap-6 overflow-x-auto px-4 pb-0 pt-[56px]">
            {inboxStories.map((story) => (
              <StorySkylightCell key={story.id} story={story} />
            ))}
          </div>
        </section>

        <div className="bg-tux-v2-ui-page-flat-1 pt-2">
          {inboxRows.map((row) => (
            <InboxRowCell key={row.id} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}
