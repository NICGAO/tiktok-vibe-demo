import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@byted-tiktok/tux-web/styles.css";
import App from "./App.tsx";
import DevAgentation from "./components/dev_agentation";
import { isRouterPagePath } from "./components/sys/route_switcher";
import { ThemeProvider } from "./context/theme";
import RouterPage from "./page/router_page";

if (typeof window !== "undefined" && "ongesturestart" in window) {
  const prevent = (event: Event) => {
    event.preventDefault();
  };

  for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
    document.addEventListener(type, prevent, { passive: false });
  }
}

if (typeof window !== "undefined" && "ongesturestart" in window) {
  const prevent = (event: Event) => {
    event.preventDefault();
  };

  for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
    document.addEventListener(type, prevent, { passive: false });
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <>
        {isRouterPagePath(window.location.pathname) ? <RouterPage /> : <App />}
        <DevAgentation />
      </>
    </ThemeProvider>
  </StrictMode>,
);
