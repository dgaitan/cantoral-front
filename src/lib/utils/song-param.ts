export function parseSongParam(param: string): { id: string; rest: string } {
  const dashIndex = param.indexOf("-");
  if (dashIndex === -1) return { id: param, rest: "" };
  return { id: param.slice(0, dashIndex), rest: param.slice(dashIndex + 1) };
}

export function buildSongParam(id: string | number, slug: string): string {
  return `${id}-${slug}`;
}
