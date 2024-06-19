import { type FC } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  data: { name: string; total: number }[] | undefined;
  height?: number;
};

const Chart: FC<Props> = ({ data, height }) => {
  return (
    <ResponsiveContainer
      width="100%"
      height={height ?? 222}
    >
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{ width: 100, backgroundColor: '#c8812' }}
        />
        <Bar
          dataKey="total"
          fill="#a704b5"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: [{ value: string }];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-foreground/90 p-4">
        <p className="font-semibold text-background">{label}</p>
        <p className="text-base font-medium text-primary-200">
          total: {`${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};

export default Chart;
