import { useEffect, useState } from "react";
import { useGetEveryOrderQuery } from "../../../provider/queries/Orders.query";
import { useGetEveryProductQuery } from "../../../provider/queries/Products.query";
import { useGetMostAppearedQuery } from "../../../provider/queries/Orders.query";
import { Loader } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  user?: string; // Optional since it might be missing in some cases
}

const KPIs = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [mostAppeared, setMostAppeared] = useState({ productName: "", count: 0 });

  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError } =
    useGetEveryOrderQuery({});

  const { data: productsData, isLoading: isProductsLoading, isError: isProductsError } =
    useGetEveryProductQuery({});

  const { data: mostAppearedData, isLoading: isMostAppearedLoading, isError: isMostAppearedError } =
    useGetMostAppearedQuery({});

  useEffect(() => {
    if (productsData?.data) {
      const lowStockItems = productsData.data.filter((product) => product.stock <= product.lowStockThreshold);
      setLowStockProducts(lowStockItems);
    }
  }, [productsData]);

  useEffect(() => {
    if (ordersData?.data) {
      const totalOrders = ordersData.data.reduce(
        (totals, order) => {
          order.items.forEach((item) => {
            totals.sales += item.quantity;
            totals.revenue += item.quantity * item.productId.price;
          });
          return totals;
        },
        { sales: 0, revenue: 0 }
      );

      setTotalSales(totalOrders.sales);
      setTotalRevenue(totalOrders.revenue);
    }
  }, [ordersData]);

  useEffect(() => {
    if (mostAppearedData) {
      setMostAppeared({
        productName: mostAppearedData.productName || "No product",
        count: mostAppearedData.count || 0,
      });
    }
  }, [mostAppearedData]);

  if (isOrdersLoading || isProductsLoading || isMostAppearedLoading) {
    return <Loader />;
  }

  if (isOrdersError || isProductsError || isMostAppearedError) {
    return <div>Failed to fetch KPI data. Please try again later.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-6">
      {/* Total Sales and Revenue */}
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Sales & Revenue</h2>
        <div className="flex justify-between items-center">
          <p className="text-lg">Total Sales:</p>
          <p className="text-lg font-bold">{totalSales}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg">Total Revenue: </p>
          <p className="text-lg font-bold"> &#8377;{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Low Stock Products:</h2>
        {lowStockProducts.length > 0 ? (
          <div className="max-h-32 overflow-y-auto">
            <ul className="space-y-2">
              {lowStockProducts.map((product) => (
                <li
                  key={product._id}
                  className="flex justify-between items-center bg-red-100 p-3 rounded-lg"
                >
                  <span className="text-lg">{product.name}</span>
                  <span className="text-sm text-red-700">Stock: {product.stock}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">All products are sufficiently stocked.</p>
        )}
      </div>

      {/* Most Popular Product */}
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-5">
        <h2 className="text-xl font-semibold text-center">Most Popular Product</h2>
        <div className="flex flex-col items-center">
          <p className="text-2xl font-bold">{mostAppeared.productName}</p>
          <p className="text-2xl font-bold">({mostAppeared.count} times)</p>
        </div>
      </div>
    </div>
  );
};

export default KPIs;
