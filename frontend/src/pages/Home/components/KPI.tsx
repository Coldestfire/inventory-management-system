import { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../../provider/queries/Orders.query";
import { useGetAllProductsQuery } from "../../../provider/queries/Products.query";
import { Loader } from "lucide-react";
import { useDashboardDataQuery } from "../../../provider/queries/Users.query"; // Assuming this query exists

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  user?: string;  // Marked as optional since it might be missing in some cases
}

const KPIs = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalConsumers, setTotalConsumers] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  // Fetch all dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading, isError: isDashboardError } = useDashboardDataQuery({
    query: "",
    page: 1,
  });

  console.log("Dashboard Data: ", dashboardData);
  
  // Fetch all products
  const { data: productsData, isLoading: isProductsLoading, isError: isProductsError } = useGetAllProductsQuery({
    query: "",
    page: 1,
  });

  useEffect(() => {
    if (dashboardData) {
      // Update the KPI states with the fetched dashboard data
      setTotalSales(dashboardData.sell);
      setTotalConsumers(dashboardData.consumers);
      // Assuming totalRevenue is derived or fetched from another source, setting it as 0 for now
      setTotalRevenue(0);
    }

    if (productsData?.data) {
      // Collect products that are under the low stock threshold
      const lowStockItems = productsData.data.filter((product) => product.stock <= product.lowStockThreshold);

      // Log each product's stock
      productsData.data.forEach((product) => {
        console.log(`Product: ${product.name}, Stock: ${product.stock}`);
      });

      // Update the state for low stock products
      setLowStockProducts(lowStockItems);
    }
  }, [dashboardData, productsData]);

  if (isDashboardLoading || isProductsLoading) {
    return <Loader />;
  }

  if (isDashboardError || isProductsError) {
    return <div>Failed to fetch KPI data. Please try again later.</div>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg space-y-6">
      {/* Total Sales */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Total Sales</h2>
        <p className="text-lg font-bold">{totalSales}</p>
      </div>

      {/* Total Revenue */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Total Revenue</h2>
        <p className="text-lg font-bold">&#8377; {totalRevenue.toFixed(2)}</p>
      </div>

      {/* Total Consumers */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Total Consumers</h2>
        <p className="text-lg font-bold">{totalConsumers}</p>
      </div>

      {/* Low Stock Products */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Low Stock Products:</h2>
        {lowStockProducts.length > 0 ? (
          <ul className="space-y-2">
            {lowStockProducts.map((product) => (
              <li key={product._id} className="flex justify-between items-center bg-red-100 p-3 rounded-lg">
                <span className="text-lg">{product.name}:</span>
                <span className="text-sm text-red-700">
                  Stock: {product.stock}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">All products are sufficiently stocked.</p>
        )}
      </div>
    </div>
  );
};

export default KPIs;
