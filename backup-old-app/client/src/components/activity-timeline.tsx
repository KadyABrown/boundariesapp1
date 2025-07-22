import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart,
  Flag,
  Shield,
  MessageCircle,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
  Filter,
  Eye,
  EyeOff,
  MoreHorizontal,
  Smile,
  Frown,
  Meh
} from "lucide-react";
import { format, isToday, isYesterday, differenceInDays, startOfDay } from "date-fns";

interface TimelineEvent {
  id: string;
  type: 'boundary' | 'flag' | 'checkin' | 'milestone';
  date: Date;
  title: string;
  description?: string;
  relationshipId?: number;
  relationshipName?: string;
  data: {
    // Boundary events
    boundaryType?: string;
    status?: 'respected' | 'challenged' | 'communicated' | 'violated';
    emotionalRating?: number;
    
    // Flag events
    flagType?: 'green' | 'red';
    flagCategory?: string;
    
    // Check-in events
    safetyRating?: number;
    emotionalTone?: string;
    
    // Milestone events
    milestoneType?: string;
    achievement?: string;
  };
}

interface ActivityTimelineProps {
  events?: TimelineEvent[];
  relationshipFilter?: number | null;
  className?: string;
}

const eventIcons = {
  boundary: Shield,
  flag: Flag,
  checkin: Heart,
  milestone: CheckCircle
};

const eventColors = {
  boundary: {
    respected: 'from-green-500 to-emerald-600',
    challenged: 'from-yellow-500 to-orange-500',
    communicated: 'from-blue-500 to-cyan-500',
    violated: 'from-red-500 to-pink-600'
  },
  flag: {
    green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-pink-600'
  },
  checkin: 'from-purple-500 to-indigo-600',
  milestone: 'from-yellow-500 to-amber-600'
};

const getEventColor = (event: TimelineEvent): string => {
  switch (event.type) {
    case 'boundary':
      return eventColors.boundary[event.data.status as keyof typeof eventColors.boundary] || 'from-gray-500 to-gray-600';
    case 'flag':
      return eventColors.flag[event.data.flagType as keyof typeof eventColors.flag] || 'from-gray-500 to-gray-600';
    case 'checkin':
      return eventColors.checkin;
    case 'milestone':
      return eventColors.milestone;
    default:
      return 'from-gray-500 to-gray-600';
  }
};

const formatEventDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  
  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff <= 7) return `${daysDiff} days ago`;
  
  return format(date, 'MMM d, yyyy');
};

