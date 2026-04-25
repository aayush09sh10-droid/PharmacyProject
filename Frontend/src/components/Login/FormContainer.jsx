export default function FormContainer({ children }) {
  return (
    <div className="mt-8 w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:mt-12 sm:p-10">
      {children}
    </div>
  );
}
