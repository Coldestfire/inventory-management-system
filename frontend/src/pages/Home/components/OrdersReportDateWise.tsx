import { useState } from "react";
import { useGetAllOrdersQuery } from "../../../provider/queries/Orders.query";
import { Calendar } from "primereact/calendar";
import Loader from "../../../components/Loader";

const OrdersReportDateWise = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Pass date filters as ISO strings to the API
  const { data, isLoading, isError } = useGetAllOrdersQuery({
    query: "",
    page: 1,
    startDate: startDate ? startDate.toISOString() : null,
    endDate: endDate ? endDate.toISOString() : null,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Failed to fetch orders. Please try again later.</div>;
  }

  // Safeguard for null data and ensure dates are parsed properly
  const filteredOrders = data?.data.filter((order: any) => {
    const orderDate = new Date(order.orderDate || order.createdAt); // Ensure correct date field
    return (
      (!startDate || orderDate >= startDate) && 
      (!endDate || orderDate <= endDate)
    );
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">Orders Report Date Wise</h2>
      <div className="flex space-x-4">
        <Calendar
          value={startDate}
          onChange={(e) => setStartDate(e.value)}
          placeholder="Start Date"
          dateFormat="dd/mm/yy"
        />
        <Calendar
          value={endDate}
          onChange={(e) => setEndDate(e.value)}
          placeholder="End Date"
          dateFormat="dd/mm/yy"
        />
      </div>
      <ul className="space-y-2">
        {filteredOrders?.map((order: any) => (
          <li
            key={order._id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >
            <span className="text-lg">{order.consumer.name}</span>
            <span className="text-sm">
              {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersReportDateWise;
