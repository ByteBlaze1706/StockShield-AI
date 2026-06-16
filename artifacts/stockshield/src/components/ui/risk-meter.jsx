import { memo } from "react";
export const RiskMeter = memo(function RiskMeter({
  score,
  size = 200,
  strokeWidth = 16
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Make it an arc (semi-circle)
  const arcOffset = circumference * 0.25;
  const strokeDasharray = `${circumference * 0.75} ${circumference * 0.25}`;

  // score is 0-100. Mapping 0 to 0.75 * circumference
  const filledLength = score / 100 * (circumference * 0.75);
  const strokeDashoffset = circumference * 0.75 - filledLength;
  let color = "hsl(var(--success))"; // green
  if (score > 25) color = "hsl(var(--warning))"; // orange/yellowish (assuming warning is orangeish)
  if (score > 50) color = "hsl(var(--warning))"; // orange
  if (score > 75) color = "hsl(var(--destructive))"; // red

  return <div className="relative flex items-center justify-center" style={{
    width: size,
    height: size
  }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-135">
        {/* Background track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted/50" strokeDasharray={strokeDasharray} strokeLinecap="round" />
        {/* Value track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold font-mono tracking-tighter" style={{
        color
      }}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground uppercase font-semibold tracking-widest mt-1">
          Risk Score
        </span>
      </div>
    </div>;
});
// Production release cleanup and documentation refresh
