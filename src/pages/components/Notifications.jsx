export default function Notification({ message, type }) {
  return (
    <div className={`fixed top-1/3 left-1/2 -translate-x-1/2 p-4 rounded shadow ${
      type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`}>
      {message}
    </div>
  );
}

