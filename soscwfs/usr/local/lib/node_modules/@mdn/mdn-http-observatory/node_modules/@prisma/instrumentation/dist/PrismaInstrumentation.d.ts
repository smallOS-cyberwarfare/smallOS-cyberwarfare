import { InstrumentationBase, InstrumentationConfig, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
export interface PrismaInstrumentationConfig {
    middleware?: boolean;
}
type Config = PrismaInstrumentationConfig & InstrumentationConfig;
export declare class PrismaInstrumentation extends InstrumentationBase {
    constructor(config?: Config);
    init(): InstrumentationNodeModuleDefinition[];
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
}
export {};
