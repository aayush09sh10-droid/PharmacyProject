import { Routes, Route } from "react-router-dom";
import Sidebar from "./Component/mainPage/Sidebar";

function App() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <Routes>
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/users" element={<h1>Users</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;