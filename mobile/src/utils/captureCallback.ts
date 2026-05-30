type CaptureCallback = (uris: string[]) => void;

let pendingCallback: CaptureCallback | null = null;

export function setCaptureCallback(cb: CaptureCallback): void {
  pendingCallback = cb;
}

export function consumeCaptureCallback(): CaptureCallback | null {
  const cb = pendingCallback;
  pendingCallback = null;
  return cb;
}