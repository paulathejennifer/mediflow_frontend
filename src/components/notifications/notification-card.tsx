/**
 * Notification Card Component
 * 
 * Displays individual notifications with actions and status indicators.
 * Supports different notification types with appropriate styling and icons.
 */

import { useState } from 'react';
import { Notification } from '@/features/notifications/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Phone,
  FileText,
  RefreshCw,
  Settings,
  Activity,
  Users,
  Database,
  HardDrive
} from 'lucide-react';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => Promise<void>;
  onAction: (id: number, action: string) => Promise<any>;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onAction,
  isExpanded = false,
  onToggleExpand
}: NotificationCardProps) {
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(isExpanded);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'relative border border-border bg-gray-900 rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] hover:-translate-y-1 overflow-hidden';
      case 'warning':
        return 'border border-border bg-gray-900 rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] hover:-translate-y-1';
      case 'info':
        return 'border border-border bg-gray-900 rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] hover:-translate-y-1';
      default:
        return 'border border-border bg-gray-900 rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] hover:-translate-y-1';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-900 text-red-200 border-red-700';
      case 'warning':
        return 'bg-yellow-900 text-yellow-200 border-yellow-700';
      case 'info':
        return 'bg-blue-900 text-blue-200 border-blue-700';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Accept') || action.includes('Approve')) {
      return <CheckCircle className="h-4 w-4" />;
    }
    if (action.includes('Call') || action.includes('Contact')) {
      return <Phone className="h-4 w-4" />;
    }
    if (action.includes('View') || action.includes('Review')) {
      return <ExternalLink className="h-4 w-4" />;
    }
    if (action.includes('File') || action.includes('Report')) {
      return <FileText className="h-4 w-4" />;
    }
    if (action.includes('Restart') || action.includes('Refresh')) {
      return <RefreshCw className="h-4 w-4" />;
    }
    if (action.includes('Settings') || action.includes('Configure')) {
      return <Settings className="h-4 w-4" />;
    }
    if (action.includes('Monitor') || action.includes('Analytics')) {
      return <Activity className="h-4 w-4" />;
    }
    if (action.includes('Team') || action.includes('Staff')) {
      return <Users className="h-4 w-4" />;
    }
    if (action.includes('Database') || action.includes('Storage')) {
      return <Database className="h-4 w-4" />;
    }
    if (action.includes('Cleanup') || action.includes('Storage')) {
      return <HardDrive className="h-4 w-4" />;
    }
    return null;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const isExpired = notification.expires_at && new Date(notification.expires_at) < new Date();

  const handleAction = async (action: string) => {
    setIsActionLoading(action);
    try {
      await onAction(notification.id, action);
      
      if (!notification.is_read) {
        await onMarkAsRead(notification.id);
      }
    } catch (error) {
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleMarkAsRead = async () => {
    if (!notification.is_read) {
      await onMarkAsRead(notification.id);
    }
  };

  return (
    <>
      <style jsx global>{`
  @keyframes neon-flicker {
    0%, 100% {
      opacity: 1;
      box-shadow: 0 0 6px #ef4444, 0 0 12px #ef4444;
      background: #ef4444;
    }

    10% {
      opacity: 0.6;
      box-shadow: none;
      background: #7f1d1d;
    }

    20% {
      opacity: 1;
      box-shadow: 0 0 8px #f87171, 0 0 16px #ef4444;
      background: #f87171;
    }

    35% {
      opacity: 0.4;
      box-shadow: none;
      background: #7f1d1d;
    }

    50% {
      opacity: 1;
      box-shadow: 0 0 10px #ef4444, 0 0 20px #f87171;
      background: #ef4444;
    }

    65% {
      opacity: 0.7;
      box-shadow: none;
      background: #991b1b;
    }

    80% {
      opacity: 1;
      box-shadow: 0 0 12px #ef4444, 0 0 24px #f87171;
      background: #f87171;
    }
  }

  .critical-bar::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 5px;
    height: 100%;
    animation: neon-flicker 1.2s infinite;
    border-radius: 0 4px 4px 0;
  }
`}</style>

      {/* Debug: Check className */}
      {(() => {
        const className = `mb-4 w-full transition-all duration-200 ${getNotificationColor(notification.type)} ${
          notification.is_read ? 'opacity-75' : ''
        } ${isExpired ? 'opacity-50' : ''} ${
          notification.type === 'critical' ? 'critical-bar' : ''
        }`;
        return null;
      })()}
      <Card
        className={`mb-4 w-full transition-all duration-200 ${getNotificationColor(notification.type)} ${
          notification.is_read ? 'opacity-75' : ''
        } ${isExpired ? 'opacity-50' : ''} ${
          notification.type === 'critical' ? 'critical-bar' : ''
        } ${notification.type === 'critical' ? 'critical-bar' : ''}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate text-foreground">
                    {notification.title}
                  </h3>
                  <Badge className={getBadgeColor(notification.type)}>
                    {notification.type}
                  </Badge>
                  {isExpired && (
                    <Badge variant="outline" className="text-xs">
                      Expired
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimestamp(notification.timestamp)}
              </div>
              
              {!notification.is_read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="h-8 w-8 p-0"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {notification.actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(action)}
                  disabled={isActionLoading === action}
                  className="text-xs border-primary text-primary hover:bg-primary hover:text-secondary"
                >
                  {isActionLoading === action ? (
                    <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    getActionIcon(action) && (
                      <span className="mr-1">{getActionIcon(action)}</span>
                    )
                  )}
                  {action}
                </Button>
              ))}
            </div>
          )}

          {notification.details && Object.keys(notification.details).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            className="text-xs p-0 h-auto text-foreground hover:text-secondary hover:bg-transparent"

            >
              {showDetails ? (
                <ChevronUp className="h-3 w-3 mr-1" />
              ) : (
                <ChevronDown className="h-3 w-3 mr-1" />
              )}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          )}

          {showDetails && notification.details && (
            <div className="mt-3 p-3 bg-muted/50 rounded-md">
              <h4 className="text-sm font-medium mb-2 text-foreground">Details</h4>
              <div className="space-y-2">
                {Object.entries(notification.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="font-medium capitalize text-foreground">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-muted-foreground max-w-[200px] truncate">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">Source:</span>
                  <span className="text-muted-foreground">
                    {notification.backend_source}
                  </span>
                </div>
                {notification.roles && (
                  <div className="flex justify-between text-xs mt-1">
                    <span className="font-medium text-foreground">Roles:</span>
                    <span className="text-muted-foreground">
                      {notification.roles.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {notification.action_result && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-md">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                Action Completed
              </h4>
              <p className="text-xs text-green-700 dark:text-green-300">
                {notification.action_result.message || 'Action completed successfully'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}