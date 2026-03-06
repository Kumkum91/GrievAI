import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PublicDashboard() {
  // States for dynamic data
  const [stats, setStats] = useState([]);
  const [months, setMonths] = useState([]);
  const [trendValues, setTrendValues] = useState([]);
  const [markers, setMarkers] = useState([]);

  // Fetch data from backend APIs
  useEffect(() => {
    // Complaint stats
    fetch("/api/public/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => console.log("Failed to fetch stats"));

    // Complaint trends
    fetch("/api/public/trends")
      .then((res) => res.json())
      .then((data) => {
        setMonths(data.months);
        setTrendValues(data.counts);
      })
      .catch(() => console.log("Failed to fetch trends"));

    // Map markers
    fetch("/api/public/markers")
      .then((res) => res.json())
      .then((data) => setMarkers(data))
      .catch(() => console.log("Failed to fetch markers"));
  }, []);

  // Calculate summary metrics dynamically
  const totalComplaints = stats.reduce((acc, s) => acc + s.total, 0);
  const resolvedComplaints = stats.reduce((acc, s) => acc + s.resolved, 0);
  const pendingComplaints = totalComplaints - resolvedComplaints;

  // Bar chart data
  const barData = {
    labels: stats.map((s) => s.department),
    datasets: [
      { label: "Total Complaints", data: stats.map((s) => s.total), backgroundColor: "#8E6BBF" },
      { label: "Resolved", data: stats.map((s) => s.resolved), backgroundColor: "#4B2E75" },
    ],
  };

  // Line chart data
  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Complaints Trend",
        data: trendValues,
        borderColor: "#8E6BBF",
        backgroundColor: "#8E6BBF",
        fill: false,
      },
    ],
  };

  return (
    <div
      className="public-dashboard"
      style={{
        backgroundColor: "#C7B7D9",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      {/* Header - plain text */}
      <h1
        style={{
          color: "#4B2E75", // dark purple
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        PUBLIC TRANSPARENCY DASHBOARD
      </h1>

      {/* Summary Metrics */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {/* Total Complaints */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "150px",
            textAlign: "center",
            flex: 1,
          }}
        >
          <p style={{ color: "black", fontWeight: "bold" }}>Total Complaints</p>
          <p style={{ fontSize: "24px", color: "black" }}>{totalComplaints}</p>
        </div>

        {/* Resolved */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "150px",
            textAlign: "center",
            flex: 1,
          }}
        >
          <p style={{ color: "black", fontWeight: "bold" }}>Resolved</p>
          <p style={{ fontSize: "24px", color: "black" }}>{resolvedComplaints}</p>
        </div>

        {/* Pending */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "150px",
            textAlign: "center",
            flex: 1,
          }}
        >
          <p style={{ color: "black", fontWeight: "bold" }}>Pending</p>
          <p style={{ fontSize: "24px", color: "black" }}>{pendingComplaints}</p>
        </div>
      </div>

      {/* Complaint Stats Table */}
      <h2 style={{ color: "#4B2E75", marginTop: "30px", marginBottom: "15px" }}>COMPLAINT STATS</h2>
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px", color: "black" }}>Department</th>
              <th style={{ textAlign: "left", padding: "10px", color: "black" }}>Total Complaints</th>
              <th style={{ textAlign: "left", padding: "10px", color: "black" }}>Resolved</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", color: "black" }}>{s.department}</td>
                <td style={{ padding: "10px", color: "black" }}>{s.total}</td>
                <td style={{ padding: "10px", color: "black" }}>{s.resolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Geo Heatmap */}
      <h2 style={{ color: "#4B2E75", marginBottom: "15px" }}>GEO HEATMAP</h2>
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "30px",
          height: "400px",
        }}
      >
        <MapContainer center={[25.4358, 81.8463]} zoom={13} style={{ height: "100%" }}>
          <TileLayer attribution='© OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((m, index) => (
            <CircleMarker
              key={index}
              center={[m.lat, m.lng]}
              radius={Math.min(Math.sqrt(m.count) / 2, 25)}
              fillColor={m.count > 300 ? "red" : m.count > 100 ? "yellow" : "green"}
              color={m.count > 300 ? "red" : m.count > 100 ? "yellow" : "green"}
            >
              <Popup>{`Location: (${m.lat.toFixed(3)}, ${m.lng.toFixed(3)}), Complaints: ${m.count}`}</Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Trends / Insights */}
      <h2 style={{ color: "#4B2E75", marginBottom: "15px" }}>TRENDS / INSIGHTS</h2>
      <div
        style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            flex: 1,
            minWidth: "300px",
          }}
        >
          <h3 style={{ color: "#4B2E75" }}>Complaints by Department</h3>
          <Bar data={barData} />
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            flex: 1,
            minWidth: "300px",
          }}
        >
          <h3 style={{ color: "#4B2E75" }}>Complaint Trend Over Months</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}