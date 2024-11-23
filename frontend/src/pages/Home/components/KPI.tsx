import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, ShoppingCart, DollarSign, Box } from "lucide-react";
import { useDashboardDataQuery } from "../../../provider/queries/Users.query";

const KPIAnalytics = () => {
  const { data, isLoading, isError, error } = useDashboardDataQuery({});
  const [dailyMetrics, setDailyMetrics] = useState([]);
  const [kpiData, setKpiData] = useState({
    users: 0,
    orders: 0,
    sales: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (data) {
      setKpiData({
        users: data.consumers || 0,
        orders: data.orders || 0,
        sales: data.sell || 0,
        revenue: data.revenue || 0,
      });
      setDailyMetrics(data.dailyMetrics || []);
    }
  }, [data]);

  console.log("Dashboard Data:", data);
  console.log("Token:", localStorage.getItem("token"));

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) {
    console.error("Error fetching dashboard data:", error);
    return <div className="text-center">Something went wrong!</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPIBox
          title="Total Users"
          value={kpiData.users.toLocaleString()}
          icon={Users}
          gradient="from-blue-500 to-purple-700"
        />
        <KPIBox
          title="Total Orders"
          value={kpiData.orders.toLocaleString()}
          icon={ShoppingCart}
          gradient="from-green-500 to-teal-700"
        />
        <KPIBox
          title="Total Sales"
          value={kpiData.sales.toLocaleString()}
          icon={Box}
          gradient="from-yellow-500 to-orange-700"
        />
        <KPIBox
          title="Total Revenue"
          value={`$${kpiData.revenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="from-red-500 to-pink-700"
        />
      </div>

      {/* Line Chart */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailyMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cccccc" />
            <XAxis dataKey="date" stroke="#cccccc" />
            <YAxis stroke="#cccccc" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#34D399"
              name="Sales"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#60A5FA"
              name="Revenue"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const KPIBox = ({ title, value, icon: Icon, gradient }) => (
  <div
    className={`relative bg-gradient-to-br ${gradient} p-6 rounded-lg shadow-lg`}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-200 font-semibold">{title}</p>
        <h3 className="text-2xl text-white font-bold">{value}</h3>
      </div>
      <Icon className="w-10 h-10 text-gray-200" />
    </div>
  </div>
);

export default KPIAnalytics;
