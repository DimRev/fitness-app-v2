export function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 5000,
) {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout),
    ),
  ]);
}
