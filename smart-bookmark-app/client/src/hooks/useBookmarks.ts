import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookmarks on mount and when user changes
  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setBookmarks(data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch bookmarks';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`bookmarks:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
            );
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const addBookmark = useCallback(
    async (title: string, url: string) => {
      if (!user) {
        toast.error('You must be logged in to add bookmarks');
        return;
      }

      try {
        // Validate URL
        try {
          new URL(url);
        } catch {
          throw new Error('Please enter a valid URL');
        }

        const { data, error } = await supabase
          .from('bookmarks')
          .insert([
            {
              user_id: user.id,
              title: title.trim(),
              url: url.trim(),
            },
          ])
          .select()
          .single();

        if (error) throw error;
        toast.success('Bookmark added successfully');
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add bookmark';
        toast.error(message);
        throw err;
      }
    },
    [user]
  );

  const deleteBookmark = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id);

        if (error) throw error;
        toast.success('Bookmark deleted successfully');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete bookmark';
        toast.error(message);
        throw err;
      }
    },
    []
  );

  const updateBookmark = useCallback(
    async (id: string, title: string, url: string) => {
      try {
        // Validate URL
        try {
          new URL(url);
        } catch {
          throw new Error('Please enter a valid URL');
        }

        const { data, error } = await supabase
          .from('bookmarks')
          .update({
            title: title.trim(),
            url: url.trim(),
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        toast.success('Bookmark updated successfully');
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update bookmark';
        toast.error(message);
        throw err;
      }
    },
    []
  );

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
    updateBookmark,
  };
}
