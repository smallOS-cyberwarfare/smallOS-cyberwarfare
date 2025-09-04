import type { SeverityLevel } from '../types-hoist';
/**
 * @deprecated This variable has been deprecated and will be removed in the next major version.
 */
export declare const validSeverityLevels: string[];
/**
 * Converts a string-based level into a `SeverityLevel`, normalizing it along the way.
 *
 * @param level String representation of desired `SeverityLevel`.
 * @returns The `SeverityLevel` corresponding to the given string, or 'log' if the string isn't a valid level.
 */
export declare function severityLevelFromString(level: SeverityLevel | string): SeverityLevel;
//# sourceMappingURL=severity.d.ts.map