/**
 * Notification Center Component
 * 
 * Main notification center component with filtering, search, and real-time updates.
 * Displays notifications with different views and provides comprehensive notification management.
 */

import { useState, useMemo } from 'react';
import { useMockNotifications } from '@/hooks/useMockNotifications';
import { NotificationCard } from './notification-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-simple';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-simple';
import { 
  Bell, 
  BellOff, 
  CheckCircle, 
  RefreshCw, 
  Search,
  Filter,
  X,
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const {
    notifications,
    stats,
    isConnected,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    handleAction,
    refreshNotifications,
    filters,
    setFilters
  } = useMockNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNotifications, setExpandedNotifications] = useState<Set<number>>(new Set());

  // Filter notifications based on search term
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        notification.backend_source.toLowerCase().includes(searchLower)
      );
    });
  }, [notifications, searchTerm]);

  // Group notifications by type
  const notificationsByType = useMemo(() => {
    return {
      all: filteredNotifications,
      critical: filteredNotifications.filter(n => n.type === 'critical'),
      warning: filteredNotifications.filter(n => n.type === 'warning'),
      info: filteredNotifications.filter(n => n.type === 'info')
    };
  }, [filteredNotifications]);

  // Toggle notification expansion
  const toggleExpand = (notificationId: number) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTabCount = (type: string) => {
    switch (type) {
      case 'critical':
        return stats.critical;
      case 'warning':
        return stats.warning;
      case 'info':
        return stats.info;
      default:
        return stats.total;
    }
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <XCircle className="h-5 w-5" />
            <div>
              <h3 className="font-medium">Notification Error</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button 
            onClick={refreshNotifications} 
            variant="outline" 
            size="sm" 
            className="mt-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <Card className="mb-4 bg-gray-900 border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-foreground" />
                <CardTitle className="text-lg text-white">Notifications</CardTitle>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  isConnected ? 'bg-primary' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-400">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {stats.unread > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="border-gray-700 text-primary hover:bg-gray-800 hover:text-foreground"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshNotifications}
                disabled={isLoading}
                className="border-gray-700 text-primary hover:bg-gray-800 hover:text-foreground"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Stats */}
        <CardContent className="pt-2">
          <div className="flex gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Total:</span>
              <Badge variant="secondary">{stats.total}</Badge>
            </div>
            {stats.unread > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Unread:</span>
                <Badge variant="default">{stats.unread}</Badge>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Critical:</span>
              <Badge variant="destructive">{stats.critical}</Badge>
            </div>
          </div>
        </CardContent>

        <CardContent className="pt-2">
          {/* Search and Filters */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ type: value as any })}
            >
              <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700 text-white">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue>{filters.type}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={filters.unreadOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters({ unreadOnly: !filters.unreadOnly })}
              className={filters.unreadOnly ? "" : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-foreground"}
            >
              {filters.unreadOnly ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
              Unread Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800 text-gray-400">
          {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
            <TabsTrigger key={type} value={type} className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              {getTabIcon(type)}
              <span className="capitalize">{type}</span>
              {getTabCount(type) > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {getTabCount(type)}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            {notificationsByType[type].length === 0 ? (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="font-medium mb-1 text-white">No {type === 'all' ? '' : type} notifications</h3>
                  <p className="text-sm text-gray-400">
                    {type === 'all' 
                      ? "You're all caught up! No notifications to display."
                      : `No ${type} notifications at this time.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div>
                {notificationsByType[type].map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onAction={handleAction}
                    isExpanded={expandedNotifications.has(notification.id)}
                    onToggleExpand={() => toggleExpand(notification.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
          </Tabs>

    </div>
  );
}
