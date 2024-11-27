import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { useDashboardDataQuery } from "../../../provider/queries/Users.query";
import { useGetAllProductsQuery } from "../../../provider/queries/Products.query";
import { useGetAllOrdersQuery } from "../../../provider/queries/Orders.query";
import Loader from "../../../components/Loader";

export default function PieChartDemo() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const { data, isError, isLoading, isFetching } = useDashboardDataQuery({});
  const { data: productsData, isLoading: isProductsLoading } = useGetAllProductsQuery({
    query: "",
    page: 1,
  });
  const { data: ordersData, isLoading: isOrdersLoading } = useGetAllOrdersQuery({
    query: "",
    page: 1,
  });

  useEffect(() => {
    if (!ordersData || !productsData) {
      return;
    }

    // Calculate insights
    const productFrequency = {};
    const consumerFrequency = {};
    const lowStockCount = productsData.data.filter(
      (product) => product.stock <= product.lowStockThreshold
    ).length;

    ordersData.data.forEach((order) => {
      // Count product frequency
      order.items.forEach((item) => {
        const productName = item.productId.name;
        productFrequency[productName] = (productFrequency[productName] || 0) + item.quantity;
      });

      // Count consumer frequency
      const consumerName = order.consumer.name;
      consumerFrequency[consumerName] = (consumerFrequency[consumerName] || 0) + 1;
    });

    // Most frequent consumer
    const mostFrequentConsumer = Object.entries(consumerFrequency).reduce(
      (max, current) => (current[1] > max[1] ? current : max),
      ["No consumer", 0]
    );

    // Most sold product
    const mostSoldProduct = Object.entries(productFrequency).reduce(
      (max, current) => (current[1] > max[1] ? current : max),
      ["No product", 0]
    );

    // Chart data
    const documentStyle = getComputedStyle(document.documentElement);
    const chartData = {
      labels: ["Low Stock Products", "Orders", "Most Sold Product", "Frequent Consumer"],
      datasets: [
        {
          data: [
            lowStockCount,
            ordersData.data.length,
            mostSoldProduct[1],
            mostFrequentConsumer[1],
          ],
          backgroundColor: [
            documentStyle.getPropertyValue("--red-500"),
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--yellow-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--yellow-400"),
          ],
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: documentStyle.getPropertyValue("--text-color"),
          },
        },
      },
    };

    setChartData(chartData);
    setChartOptions(options);
  }, [ordersData, productsData]);

  if (isFetching || isLoading || isOrdersLoading || isProductsLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Something went wrong.</div>;
  }

  return <Chart type="pie" data={chartData} options={chartOptions} className="w-full lg:w-1/4" />;
}
