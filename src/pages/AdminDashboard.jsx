import { useState, useMemo } from "react";
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

export default function AdminDashboard() {
  // Sample complaints data
  const [complaints, setComplaints] = useState([
    { id: "#12345", citizen: "Sneha", category: "Road Repair", status: "Pending" },
    { id: "#12346", citizen: "Rahul", category: "Water Leak", status: "Resolved" },
    { id: "#12347", citizen: "Amit", category: "Streetlight", status: "In Review" },
  ]);

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setComplaints(updated);
    // TODO: call backend API to persist
  };

  // Summary metrics
  const totalComplaints = complaints.length;
  const pendingSLA = complaints.filter((c) => c.status !== "Resolved").length;
  const urgentIssues = complaints.filter(
    (c) => c.category === "Road Repair" && c.status === "Pending"
  ).length;

  // Bar chart: Complaints by category
  const categories = [...new Set(complaints.map((c) => c.category))];
  const categoryCounts = categories.map(
    (cat) => complaints.filter((c) => c.category === cat).length
  );
  const barData = { labels: categories, datasets: [{ label: "Complaints", data: categoryCounts, backgroundColor: "#2F6FA5" }] };

  // Line chart: SLA Compliance dynamically
  const days = ["Day1", "Day2", "Day3", "Day4", "Day5"];
  const lineData = useMemo(() => {
    const data = [];
    for (let i = 0; i < days.length; i++) {
      const complaintsTillDay = complaints.slice(0, i + 1);
      if (complaintsTillDay.length === 0) {
        data.push(0);
      } else {
        const resolved = complaintsTillDay.filter((c) => c.status === "Resolved").length;
        data.push(Math.round((resolved / complaintsTillDay.length) * 100));
      }
    }
    return { labels: days, datasets: [{ label: "SLA Compliance (%)", data, borderColor: "#2F6FA5", backgroundColor: "#2F6FA5", fill: false }] };
  }, [complaints]);

  return (
    <div style={{ backgroundColor: "#79A9C7", minHeight: "100vh", padding: "30px", fontFamily: "Arial" }}>
      {/* Main Heading */}
      <h1 style={{ color: "#2F6FA5", textAlign: "center", marginBottom: "30px" }}>ADMIN DASHBOARD</h1>

      {/* Summary Metrics */}
      <h2 style={{ color: "#2F6FA5", marginBottom: "15px" }}>SUMMARY METRICS</h2>
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "10px", flex: 1, textAlign: "center" }}>
          <p style={{ color: "black", fontWeight: "bold" }}>Total Complaints</p>
          <p style={{ fontSize: "24px", color: "black" }}>{totalComplaints}</p>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "10px", flex: 1, textAlign: "center" }}>
          <p style={{ color: "black", fontWeight: "bold" }}>Pending SLA</p>
          <p style={{ fontSize: "24px", color: "black" }}>{pendingSLA}</p>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "10px", flex: 1, textAlign: "center" }}>
          <p style={{ color: "black", fontWeight: "bold" }}>Urgent Issues</p>
          <p style={{ fontSize: "24px", color: "black" }}>{urgentIssues}</p>
        </div>
      </div>

      {/* Complaints Table */}
      <h2 style={{ color: "#2F6FA5", marginBottom: "15px" }}>COMPLAINTS TABLE</h2>
      <div style={{ background: "white", borderRadius: "10px", padding: "15px", marginBottom: "30px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px", color: "black" }}>Complaint ID</th>
              <th style={{ textAlign: "left", padding: "10px", color: "black" }}>Citizen</th>
              <th style={{ textAlign: "left", padding: "10px", color: "black" }}>Category</th>
              <th style={{ textAlign: "left", padding: "10px", color: "black" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: "10px", color: "black" }}>{c.id}</td>
                <td style={{ padding: "10px", color: "black" }}>{c.citizen}</td>
                <td style={{ padding: "10px", color: "black" }}>{c.category}</td>
                <td style={{ padding: "10px" }}>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    style={{ padding: "5px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analytics / Charts */}
      <h2 style={{ color: "#2F6FA5", marginBottom: "15px" }}>ANALYTICS / CHARTS</h2>
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "10px", flex: 1, minWidth: "300px" }}>
          <h3 style={{ color: "#2F6FA5" }}>Complaints by Category</h3>
          <Bar data={barData} />
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "10px", flex: 1, minWidth: "300px" }}>
          <h3 style={{ color: "#2F6FA5" }}>SLA Compliance Over Time</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}