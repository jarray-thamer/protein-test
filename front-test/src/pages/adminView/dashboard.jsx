import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  {
    designation: "Creatine Monohydrate 500KG - Qumtrax",
    sold: 243,
    revenue: 1234.42,
  },
];

const chartConfig = {
  sold: {
    label: "total Sold",
    color: "#18181B",
  },
  revenue: {
    label: "total Revenue",
    color: "#F4F4F5",
  },
};

export function Dashboard() {
  return (
    <div className="p-4">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="designation"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="sold" fill="#18181B" radius={4} />
              <Bar dataKey="revenue" fill="#CACACC" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {/* <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="w-4 h-4" />
          </div> */}
          <div className="leading-none text-muted-foreground">
            Showing top 6 products, total revenue and total sold.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
