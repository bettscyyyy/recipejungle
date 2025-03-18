
import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface NutritionChartProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionChart: React.FC<NutritionChartProps> = ({
  calories,
  protein,
  carbs,
  fat,
}) => {
  const data = [
    {
      name: "Protein",
      value: protein,
      color: "hsl(var(--primary))",
      unit: "g",
    },
    {
      name: "Carbs",
      value: carbs,
      color: "#3b82f6",
      unit: "g",
    },
    {
      name: "Fat",
      value: fat,
      color: "#f97316",
      unit: "g",
    },
  ];

  // Calculate percentages for macros based on calories
  // Protein: 4 calories per gram
  // Carbs: 4 calories per gram
  // Fat: 9 calories per gram
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;
  
  const proteinPercentage = Math.round((proteinCalories / calories) * 100);
  const carbsPercentage = Math.round((carbsCalories / calories) * 100);
  const fatPercentage = Math.round((fatCalories / calories) * 100);

  const pieData = [
    { name: "Protein", value: proteinPercentage, color: "hsl(var(--primary))" },
    { name: "Carbs", value: carbsPercentage, color: "#3b82f6" },
    { name: "Fat", value: fatPercentage, color: "#f97316" },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-background p-2 border border-border rounded-md shadow-md">
          <p className="font-medium">{`${item.name}: ${item.value}${item.unit}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4 glass-card">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-1">Nutrition Facts</h3>
        <div className="flex items-center">
          <span className="text-2xl font-display font-semibold">{calories}</span>
          <span className="text-sm text-muted-foreground ml-1">calories per serving</span>
        </div>
      </div>
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
            layout="vertical"
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-2">
        {pieData.map((item) => (
          <div key={item.name} className="text-center">
            <div className="flex items-center justify-center">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="text-lg font-semibold">{item.value}%</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NutritionChart;
