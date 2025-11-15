export default function AlertCard({ alert }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-xl border border-gray-200 mb-4">
      <h2 className="text-lg font-semibold text-red-600">
        🚨 {alert.type.toUpperCase()}
      </h2>
      <p className="text-gray-700">Severity: {alert.severity}</p>
      <p className="text-gray-500 text-sm">
        Location: {alert.location.lat}, {alert.location.lng}
      </p>
    </div>
  );
}
