import { Span } from '../types-hoist';
import { Scope } from '../types-hoist';
/** Store the scope & isolation scope for a span, which can the be used when it is finished. */
export declare function setCapturedScopesOnSpan(span: Span | undefined, scope: Scope, isolationScope: Scope): void;
/**
 * Grabs the scope and isolation scope off a span that were active when the span was started.
 */
export declare function getCapturedScopesOnSpan(span: Span): {
    scope?: Scope;
    isolationScope?: Scope;
};
//# sourceMappingURL=utils.d.ts.map
