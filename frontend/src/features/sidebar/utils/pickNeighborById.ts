type WithId = { id: string }

/**
 * Pick the previous item if present, otherwise the next one.
 * @param list Readonly array of items having an `id: string`
 * @param id   The id of the item around which to pick a neighbor
 * @returns    The neighbor item or null
 */
export default function pickNeighborById<T extends WithId>(
  list: readonly T[],
  id: string,
): T | null {
  if (!list.length) return null
  const idx = list.findIndex((x) => x.id === id)
  if (idx === -1) return null

  // `.at()` handles negative/overflow indices and returns T | undefined
  const prev = list.at(idx - 1)
  const next = list.at(idx + 1)
  return next ?? prev ?? null
}
