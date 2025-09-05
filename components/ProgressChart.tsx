import { Training } from "@/types/Training";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProgressChart = ({ history }: { history: Training[] }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Sort data chronologically (oldest to newest) for proper left-to-right display
  const chartData = [...history]
    .sort((a, b) => a.startTime - b.startTime)
    .map((training, index) => ({
      ...training,
      sessionNumber: index + 1,
      formattedDate: formatDate(training.startTime),
    }));

  // Calculate trend
  const getTrend = () => {
    if (chartData.length < 2) return { direction: "neutral", value: 0 };

    const recent = chartData.slice(-3); // Last 3 sessions
    const older = chartData.slice(-6, -3); // 3 sessions before that

    if (older.length === 0) return { direction: "neutral", value: 0 };

    const recentAvg = recent.reduce((sum, item) => sum + item.performance, 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item.performance, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (difference > 5) return { direction: "up", value: difference };
    if (difference < -5) return { direction: "down", value: Math.abs(difference) };
    return { direction: "neutral", value: 0 };
  };

  const trend = getTrend();
  const bestPerformance = Math.max(...chartData.map(d => d.performance));
  const averagePerformance = Math.round(
    chartData.reduce((sum, d) => sum + d.performance, 0) / chartData.length
  );

  return (
    <Card className="w-full bg-gradient-to-br from-card via-card to-muted/10 border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              Performance Trends
              {trend.direction === "up" && <TrendingUp className="h-5 w-5 text-green-500" />}
              {trend.direction === "down" && <TrendingDown className="h-5 w-5 text-red-500" />}
              {trend.direction === "neutral" && <Minus className="h-5 w-5 text-muted-foreground" />}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track your performance across training sessions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Badge variant="outline" className="text-xs">
              Best: {bestPerformance}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Avg: {averagePerformance}
            </Badge>
            {trend.direction !== "neutral" && (
              <Badge
                variant={trend.direction === "up" ? "default" : "destructive"}
                className="text-xs"
              >
                {trend.direction === "up" ? "↗" : "↘"} {Math.round(trend.value)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <ResponsiveContainer
          width="100%"
          height={250}
          className="sm:h-[300px] lg:h-[350px]"
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="50%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted/30"
              vertical={false}
            />
            <XAxis
              dataKey="formattedDate"
              className="text-muted-foreground text-xs sm:text-sm"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}`}
              className="text-muted-foreground text-xs sm:text-sm"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={35}
            />
            <Tooltip
              labelFormatter={(label) => `Session: ${label}`}
              formatter={(value: number) => [`${value}`, "Performance"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "14px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)",
                border: "1px solid hsl(var(--border))",
              }}
              labelStyle={{
                color: "hsl(var(--foreground))",
                fontWeight: "600",
              }}
            />
            <Area
              type="monotone"
              dataKey="performance"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              fill="url(#performanceGradient)"
              dot={{
                fill: "hsl(var(--primary))",
                strokeWidth: 2,
                r: 4,
                stroke: "hsl(var(--background))"
              }}
              activeDot={{
                r: 7,
                strokeWidth: 3,
                stroke: "hsl(var(--primary))",
                fill: "hsl(var(--background))",
                className: "drop-shadow-lg"
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
