import { EventHint, SendFeedbackParams } from './types-hoist';
/**
 * Send user feedback to Sentry.
 */
export declare function captureFeedback(params: SendFeedbackParams, hint?: EventHint & {
    includeReplay?: boolean;
}, scope?: import("./types-hoist").Scope): string;
//# sourceMappingURL=feedback.d.ts.map
