import type { MinimalNestJsApp, NestJsErrorFilter } from './types';
export declare const instrumentNest: (() => void) & {
    id: string;
};
/**
 * Integration capturing tracing data for NestJS.
 *
 * @deprecated The `nestIntegration` is deprecated. Instead, use the NestJS SDK directly (`@sentry/nestjs`), or use the `nestIntegration` export from `@sentry/nestjs`.
 */
export declare const nestIntegration: () => import("@sentry/core").Integration;
/**
 * Setup an error handler for Nest.
 *
 * @deprecated `setupNestErrorHandler` is deprecated.
 * Instead use the `@sentry/nestjs` package, which has more functional APIs for capturing errors.
 * See the [`@sentry/nestjs` Setup Guide](https://docs.sentry.io/platforms/javascript/guides/nestjs/) for how to set up the Sentry NestJS SDK.
 */
export declare function setupNestErrorHandler(app: MinimalNestJsApp, baseFilter: NestJsErrorFilter): void;
//# sourceMappingURL=nest.d.ts.map