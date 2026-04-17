import { Agentation } from "agentation";

export default function DevAgentation() {
  const isEnabled = import.meta.env.DEV && import.meta.env.VITE_ENABLE_AGENTATION === "true";

  if (!isEnabled) {
    return null;
  }

  const endpoint = import.meta.env.VITE_AGENTATION_ENDPOINT ?? "http://localhost:4747";

  return <Agentation className="agentation-toolbar-bottom-right" endpoint={endpoint} />;
}
