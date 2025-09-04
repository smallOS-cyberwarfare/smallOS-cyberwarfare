import { ConsoleLevel } from '../types-hoist';
/** An error emitted by Sentry SDKs and related utilities. */
export declare class SentryError extends Error {
    message: string;
    logLevel: ConsoleLevel;
    constructor(message: string, logLevel?: ConsoleLevel);
}
//# sourceMappingURL=error.d.ts.map
