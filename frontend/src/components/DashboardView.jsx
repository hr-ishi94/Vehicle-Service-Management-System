import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRevenueGraph } from "../axios/OperationsServer"; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DashboardView = () => {
  const dispatch = useDispatch();
  const { graph, loading, error } = useSelector((state) => state.revenues);

  useEffect(() => {
    dispatch(fetchRevenueGraph());
  }, [dispatch]);

  if (loading) return <p className="text-gray-300">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 sm:ml-64 bg-zinc-900 border-l-2 border-zinc-800 h-full py-10 px-10">
      <div className="flex text-gray-300 justify-between px-1 my-16">
        <h1 className="uppercase font-bold text-lg">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 rounded-xl border-zinc-800 p-4 bg-zinc-800">
          <h2 className="text-gray-300 font-semibold mb-2">Daily Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={graph.daily_trend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border-2 rounded-xl border-zinc-800 p-4 bg-zinc-800">
          <h2 className="text-gray-300 font-semibold mb-2">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={graph.monthly_trend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={(tick) => new Date(tick).toLocaleString('default', { month: 'short' })} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border-2 rounded-xl border-zinc-800 p-4 bg-zinc-800">
          <h2 className="text-gray-300 font-semibold mb-2">Yearly Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={graph.yearly_trend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tickFormatter={(tick) => new Date(tick).getFullYear()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
