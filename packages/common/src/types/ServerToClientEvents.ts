export type ServerToClientEvents = {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: ArrayBuffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
};
