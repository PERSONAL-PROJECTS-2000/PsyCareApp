import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  name?: string;
  date_of_birth?: string;
  country?: string;
  language?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  moods: Record<string, number>;
  created_at: string;
}

export interface MindfulnessActivity {
  id: string;
  user_id: string;
  name: string;
  activity: string;
  alarm: string;
  timer: number;
  is_completed: boolean;
  is_target: boolean;
  is_running: boolean;
  time_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date: string;
  is_deleted: boolean;
  deleted_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PositiveThought {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date: string;
  is_deleted: boolean;
  deleted_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  category: string;
  deadline?: string;
  record_date: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  time: string;
  is_completed: boolean;
  completed_dates: string[];
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  user_id: string;
  title: string;
  type: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
}