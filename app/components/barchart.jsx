import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { useQuery } from "@tanstack/react-query";

const getOrders = async () => {
  try {
    const res = await fetch(`/api/orders`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed loading Orders");
    }

    const data = await res.json();
    return data.orders; // Return the orders array
  } catch (error) {
    console.log("error Loading Orders", error);
  }
};

export default function BarChart() {
  const [chartData, setChartData] = useState({
    labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales ₵",
        data: [0, 0, 0, 28.5, 110, 0, 0],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgb(53, 162, 235, 0.4)",
      },
    ],
  });

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  useEffect(() => {
    if (ordersData) {
      // Map all orders to a new constant
      const allOrders = ordersData?.map((order) => ({
        name: order.name,
        id: order._id,
        total_amount: order.total_amount,
        date: new Date(order.date), // Convert date to a Date object
      }));

      // Create an array to store daily totals, initialized with zeros for each day of the week
      const dailyTotals = [0, 0, 0, 0, 0, 0, 0]; // Mon to Sun

      // Calculate daily totals
      allOrders.forEach((order) => {
        const orderDate = new Date(order.date);
        const dayOfWeek = orderDate.getDay(); // 0 (Sun) to 6 (Sat)
        const orderTotal = parseFloat(order.total_amount); // Assuming it's a string

        // Add the order total to the corresponding day of the week
        dailyTotals[dayOfWeek] += orderTotal;
      });

      // Now, update your chart data with the calculated daily totals
      setChartData((prevData) => {
        const newData = { ...prevData };
        newData.datasets[0].data = dailyTotals;
        console.log(chartData);
        return newData;
      });
    }
  }, [ordersData]);

  const [chartOptions, setChartOptions] = useState({
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Daily Revenue",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  });

  return (
    <>
      <div className="w-full md:col-span-2 relative  lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
}
