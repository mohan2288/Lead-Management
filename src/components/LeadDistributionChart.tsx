import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Card } from "antd";
import { toast } from "react-toastify";
import { Distribution } from "../services/DashboardService";

interface ApiData {
  stage_name: string;
  percentage: number;
}

const LeadDistributionChart = () => {

  const [series, setSeries] = useState<number[]>([]);

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: "pie",
      width: 380
    },
    labels: [],
    title: {
      text: "Lead Distribution"
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Distribution();

        const apiData: ApiData[] = response.data;

        const labels = apiData.map((item) => item.stage_name);
        const percentages = apiData.map((item) => item.percentage);

        setSeries(percentages);

        setOptions((prev) => ({
          ...prev,
          labels: labels
        }));

      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Chart data not fetched");
      }
    };

    fetchData();
  }, []);

  return (
    <Card id="chart" style={{width:"40%"}} className="distribution-card max-sm:w-full!">
      <ReactApexChart options={options} 
      series={series} type="pie" width={380}/>
    </Card>
  );
};

export default LeadDistributionChart;