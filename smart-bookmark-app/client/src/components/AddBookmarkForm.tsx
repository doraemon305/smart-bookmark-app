import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';

interface AddBookmarkFormProps {
  onSubmit: (title: string, url: string) => Promise<void>;
  isLoading?: boolean;
}

export function AddBookmarkForm({ onSubmit, isLoading = false }: AddBookmarkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title, url);
      setTitle('');
      setUrl('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isLoading || !title.trim() || !url.trim();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />
          Add New Bookmark
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., React Documentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting || isLoading}
              className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <Input
              id="url"
              type="url"
              placeholder="e.g., https://react.dev"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting || isLoading}
              className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Must be a valid URL starting with http:// or https://</p>
          </div>

          <Button
            type="submit"
            disabled={isDisabled}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Bookmark
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
