export function assert(expr: unknown, msg?: string): asserts expr {
  if (!expr) throw new Error(msg)
}
