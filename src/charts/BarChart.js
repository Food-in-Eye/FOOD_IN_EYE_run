import ReactApexChart from "react-apexcharts";
import dailyReport from "../data/daily_report.json";

function BarChart() {
  const hourlySaleInfo = dailyReport["Store 1"].sale_summary.hourly_sale_info;
  const timeLabels = hourlySaleInfo.map((hourData, index) => `${index}시`);
  const orderCounts = hourlySaleInfo.map((hourData) => hourData.order);

  const options = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: timeLabels,
    },
    yaxis: {
      title: {
        text: "주문량(단위: 건)",
      },
    },
  };

  const series = [
    {
      name: "주문량",
      data: orderCounts,
    },
  ];

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        width={1200}
        height={400}
      />
    </div>
  );
}

export default BarChart;
