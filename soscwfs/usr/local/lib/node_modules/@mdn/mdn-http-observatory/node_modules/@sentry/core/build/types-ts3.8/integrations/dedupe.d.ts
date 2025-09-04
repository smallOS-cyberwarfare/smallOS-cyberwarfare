import { Event } from '../types-hoist';
/**
 * Deduplication filter.
 */
export declare const dedupeIntegration: () => import("../types-hoist").Integration;
/** only exported for tests. */
export declare function _shouldDropEvent(currentEvent: Event, previousEvent?: Event): boolean;
//# sourceMappingURL=dedupe.d.ts.map
