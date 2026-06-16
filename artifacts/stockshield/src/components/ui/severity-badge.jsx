import { AlertSeverity } from "@workspace/api-client-react";
export function SeverityBadge({
  severity,
  className = ""
}) {
  let bg = "bg-primary/10 text-primary border-primary/20";
  if (severity === AlertSeverity.critical) {
    bg = "bg-destructive/10 text-destructive border-destructive/20";
  } else if (severity === AlertSeverity.high) {
    bg = "bg-warning/10 text-warning border-warning/20";
  } else if (severity === AlertSeverity.medium) {
    bg = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  } else if (severity === AlertSeverity.low) {
    bg = "bg-success/10 text-success border-success/20";
  }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${bg} ${className}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>;
}
// Production release cleanup and documentation refresh
