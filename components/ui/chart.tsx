"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs text-rose-700 [&_.recharts-cartesian-axis-tick_text]:fill-rose-500 [&_.recharts-tooltip-cursor]:stroke-rose-300",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & React.ComponentProps<"div">
>(({ active, payload, className, label, formatter }, ref) => {
  if (!active || !payload?.length) return null;

  console.log("Tooltip Payload:", JSON.stringify(payload, null, 2)); // Debugging

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs shadow-lg shadow-rose-300",
        className
      )}
    >
      <div className="font-medium text-rose-800">{label}</div>
      {payload.map((item, index) => {
        // Ensure item.dataKey exists before accessing payload[item.dataKey]
        const value: number | string =
          (item?.dataKey && item?.payload?.[item.dataKey]) ??
          item?.value ??
          "N/A"; // Ensures value is always defined

        return (
          <div key={index} className="flex justify-between text-rose-700">
            <span>{item.name}</span>
            <span className="font-mono font-semibold text-amber-600">
              {formatter
                ? formatter(
                    value as number, // Ensure a valid type
                    item.name ?? "",
                    item,
                    index,
                    item.payload ?? {}
                  )
                : value}
            </span>
          </div>
        );
      })}
    </div>
  );
});
ChartTooltipContent.displayName = "ChartTooltipContent";



const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & Pick<RechartsPrimitive.LegendProps, "payload">
>(({ className, payload }, ref) => {
  if (!payload?.length) return null;

  return (
    <div ref={ref} className={cn("flex items-center justify-center gap-4 pt-3", className)}>
      {payload.map((item) => (
        <div key={item.value} className="flex items-center gap-1.5 text-rose-800">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartLegend = RechartsPrimitive.Legend;

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
