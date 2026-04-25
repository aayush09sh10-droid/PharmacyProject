export default function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-6 text-center">
      <div className="mb-4 flex justify-center">
        <img src={icon} alt={title} className="h-14 w-14 rounded-2xl shadow-sm sm:h-16 sm:w-16" />
      </div>

      <h1 className="text-2xl font-bold text-green-700 sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-gray-500 sm:text-base">{subtitle}</p>
    </div>
  );
}
