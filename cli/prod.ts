import startup from "./startup.ts";

export function QuickdrawProduction(callback: () => void) {
  startup("production", callback);
}
