import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Jul',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Aug',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Sep',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Oct',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Nov',
    total: Math.floor(Math.random() * 10) + 1,
  },
  {
    name: 'Dec',
    total: Math.floor(Math.random() * 10) + 1,
  },
];

export function Chart() {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
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
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="#adfa1d"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
