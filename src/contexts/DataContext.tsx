import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type {
  MoodEntry,
  MindfulnessActivity,
  JournalEntry,
  PositiveThought,
  Goal,
  Habit,
  Resource
} from '../lib/supabase';

interface DataContextType {
  moodEntries: MoodEntry[];
  mindfulnessActivities: MindfulnessActivity[];
  journalEntries: JournalEntry[];
  positiveThoughts: PositiveThought[];
  goals: Goal[];
  habits: Habit[];
  resources: Resource[];
  loading: boolean;
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  addMindfulnessActivity: (activity: Omit<MindfulnessActivity, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_completed' | 'is_target' | 'is_running' | 'time_remaining'>) => Promise<void>;
  updateMindfulnessActivity: (id: string, updates: Partial<MindfulnessActivity>) => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  restoreJournalEntry: (id: string) => Promise<void>;
  addPositiveThought: (thought: Omit<PositiveThought, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePositiveThought: (id: string, updates: Partial<PositiveThought>) => Promise<void>;
  deletePositiveThought: (id: string) => Promise<void>;
  restorePositiveThought: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  addResource: (resource: Omit<Resource, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateResource: (id: string, updates: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  getDeletedEntries: () => (JournalEntry | PositiveThought)[];
  emptyRecycleBin: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [mindfulnessActivities, setMindfulnessActivities] = useState<MindfulnessActivity[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [positiveThoughts, setPositiveThoughts] = useState<PositiveThought[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAllData();
    } else {
      // Clear data when user logs out
      setMoodEntries([]);
      setMindfulnessActivities([]);
      setJournalEntries([]);
      setPositiveThoughts([]);
      setGoals([]);
      setHabits([]);
      setResources([]);
      setLoading(false);
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await Promise.all([
        loadMoodEntries(),
        loadMindfulnessActivities(),
        loadJournalEntries(),
        loadPositiveThoughts(),
        loadGoals(),
        loadHabits(),
        loadResources()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoodEntries = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading mood entries:', error);
      return;
    }

    setMoodEntries(data || []);
  };

  const loadMindfulnessActivities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mindfulness_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading mindfulness activities:', error);
      return;
    }

    // If no activities exist, create default ones
    if (!data || data.length === 0) {
      await createDefaultMindfulnessActivities();
    } else {
      setMindfulnessActivities(data);
    }
  };

  const createDefaultMindfulnessActivities = async () => {
    if (!user) return;

    const defaultActivities = [
      {
        user_id: user.id,
        name: 'Morning Clarity',
        activity: 'Meditation',
        alarm: '05:30',
        timer: 20,
        is_completed: false,
        is_target: true,
        is_running: false,
        time_remaining: 1200
      },
      {
        user_id: user.id,
        name: 'Evening Peacefulness',
        activity: 'Meditation',
        alarm: '18:30',
        timer: 20,
        is_completed: false,
        is_target: true,
        is_running: false,
        time_remaining: 1200
      }
    ];

    const { data, error } = await supabase
      .from('mindfulness_activities')
      .insert(defaultActivities)
      .select();

    if (error) {
      console.error('Error creating default activities:', error);
      return;
    }

    setMindfulnessActivities(data || []);
  };

  const loadJournalEntries = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading journal entries:', error);
      return;
    }

    setJournalEntries(data || []);
  };

  const loadPositiveThoughts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('positive_thoughts')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading positive thoughts:', error);
      return;
    }

    setPositiveThoughts(data || []);
  };

