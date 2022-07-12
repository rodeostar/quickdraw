import { startup } from "quickdraw";

export function Prep(callback: () => void) {
  startup("production", callback);
}
