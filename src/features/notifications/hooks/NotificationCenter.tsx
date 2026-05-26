import React, { useState } from 'react';
import { useNotificationContext } from './NotificationProvider';
import { Notification } from './useNotifications';

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    isConnected, 
    unreadCount, 
    markAsRead, 
    deleteNotification,
    stats,
    markAllAsRead,
    handleAction,
    isLoading
  } = useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) markAsRead(notification.id);
    if (notification.details.referral_id) {
      window.location.href = `/referrals/${notification.details.referral_id}`;
    }
  };

  return (
    <div className="relative">
      <button
        className={`relative p-2 rounded-full transition-colors hover:bg-gray-100 ${isConnected ? 'text-blue-600' : 'text-gray-400'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Notifications ({stats.total})</h3>
            <div className="flex items-center gap-2">
              {stats.unread > 0 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                  className="text-[10px] text-blue-600 hover:underline"
                >
                  Mark all as read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
          </div>

          {stats.total > 0 && (
            <div className="flex gap-2 px-4 py-2 border-b bg-gray-50/50 text-[10px]">
              {stats.critical > 0 && <span className="text-red-600 font-medium">🚨 {stats.critical} Critical</span>}
              {stats.warning > 0 && <span className="text-orange-600 font-medium">⚠️ {stats.warning} Warnings</span>}
              {stats.info > 0 && <span className="text-blue-600 font-medium">ℹ️ {stats.info} Info</span>}
            </div>
          )}

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="py-10 text-center text-sm text-gray-500 animate-pulse italic">Syncing notifications...</div>
            ) : notifications.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`flex gap-3 border-b p-4 cursor-pointer hover:bg-gray-50 transition-colors ${notification.is_read ? 'opacity-60' : 'bg-blue-50/30'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">{notification.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {notification.actions.map((action, idx) => (
                        <button 
                          key={idx} 
                          className="rounded bg-gray-100 px-2 py-1 text-[10px] font-medium hover:bg-gray-200" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleAction(notification.id, action); 
                          }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                    <small className="mt-1 block text-[10px] text-gray-400">
                      {notification.backend_source} • {new Date(notification.created_at).toLocaleString()}
                    </small>
                  </div>
                  <button
                    className="text-gray-300 hover:text-red-500"
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="bg-gray-50 px-4 py-2">
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isConnected ? 'Live updates active' : 'Disconnected'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};