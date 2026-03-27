export default function SubmitButton({ text }) {
  return (
    <button className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 text-white font-semibold py-3 rounded-xl mt-4 shadow-md hover:shadow-lg transition">
      {text}
    </button>
  );
}