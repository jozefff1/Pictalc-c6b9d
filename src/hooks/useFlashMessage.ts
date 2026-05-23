import { useState, useCallback } from 'react';

/**
 * Auto-resetting boolean flag for transient UI feedback (e.g. "Saved!" banners).
 *
 * @param duration - How long (ms) the flag stays true before resetting. Default: 2000
 * @returns [active, trigger] — read the flag with `active`, trigger with `trigger()`
 *
 * @example
 * const [saved, triggerSaved] = useFlashMessage();
 * // ...
 * await saveData();
 * triggerSaved(); // shows feedback for 2 s
 */
export function useFlashMessage(duration = 2000): [boolean, () => void] {
  const [active, setActive] = useState(false);
  const trigger = useCallback(() => {
    setActive(true);
    setTimeout(() => setActive(false), duration);
  }, [duration]);
  return [active, trigger];
}
