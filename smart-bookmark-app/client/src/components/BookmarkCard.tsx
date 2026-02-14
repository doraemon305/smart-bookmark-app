import React, { useState } from 'react';
import { Bookmark } from '@/hooks/useBookmarks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => Promise<void>;
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(bookmark.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'Link';
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300 border-0">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/10 group-hover:to-blue-500/5 transition-all duration-300" />
      
      <div className="relative p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 break-words">
              {bookmark.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {getDomain(bookmark.url)}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyUrl}
              className="h-8 w-8 p-0 hover:bg-blue-50"
              title="Copy URL"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0 hover:bg-blue-50"
              title="Open in new tab"
            >
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </a>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs text-gray-400 truncate">
            {new Date(bookmark.created_at).toLocaleDateString()} at{' '}
            {new Date(bookmark.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-medium transition-colors duration-200"
          >
            Visit
          </a>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-900">Delete Bookmark</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Are you sure you want to delete "{bookmark.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel className="text-gray-700 hover:bg-gray-100">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
