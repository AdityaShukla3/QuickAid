import { useState, useEffect } from "react";
import { socket } from "../services/socket";
import AlertCard from "../components/AlertCard";

export default function ResponderDashboard() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on("alert-broadcast", (data) => {
      setAlerts(prev => [data, ...prev]);
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🚑 Live Alerts</h2>
      {alerts.map((a, idx) => (
        <AlertCard key={idx} alert={a} />
      ))}
    </div>
  );
}
