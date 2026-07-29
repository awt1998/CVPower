/** Return a new array with the item at `from` moved to `to`. */
export function arrayMove<T>(items: readonly T[], from: number, to: number): T[] {
  const next = items.slice();
  if (from < 0 || from >= next.length || to < 0 || to >= next.length) return next;
  const [moved] = next.splice(from, 1);
  if (moved !== undefined) next.splice(to, 0, moved);
  return next;
}

/** Produce the id order that results from moving the item at `index` by `delta`. */
export function movedIdOrder(
  items: readonly { id: string }[],
  index: number,
  delta: number,
): string[] {
  return arrayMove(items, index, index + delta).map((item) => item.id);
}