  const loadGoals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading goals:', error);
      return;
    }

    setGoals(data || []);
  };

  const loadHabits = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading habits:', error);
      return;
    }

    setHabits(data || []);
  };

  const loadResources = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading resources:', error);
      return;
    }

    setResources(data || []);
  };

  // Mood Entries
  const addMoodEntry = async (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        ...entry,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding mood entry:', error);
      return;
    }

    setMoodEntries(prev => [data, ...prev]);
  };

  // Mindfulness Activities
  const addMindfulnessActivity = async (activity: Omit<MindfulnessActivity, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_completed' | 'is_target' | 'is_running' | 'time_remaining'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mindfulness_activities')
      .insert({
        ...activity,
        user_id: user.id,
        is_completed: false,
        is_target: false,
        is_running: false,
        time_remaining: activity.timer * 60
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding mindfulness activity:', error);
      return;
    }

    setMindfulnessActivities(prev => [data, ...prev]);
  };

  const updateMindfulnessActivity = async (id: string, updates: Partial<MindfulnessActivity>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mindfulness_activities')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating mindfulness activity:', error);
      return;
    }

    setMindfulnessActivities(prev => 
      prev.map(activity => activity.id === id ? data : activity)
    );
  };

  // Journal Entries
  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        ...entry,
        user_id: user.id,
        is_deleted: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding journal entry:', error);
      return;
    }

    setJournalEntries(prev => [data, ...prev]);
  };

  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating journal entry:', error);
      return;
    }

    setJournalEntries(prev => 
      prev.map(entry => entry.id === id ? data : entry)
    );
  };

  const deleteJournalEntry = async (id: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        is_deleted: true,
        deleted_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting journal entry:', error);
      return;
    }

    setJournalEntries(prev => 
      prev.map(entry => entry.id === id ? data : entry)
    );
  };

  const restoreJournalEntry = async (id: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        is_deleted: false,
        deleted_date: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error restoring journal entry:', error);
      return;
    }

    setJournalEntries(prev => 
      prev.map(entry => entry.id === id ? data : entry)
    );
  };

  // Positive Thoughts
  const addPositiveThought = async (thought: Omit<PositiveThought, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('positive_thoughts')
      .insert({
        ...thought,
        user_id: user.id,
        is_deleted: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding positive thought:', error);
      return;
    }

    setPositiveThoughts(prev => [data, ...prev]);
  };

  const updatePositiveThought = async (id: string, updates: Partial<PositiveThought>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('positive_thoughts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating positive thought:', error);
      return;
    }

    setPositiveThoughts(prev => 
      prev.map(thought => thought.id === id ? data : thought)
    );
  };

  const deletePositiveThought = async (id: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('positive_thoughts')
      .update({
        is_deleted: true,
        deleted_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting positive thought:', error);
      return;
    }

    setPositiveThoughts(prev => 
      prev.map(thought => thought.id === id ? data : thought)
    );
  };

  const restorePositiveThought = async (id: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('positive_thoughts')
      .update({
        is_deleted: false,
        deleted_date: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error restoring positive thought:', error);
      return;
    }

    setPositiveThoughts(prev => 
      prev.map(thought => thought.id === id ? data : thought)
    );
  };

  // Goals
  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .insert({
        ...goal,
        user_id: user.id,
        is_completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding goal:', error);
      return;
    }

    setGoals(prev => [data, ...prev]);
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal:', error);
      return;
    }

    setGoals(prev => 
      prev.map(goal => goal.id === id ? data : goal)
    );
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting goal:', error);
      return;
    }

    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  // Habits
  const addHabit = async (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habits')
      .insert({
        ...habit,
        user_id: user.id,
        is_completed: false,
        completed_dates: []
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding habit:', error);
      return;
    }

    setHabits(prev => [data, ...prev]);
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habits')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating habit:', error);
      return;
    }

    setHabits(prev => 
      prev.map(habit => habit.id === id ? data : habit)
    );
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting habit:', error);
      return;
    }

    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  // Resources
  const addResource = async (resource: Omit<Resource, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('resources')
      .insert({
        ...resource,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding resource:', error);
      return;
    }

    setResources(prev => [data, ...prev]);
  };

  const updateResource = async (id: string, updates: Partial<Resource>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('resources')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating resource:', error);
      return;
    }

    setResources(prev => 
      prev.map(resource => resource.id === id ? data : resource)
    );
  };

  const deleteResource = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting resource:', error);
      return;
    }

    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  // Recycle Bin
  const getDeletedEntries = () => {
    const deletedJournals = journalEntries.filter(entry => entry.is_deleted);
    const deletedThoughts = positiveThoughts.filter(thought => thought.is_deleted);
    return [...deletedJournals, ...deletedThoughts];
  };

  const emptyRecycleBin = async () => {
    if (!user) return;

    // Permanently delete journal entries
    const deletedJournalIds = journalEntries
      .filter(entry => entry.is_deleted)
      .map(entry => entry.id);

    if (deletedJournalIds.length > 0) {
      const { error: journalError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('user_id', user.id)
        .in('id', deletedJournalIds);

      if (journalError) {
        console.error('Error emptying journal entries from recycle bin:', journalError);
      }
    }

    // Permanently delete positive thoughts
    const deletedThoughtIds = positiveThoughts
      .filter(thought => thought.is_deleted)
      .map(thought => thought.id);

    if (deletedThoughtIds.length > 0) {
      const { error: thoughtError } = await supabase
        .from('positive_thoughts')
        .delete()
        .eq('user_id', user.id)
        .in('id', deletedThoughtIds);

      if (thoughtError) {
        console.error('Error emptying positive thoughts from recycle bin:', thoughtError);
      }
    }

    // Update local state
    setJournalEntries(prev => prev.filter(entry => !entry.is_deleted));
    setPositiveThoughts(prev => prev.filter(thought => !thought.is_deleted));
  };

  return (
    <DataContext.Provider value={{
      moodEntries,
      mindfulnessActivities,
      journalEntries,
      positiveThoughts,
      goals,
      habits,
      resources,
      loading,
      addMoodEntry,
      addMindfulnessActivity,
      updateMindfulnessActivity,
      addJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
      restoreJournalEntry,
      addPositiveThought,
      updatePositiveThought,
      deletePositiveThought,
      restorePositiveThought,
      addGoal,
      updateGoal,
      deleteGoal,
      addHabit,
      updateHabit,
      deleteHabit,
      addResource,
      updateResource,
      deleteResource,
      getDeletedEntries,
      emptyRecycleBin
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};