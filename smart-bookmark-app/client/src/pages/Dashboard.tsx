import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { AddBookmarkForm } from '@/components/AddBookmarkForm';
import { BookmarkCard } from '@/components/BookmarkCard';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, Bookmark, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { bookmarks, loading, addBookmark, deleteBookmark } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      setLocation('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                <Bookmark className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Bookmarks</h1>
                <p className="text-xs text-gray-500">Organize your links</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {user?.email}
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2 border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Add Bookmark Form */}
          <AddBookmarkForm onSubmit={addBookmark} isLoading={loading} />

          {/* Search and Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Bookmarks</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {filteredBookmarks.length} saved
              </span>
            </div>

            {bookmarks.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search bookmarks by title or URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Bookmarks Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Loading your bookmarks...</p>
              </div>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <Bookmark className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {bookmarks.length === 0 ? 'No bookmarks yet' : 'No results found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {bookmarks.length === 0
                  ? 'Start by adding your first bookmark above'
                  : 'Try adjusting your search query'}
              </p>
              {bookmarks.length === 0 && (
                <Button
                  onClick={() => document.getElementById('title')?.focus()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add First Bookmark
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={deleteBookmark}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Real-time sync indicator */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-lg border border-gray-200 text-xs text-gray-600">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        Real-time sync active
      </div>
    </div>
  );
}