const EventCard = ({ event, isExpanded, onToggleExpand }: {
  event: TimelineEvent;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  const Icon = eventIcons[event.type];
  const eventColor = getEventColor(event);
  
  const renderEventDetails = () => {
    switch (event.type) {
      case 'boundary':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {event.data.boundaryType}
              </Badge>
              <Badge 
                variant={event.data.status === 'respected' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {event.data.status}
              </Badge>
            </div>
            {event.data.emotionalRating && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Emotional Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i <= event.data.emotionalRating! 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'flag':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant={event.data.flagType === 'green' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {event.data.flagType} flag
              </Badge>
              {event.data.flagCategory && (
                <Badge variant="outline" className="text-xs">
                  {event.data.flagCategory}
                </Badge>
              )}
            </div>
          </div>
        );
        
      case 'checkin':
        return (
          <div className="space-y-2">
            {event.data.safetyRating && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Safety:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Heart
                      key={i}
                      size={12}
                      className={`${
                        i <= event.data.safetyRating! 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            {event.data.emotionalTone && (
              <Badge variant="outline" className="text-xs">
                {event.data.emotionalTone}
              </Badge>
            )}
          </div>
        );
        
      case 'milestone':
        return (
          <div className="space-y-2">
            <Badge variant="default" className="text-xs bg-yellow-500">
              {event.data.milestoneType}
            </Badge>
            {event.data.achievement && (
              <p className="text-sm text-muted-foreground">
                {event.data.achievement}
              </p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      className="relative"
    >
      <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${eventColor}`} />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-br ${eventColor}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{event.title}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatEventDate(event.date)}</span>
                  <span>•</span>
                  <span>{format(event.date, 'h:mm a')}</span>
                </div>
                {event.relationshipName && (
                  <div className="flex items-center gap-1 mt-1">
                    <Heart className="w-3 h-3 text-pink-500" />
                    <span className="text-xs text-muted-foreground">
                      {event.relationshipName}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0">
                {event.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>
                )}
                {renderEventDetails()}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

const TimelineDay = ({ date, events, expandedEvents, onToggleExpand }: {
  date: Date;
  events: TimelineEvent[];
  expandedEvents: Set<string>;
  onToggleExpand: (eventId: string) => void;
}) => {
  const dayLabel = formatEventDate(date);
  const isRecent = differenceInDays(new Date(), date) <= 3;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`h-px flex-1 ${isRecent ? 'bg-blue-200' : 'bg-gray-200'}`} />
        <Badge variant={isRecent ? "default" : "secondary"} className="px-3 py-1">
          {dayLabel}
        </Badge>
        <div className={`h-px flex-1 ${isRecent ? 'bg-blue-200' : 'bg-gray-200'}`} />
      </div>
      
      <div className="space-y-3 ml-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isExpanded={expandedEvents.has(event.id)}
            onToggleExpand={() => onToggleExpand(event.id)}
          />
        ))}
      </div>
    </div>
  );
};

const EventTypeFilter = ({ 
  selectedTypes, 
  onTypeToggle 
}: {
  selectedTypes: Set<string>;
  onTypeToggle: (type: string) => void;
}) => {
  const eventTypes = [
    { key: 'boundary', label: 'Boundaries', icon: Shield, color: 'text-green-600' },
    { key: 'flag', label: 'Flags', icon: Flag, color: 'text-red-600' },
    { key: 'checkin', label: 'Check-ins', icon: Heart, color: 'text-purple-600' },
    { key: 'milestone', label: 'Milestones', icon: CheckCircle, color: 'text-yellow-600' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {eventTypes.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedTypes.has(type.key);
        
        return (
          <Button
            key={type.key}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeToggle(type.key)}
            className={`${!isSelected ? type.color : ''}`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {type.label}
          </Button>
        );
      })}
    </div>
  );
};

const TimelineStats = ({ events }: { events: TimelineEvent[] }) => {
  const stats = useMemo(() => {
    const boundaryEvents = events.filter(e => e.type === 'boundary');
    const respectRate = boundaryEvents.length > 0 
      ? (boundaryEvents.filter(e => e.data.status === 'respected').length / boundaryEvents.length) * 100
      : 0;
    
    const flagEvents = events.filter(e => e.type === 'flag');
    const greenFlags = flagEvents.filter(e => e.data.flagType === 'green').length;
    const redFlags = flagEvents.filter(e => e.data.flagType === 'red').length;
    
    const recentEvents = events.filter(e => differenceInDays(new Date(), e.date) <= 7).length;
    
    return {
      totalEvents: events.length,
      respectRate: Math.round(respectRate),
      greenFlags,
      redFlags,
      recentActivity: recentEvents
    };
  }, [events]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalEvents}</div>
          <div className="text-sm text-muted-foreground">Total Events</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.respectRate}%</div>
          <div className="text-sm text-muted-foreground">Respect Rate</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold text-green-600">{stats.greenFlags}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-lg font-bold text-red-600">{stats.redFlags}</span>
          </div>
          <div className="text-sm text-muted-foreground">Green/Red Flags</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.recentActivity}</div>
          <div className="text-sm text-muted-foreground">This Week</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ActivityTimeline({ 
  events = [], 
  relationshipFilter,
  className 
}: ActivityTimelineProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(['boundary', 'flag', 'checkin', 'milestone'])
  );
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  const filteredEvents = useMemo(() => {
    return events
      .filter(event => selectedTypes.has(event.type))
      .filter(event => relationshipFilter ? event.relationshipId === relationshipFilter : true)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [events, selectedTypes, relationshipFilter]);

  const groupedEvents = useMemo(() => {
    const groups = new Map<string, TimelineEvent[]>();
    
    filteredEvents.forEach(event => {
      const dayKey = startOfDay(event.date).getTime().toString();
      if (!groups.has(dayKey)) {
        groups.set(dayKey, []);
      }
      groups.get(dayKey)!.push(event);
    });
    
    return Array.from(groups.entries())
      .map(([dayKey, dayEvents]) => ({
        date: new Date(parseInt(dayKey)),
        events: dayEvents.sort((a, b) => b.date.getTime() - a.date.getTime())
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filteredEvents]);

  const handleTypeToggle = (type: string) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setSelectedTypes(newTypes);
  };

  const handleToggleExpand = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <TimelineStats events={filteredEvents} />
      
      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Activity Timeline
            </CardTitle>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <EventTypeFilter 
              selectedTypes={selectedTypes}
              onTypeToggle={handleTypeToggle}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedEvents(
                expandedEvents.size === filteredEvents.length 
                  ? new Set() 
                  : new Set(filteredEvents.map(e => e.id))
              )}
            >
              {expandedEvents.size === filteredEvents.length ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Content */}
      {filteredEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Timeline Events</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {selectedTypes.size === 0 
              ? "Select event types to view your activity timeline."
              : "Start tracking boundaries and relationship activities to build your timeline."
            }
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {viewMode === 'timeline' ? (
            <AnimatePresence>
              {groupedEvents.map(({ date, events }) => (
                <motion.div
                  key={date.getTime()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TimelineDay
                    date={date}
                    events={events}
                    expandedEvents={expandedEvents}
                    onToggleExpand={handleToggleExpand}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isExpanded={expandedEvents.has(event.id)}
                    onToggleExpand={() => handleToggleExpand(event.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type { TimelineEvent };