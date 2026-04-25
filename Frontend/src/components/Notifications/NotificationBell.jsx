import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";

function formatRelativeTime(value) {
  const timestamp = new Date(value).getTime();
  const diffMs = Math.max(Date.now() - timestamp, 0);
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export default function NotificationBell({
  notifications,
  isOpen,
  loading,
  onToggle,
  onMarkRead,
  onMarkAllRead,
  onClose,
  className = "",
  panelClassName = "",
  buttonClassName = "",
}) {
  const containerRef = useRef(null);
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        onClose?.();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className={buttonClassName || "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"}
      >
        <Bell size={20} />
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className={`absolute right-0 z-40 mt-3 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.16)] ${panelClassName}`}>
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">Cross-role updates relevant to you</p>
            </div>
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-[26rem] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-sm text-slate-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500">No notifications yet.</div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => onMarkRead(notification._id)}
                  className={`block w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                    notification.isRead ? "bg-white" : "bg-emerald-50/45"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-semibold text-slate-900">{notification.title}</h4>
                    {!notification.isRead ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" /> : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{formatRelativeTime(notification.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
