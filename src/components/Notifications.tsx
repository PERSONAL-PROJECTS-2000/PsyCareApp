import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Clock, Target, Calendar, CheckCircle } from 'lucide-react';

type NotificationCategory = 'goal-overdue' | 'goal' | 'mindfulness' | 'habit';

interface AppNotification {
  id: string;
  type: NotificationCategory;
  title: string;
  message: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

const Notifications: React.FC = () => {
  const { mindfulnessActivities, goals, habits } = useData();
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    generateNotifications();
  }, [mindfulnessActivities, goals, habits, profile]);

  const generateNotifications = () => {
    const newNotifications: AppNotification[] = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Mindfulness reminders
    mindfulnessActivities.forEach(activity => {
      if (activity.is_target && !activity.is_completed) {
        const [hours, minutes] = activity.alarm.split(':');
        const alarmTime = new Date();
        alarmTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        if (alarmTime <= now) {
          newNotifications.push({
            id: `mindfulness-${activity.id}`,
            type: 'mindfulness',
            title: 'Mindfulness Reminder',
            message: `Time for your ${activity.name} session`,
            time: activity.alarm,
            icon: Target,
            color: 'text-blue-500'
          });
        }
      }
    });

    // Goal deadlines
    goals.forEach(goal => {
      if (!goal.is_completed && goal.deadline) {
        const deadline = new Date(goal.deadline);
        const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilDeadline <= 3 && daysUntilDeadline >= 0) {
          newNotifications.push({
            id: `goal-${goal.id}`,
            type: 'goal',
            title: 'Goal Deadline Approaching',
            message: `"${goal.name}" is due in ${daysUntilDeadline} day(s)`,
            time: goal.deadline,
            icon: Calendar,
            color: 'text-orange-500'
          });
        } else if (daysUntilDeadline < 0) {
          newNotifications.push({
            id: `goal-overdue-${goal.id}`,
            type: 'goal-overdue',
            title: 'Goal Overdue',
            message: `"${goal.name}" was due ${Math.abs(daysUntilDeadline)} day(s) ago`,
            time: goal.deadline,
            icon: Calendar,
            color: 'text-red-500'
          });
        }
      }
    });

    // Habit reminders
    habits.forEach(habit => {
      if (!habit.is_completed) {
        const [hours, minutes] = habit.time.split(':');
        const habitTime = new Date();
        habitTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        if (habitTime <= now && !habit.completed_dates.includes(today)) {
          newNotifications.push({
            id: `habit-${habit.id}`,
            type: 'habit',
            title: 'Habit Reminder',
            message: `Don't forget: ${habit.name}`,
            time: habit.time,
            icon: CheckCircle,
            color: 'text-green-500'
          });
        }
      }
    });

    // Sort by priority and time
    newNotifications.sort((a, b) => {
      const priorityOrder = { 'goal-overdue': 0, 'goal': 1, 'mindfulness': 2, 'habit': 3 };
      return priorityOrder[a.type] - priorityOrder[b.type];
    });

    setNotifications(newNotifications);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Notifications</h3>
          <div className="flex items-center space-x-2 text-gray-600">
            <Bell size={20} />
            <span className="text-sm">{notifications.length} active</span>
          </div>
        </div>

        {/* Greeting */}
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-4 mb-6">
          <h4 className="text-lg font-semibold text-pink-800">
            {getGreeting()}, {profile?.name || 'Friend'}!
          </h4>
          <p className="text-pink-700">
            Here are your reminders and updates for today.
          </p>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <h4 className="text-xl font-semibold text-gray-600 mb-2">All caught up!</h4>
            <p className="text-gray-500">No new notifications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/40 rounded-2xl p-4 border border-white/30 flex items-start space-x-4"
                >
                  <div className={`p-2 rounded-full bg-white/50 ${notification.color}`}>
                    <Icon size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">{notification.title}</h5>
                    <p className="text-gray-600 text-sm">{notification.message}</p>
                    {notification.time && (
                      <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{notification.time}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/30 rounded-xl p-4 text-center">
            <Target className="mx-auto text-blue-500 mb-2" size={24} />
            <h6 className="font-semibold text-gray-800">Mindfulness</h6>
            <p className="text-sm text-gray-600">
              {mindfulnessActivities.filter(a => a.is_target && !a.is_completed).length} pending
            </p>
          </div>
          
          <div className="bg-white/30 rounded-xl p-4 text-center">
            <Calendar className="mx-auto text-orange-500 mb-2" size={24} />
            <h6 className="font-semibold text-gray-800">Goals</h6>
            <p className="text-sm text-gray-600">
              {goals.filter(g => !g.is_completed).length} active
            </p>
          </div>
          
          <div className="bg-white/30 rounded-xl p-4 text-center">
            <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
            <h6 className="font-semibold text-gray-800">Habits</h6>
            <p className="text-sm text-gray-600">
              {habits.filter(h => !h.is_completed).length} to complete
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;