// import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useCreateOrderMutation, useGetWeeklyRevenueQuery } from "../../../provider/queries/Orders.query"; // Adjust the import path if needed
import Loader from "../../../components/Loader";

const Chart = () => {
  const { data, isLoading, isError, error } = useGetWeeklyRevenueQuery({});


  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Failed to load chart data: {error?.message || "Unknown error"}</div>;
  }


  // Assume the API returns data as [{ date: "DD/MM/YYYY", revenue: 100 }]
  const chartData = data || [];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Weekly Revenue Overview</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;