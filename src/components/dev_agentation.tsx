import { Agentation } from "agentation";

export default function DevAgentation() {
  if (!import.meta.env.DEV) {
    return null;
  }

  const endpoint = import.meta.env.VITE_AGENTATION_ENDPOINT ?? "http://localhost:4747";

  return <Agentation className="agentation-toolbar-bottom-right" endpoint={endpoint} />;
}
