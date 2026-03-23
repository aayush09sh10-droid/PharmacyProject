import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./Component/mainPage/Sidebar";
import Dashboard from "./Component/Dashboard/Dashboard";

const PlaceholderPage = ({ title }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
    <p className="mt-2 text-sm text-slate-500">
      This section is ready for the next component to be connected.
    </p>
  </div>
);

function App() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verification" element={<PlaceholderPage title="Vendor Verification" />} />
          <Route path="/users" element={<PlaceholderPage title="Users" />} />
          <Route path="/vendors" element={<PlaceholderPage title="Vendors" />} />
          <Route path="/orders" element={<PlaceholderPage title="Orders" />} />
          <Route path="/payments" element={<PlaceholderPage title="Payments" />} />
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
