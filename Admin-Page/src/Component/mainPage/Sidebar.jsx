import { NavLink } from "react-router-dom";
import "../../App.css"
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  BarChart3,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Vendor Verification", icon: ShieldCheck, path: "/verification" },
    { name: "Users", icon: Users, path: "/users" },
    { name: "Vendors", icon: Store, path: "/vendors" },
    { name: "Orders", icon: ShoppingBag, path: "/orders" },
    { name: "Payments", icon: DollarSign, path: "/payments" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
  ];

  return (
    <div className="w-[216px] h-screen bg-white border-r flex flex-col">
      
      {/* Top Section */}
      <div className="px-4 py-6 border-b">
        <h1 className="text-lg font-semibold">Admin Portal</h1>
        <p className="text-sm text-gray-500">Admin</p>

        <div className="mt-4 bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm font-medium w-fit">
          Super Admin
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col mt-4 gap-2 px-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            
              <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition 
                ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              } 
            >
              <Icon size={24} />
              {item.name}
            </NavLink>
            
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;