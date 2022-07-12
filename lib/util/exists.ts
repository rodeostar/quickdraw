export async function exists(path: string) {
  try {
    await Deno.readTextFile(path);
    return true;
  } catch (_error) {
    return false;
  }
}
