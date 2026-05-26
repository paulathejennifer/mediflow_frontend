'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from './useNotifications';

const NotificationContext = createContext<ReturnType<typeof useNotifications> | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const notificationsValue = useNotifications();
  
  return (
    <NotificationContext.Provider value={notificationsValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};