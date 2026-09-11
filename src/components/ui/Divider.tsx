import { GemMotif } from "./GemMotif";

/**
 * Bölümler arası editoryal geçiş imzası — sert bir çizgi yerine markanın
 * faset motifiyle işaretlenmiş sakin bir ara.
 */
export function Divider() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center py-2">
      <span className="h-px w-16 bg-border sm:w-24" />
      <GemMotif strokeWidth={1.2} className="mx-4 h-3.5 w-3.5 shrink-0 text-accent-strong/70" />
      <span className="h-px w-16 bg-border sm:w-24" />
    </div>
  );
}
