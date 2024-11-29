// import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useGetWeeklyRevenueQuery } from "../../../provider/queries/Orders.query"; // Adjust the import path if needed

import { useEffect} from "react";
import { triggerRefresh, selectRefreshKey } from "../../../provider/slice/refreshSlice";
import { useDispatch, useSelector } from "react-redux";

const Chart = () => {
 

  const dispatch = useDispatch();
  const refreshKey = useSelector(selectRefreshKey);

  const { data, isLoading, isError } = useGetWeeklyRevenueQuery(refreshKey);

  useEffect(() => {
    // Dispatch refresh action to update key whenever the component mounts
    dispatch(triggerRefresh());
  }, [dispatch]);




  if (isLoading) {
    return 
  }

  if (isError) {
    return <div>Failed to load chart data: {"Unknown error"}</div>;
  }

  // Reverse the data so recent dates appear on the right
  const chartData = (data || []).slice().reverse();

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
