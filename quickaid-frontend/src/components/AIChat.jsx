import { useState } from "react";
import { api } from "../services/api";

export default function AIChat() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");

  const askAI = async () => {
    const res = await api.post("/ai/firstaid", { emergency: text });
    setReply(res.data.guide);
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl mt-6">
      <input
        className="border border-gray-300 w-full p-2 rounded-md mb-3"
        placeholder="Enter emergency (burn, fracture...)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={askAI}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Ask AI
      </button>

      <p className="mt-3 text-gray-700">{reply}</p>
    </div>
  );
}
