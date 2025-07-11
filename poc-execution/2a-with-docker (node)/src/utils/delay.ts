export async function delay(delayInMs = 3000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayInMs))
}
