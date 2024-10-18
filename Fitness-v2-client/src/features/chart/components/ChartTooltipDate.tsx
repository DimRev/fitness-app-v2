import React from "react";
import {
  type NameType,
  type Payload,
  type ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Card } from "~/features/shared/components/ui/card";
import { Separator } from "~/features/shared/components/ui/separator";
import { cn } from "~/lib/utils";

interface TooltipPayload {
  date: string | Date;
  [key: string]: number | string | Date;
}

type Props = {
  keyLabels: { key: string; label: string }[];
  payload: Payload<ValueType, NameType>[] | undefined;
};

function ChartTooltipDate({ keyLabels, payload }: Props) {
  if (!payload || payload.length === 0) return null;
  const data = payload[0].payload as TooltipPayload;

  return (
    <Card className="w-44 border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="py-1">
        <p>{new Date(data.date).toDateString()}</p>
      </div>
      <Separator />

      <div className="grid grid-cols-[auto_auto_1fr] items-center gap-1 pt-1">
        {keyLabels.map(({ key, label }) => (
          <React.Fragment key={key}>
            <div
              className={cn(
                `h-2.5 w-2.5 shrink-0 rounded-[2px] border-[--color-${key}] bg-[--color-${key}]`,
              )}
            />
            <p className="text-muted-foreground">{label}</p>
            <p className="text-end">{data[key] as string | number}</p>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

export default ChartTooltipDate;
