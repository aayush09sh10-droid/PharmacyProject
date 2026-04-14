import { useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Inventory', icon: Boxes, path: '/inventory' },
    { name: 'Orders', icon: ClipboardList, path: '/orders' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('vendor');
    navigate('/login');
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-gray-900">Vendor Portal</h1>
            <p className="text-xs text-gray-500 mt-1">--</p>
            <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {/* <span>KYC Verified</span> */}
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={toggleSidebar}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span className="font-medium text-sm">Collapse</span>}
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-2"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
