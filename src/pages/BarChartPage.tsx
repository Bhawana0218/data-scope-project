import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useLocation } from "react-router-dom";


export default function BarChartPage() {
  const location = useLocation();
  const employees = location.state || [];

   const firstTen = employees.slice(0, 10);

  return (
    <>
    <BarChart width={600} height={300} data={firstTen}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="salary" fill="#8884d8" />
    </BarChart>
</>
  );
}