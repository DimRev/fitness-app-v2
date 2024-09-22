export function parseJSONData<T>(JSONData: string) {
  if (
    typeof JSONData === "string" &&
    JSONData.startsWith('"') &&
    JSONData.endsWith('"')
  ) {
    JSONData = JSONData.slice(1, -1); // Remove the first and last quote
  }

  return JSON.parse(JSONData) as T;
}
