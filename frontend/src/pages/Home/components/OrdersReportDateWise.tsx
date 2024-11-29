/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGetAllOrdersQuery } from "../../../provider/queries/Orders.query";
import { Calendar } from "primereact/calendar";
import Loader from "../../../components/Loader";
import { Dialog } from "primereact/dialog";

const OrdersReportDateWise = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);


  const { data, isLoading, isError } = useGetAllOrdersQuery({
    query: "",
    page: currentPage,
    startDate: startDate ? startDate.toISOString() : null,
    endDate: endDate ? endDate.toISOString() : null,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Failed to fetch orders. Please try again later.</div>;
  }

  const filteredOrders = data?.data.filter((order: any) => {
    const orderDate = new Date(order.orderDate || order.createdAt);
    return (
      (!startDate || orderDate >= startDate) && 
      (!endDate || orderDate <= endDate)
    );
  });

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setDialogVisible(true);
  };

  const handleNextPage = () => {
    if (data?.hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">Orders Report Date Wise</h2>
      <div className="flex space-x-4">
        <Calendar
          value={startDate}
          onChange={(e) => setStartDate(e.value)}
          placeholder=" Start Date"
          dateFormat="dd/mm/yy"
          className="border-2 border-gray-200 rounded-lg outline-none h-[50px]"
        />
        <Calendar
          value={endDate}
          onChange={(e) => setEndDate(e.value)}
          placeholder=" End Date"
          dateFormat="dd/mm/yy"
          className="border-2 border-gray-200 rounded-lg outline-none"
        />
        <button onClick={handleReset} className="bg-gray-300 px-4 py-2 rounded-lg">
          Reset
        </button>
      </div>
      <ul className="space-y-2">
        {filteredOrders?.map((order: any) => (
          <li
            key={order._id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg hover:bg-gray-300 hover:cursor-pointer"
            onClick={() => handleOrderClick(order)}
          >
            <span className="text-lg">{order.consumer.name}</span>
            <span className="text-sm">
              {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`bg-gray-300 px-4 py-2 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={!data?.hasMore}
          className={`bg-gray-300 px-4 py-2 rounded ${!data?.hasMore ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>

      {selectedOrder && (
        <Dialog
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          header="Order Details"
          className="w-2/3 lg:w-1/4"
        >
          <div>
            <h3 className="text-lg font-semibold">Total Amount: &#8377;{selectedOrder.items.reduce((total: number, item: any) => total + (item.quantity * item.productId.price), 0)}</h3>
            <ul className="mt-4 space-y-2">
              {selectedOrder.items.map((item: any, index: number) => (
                <li key={index} className="flex justify-between">
                  <span>{index + 1}.</span>
                  <span>{item.productId.name}</span>
                  <span>Quantity:{item.quantity}</span>
                  <span>Price: &#8377;{item.productId.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default OrdersReportDateWise;