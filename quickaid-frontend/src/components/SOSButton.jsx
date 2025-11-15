export default function SOSButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-4 bg-red-600 text-white text-xl font-bold rounded-xl shadow-lg 
                 hover:bg-red-700 active:scale-95 transition-all"
    >
      🚨 SEND SOS
    </button>
  );
}
