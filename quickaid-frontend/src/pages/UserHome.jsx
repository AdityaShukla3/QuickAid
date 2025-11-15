import SOSButton from "../components/SOSButton";

export default function UserHome() {
  return (
    <div className="flex flex-col items-center mt-10">
      <SOSButton onClick={() => alert("SOS Sent")} />
    </div>
  );
}
