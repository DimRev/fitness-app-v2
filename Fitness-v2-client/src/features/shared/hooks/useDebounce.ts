/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

export function useDebounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) {
  const callbackRef = React.useRef(callback);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  let timer: NodeJS.Timeout;

  const naiveDebounce = (
    func: (...args: T) => void,
    delayMs: number,
    ...args: T
  ) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delayMs);
  };

  return React.useMemo(
    () =>
      (...args: T) =>
        naiveDebounce(callbackRef.current, delay, ...args),
    [delay],
  );
}
