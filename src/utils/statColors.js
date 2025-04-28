export function statColor(statName) {
  const map = {
    Severity: "red-500",
    Reproducibility: "green-500",
    Complexity: "yellow-500",
    Legacy: "purple-500",
    Priority: "orange-500",
  }
  return map[statName] || "slate-500"
}
