import KPIAnalytics from "./components/KPI";
// import PieChartDemo from "./components/Pie";
import Chart from "./components/Chart";

const HomePage = () => {
  return (
    <div className="w-full flex flex-col gap-6 p-6 pt-0">
      {/* KPI and Pie Chart */}
      <div className="flex flex-wrap gap-6 justify-between">
        <div className="w-full lg:w-8/10">
          <KPIAnalytics />
          
      <Chart />
      </div>
    </div>
    </div>
  );
};

export default HomePage;
