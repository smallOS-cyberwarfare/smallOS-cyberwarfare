import type { DebugImage, StackParser } from '../types-hoist';
/**
 * Returns a map of filenames to debug identifiers.
 */
export declare function getFilenameToDebugIdMap(stackParser: StackParser): Record<string, string>;
/**
 * Returns a list of debug images for the given resources.
 */
export declare function getDebugImagesForResources(stackParser: StackParser, resource_paths: ReadonlyArray<string>): DebugImage[];
//# sourceMappingURL=debug-ids.d.ts.map