import { useState, useEffect } from "react";
import VoiceRecorder from "../components/VoiceRecorder";
import ComplaintMap from "../components/ComplaintMap";
import "../App.css";

export default function CitizenPortal() {
  const [location, setLocation] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [complaintText, setComplaintText] = useState("");
  const [language, setLanguage] = useState("en-US"); // default English

  // Get user GPS location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location error:", error);
      }
    );
  }, []);

  // Submit complaint → add marker
  const handleSubmitComplaint = () => {
    if (!location) {
      alert("Location not available! Please wait a moment...");
      return;
    }
    if (!complaintText) {
      alert("Please record a complaint first!");
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    const newComplaint = {
      id: Date.now(),
      lat: location.lat,
      lng: location.lng,
      text: complaintText,
      timestamp,
      language, // include language
    };

    setComplaints([...complaints, newComplaint]);
    setComplaintText(""); // reset text after submit
  };

  return (
    <div className="portal-container">
      <h1 className="portal-title">Citizen Complaint Portal</h1>

      <div className="portal-content">
        {/* MAP */}
        <div className="map-section">
          <ComplaintMap complaints={complaints} location={location} />
        </div>

        {/* COMPLAINT BOX */}
        <div className="complaint-box">
          <p>Press & Speak your complaint</p>

          {/* Language selector */}
          <label>Select Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ marginBottom: "10px" }}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="te-IN">Telugu</option>
          </select>

          {/* Voice recorder */}
          <VoiceRecorder
            setComplaintText={setComplaintText}
            language={language}
          />

          {/* Text preview */}
          <p style={{ marginTop: "10px", fontStyle: "italic", color: "#000" }}>
            {complaintText || "No recording yet"}
          </p>

          {/* Submit button */}
          <button className="submit-btn" onClick={handleSubmitComplaint}>
            Submit Complaint
          </button>
        </div>
      </div>
    </div>
  );
}