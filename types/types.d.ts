
export type IteratorFunction = (item: any, index: number) => Promise<any>;

export type IndexFunction = (index: number) => Promise<any>;

export type IndexTestFunction = (index: number) => boolean;

export type TaskFunction = (arg?: any) => Promise<any>;

export type Resolve = (arg?: any) => void;

export type Reject = (arg: Error) => void;

export interface ParallelOptions {
  /** timeout in ms which throws`AsynccError` in case that `tasks` are still running */
  timeout?: number;
  /** bail-out on first error */
  bail?: boolean;
}

export interface TimesWithLag {
  /** 
   * max.number of retries 
   */
  times?: number; 
  /**
   * time-lag in ms between retries
   * @default 0
   */
  lag?: number;
}

export enum StatusEnum {
  fulfilled = "fulfilled",
  rejected = "rejected"
}

export interface Status {
  status: StatusEnum;
  value: any
}
