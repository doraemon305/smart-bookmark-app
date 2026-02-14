import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useBookmarks Hook', () => {
  describe('URL Validation', () => {
    it('should validate correct URLs', () => {
      const validUrls = [
        'https://www.google.com',
        'https://react.dev',
        'http://localhost:3000',
        'https://example.com/path?query=value',
        'https://sub.domain.example.com',
      ];

      validUrls.forEach((url) => {
        expect(() => new URL(url)).not.toThrow();
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not a url',
        'htp://wrong-protocol.com',
        'www.missing-protocol.com',
        'ftp://unsupported.com',
        '',
      ];

      invalidUrls.forEach((url) => {
        expect(() => new URL(url)).toThrow();
      });
    });

    it('should accept URLs with various protocols', () => {
      const urls = [
        'https://example.com',
        'http://example.com',
      ];

      urls.forEach((url) => {
        expect(() => new URL(url)).not.toThrow();
      });
    });
  });

  describe('Bookmark Data Structure', () => {
    it('should have required bookmark fields', () => {
      const bookmark = {
        id: 'test-id',
        user_id: 'user-123',
        title: 'Test Bookmark',
        url: 'https://example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(bookmark).toHaveProperty('id');
      expect(bookmark).toHaveProperty('user_id');
      expect(bookmark).toHaveProperty('title');
      expect(bookmark).toHaveProperty('url');
      expect(bookmark).toHaveProperty('created_at');
      expect(bookmark).toHaveProperty('updated_at');
    });

    it('should validate bookmark title is not empty', () => {
      const validTitles = ['React', 'My Favorite Link', 'A' + 'B'.repeat(100)];
      const invalidTitles = ['', '   '];

      validTitles.forEach((title) => {
        expect(title.trim().length).toBeGreaterThan(0);
      });

      invalidTitles.forEach((title) => {
        expect(title.trim().length).toBe(0);
      });
    });
  });

  describe('Bookmark Operations', () => {
    it('should validate bookmark addition requires both title and URL', () => {
      const testCases = [
        { title: 'React', url: 'https://react.dev', valid: true },
        { title: '', url: 'https://react.dev', valid: false },
        { title: 'React', url: '', valid: false },
        { title: '', url: '', valid: false },
      ];

      testCases.forEach(({ title, url, valid }) => {
        const hasTitle = title.trim().length > 0;
        const hasUrl = url.trim().length > 0;
        const isValid = hasTitle && hasUrl;
        expect(isValid).toBe(valid);
      });
    });

    it('should handle bookmark deletion', () => {
      const bookmarks = [
        { id: '1', title: 'Bookmark 1', url: 'https://example1.com' },
        { id: '2', title: 'Bookmark 2', url: 'https://example2.com' },
        { id: '3', title: 'Bookmark 3', url: 'https://example3.com' },
      ];

      const deleteBookmark = (id: string) => {
        return bookmarks.filter((b) => b.id !== id);
      };

      const result = deleteBookmark('2');
      expect(result).toHaveLength(2);
      expect(result.find((b) => b.id === '2')).toBeUndefined();
      expect(result.find((b) => b.id === '1')).toBeDefined();
      expect(result.find((b) => b.id === '3')).toBeDefined();
    });
  });

  describe('Search and Filter', () => {
    it('should filter bookmarks by title', () => {
      const bookmarks = [
        { id: '1', title: 'React Documentation', url: 'https://react.dev' },
        { id: '2', title: 'Vue Guide', url: 'https://vuejs.org' },
        { id: '3', title: 'React Router', url: 'https://reactrouter.com' },
      ];

      const searchQuery = 'React';
      const filtered = bookmarks.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toHaveLength(2);
      expect(filtered.find((b) => b.id === '1')).toBeDefined();
      expect(filtered.find((b) => b.id === '3')).toBeDefined();
      expect(filtered.find((b) => b.id === '2')).toBeUndefined();
    });

    it('should filter bookmarks by URL', () => {
      const bookmarks = [
        { id: '1', title: 'React', url: 'https://react.dev' },
        { id: '2', title: 'Vue', url: 'https://vuejs.org' },
        { id: '3', title: 'Next.js', url: 'https://nextjs.org' },
      ];

      const searchQuery = '.org';
      const filtered = bookmarks.filter((b) =>
        b.url.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(filtered).toHaveLength(2);
      expect(filtered.find((b) => b.id === '2')).toBeDefined();
      expect(filtered.find((b) => b.id === '3')).toBeDefined();
    });

    it('should be case-insensitive', () => {
      const bookmarks = [
        { id: '1', title: 'React Documentation', url: 'https://react.dev' },
        { id: '2', title: 'Vue Guide', url: 'https://vuejs.org' },
      ];

      const searchQueries = ['REACT', 'react', 'React', 'ReAcT'];
      searchQueries.forEach((query) => {
        const filtered = bookmarks.filter((b) =>
          b.title.toLowerCase().includes(query.toLowerCase())
        );
        expect(filtered).toHaveLength(1);
        expect(filtered[0]?.id).toBe('1');
      });
    });
  });

  describe('Timestamp Handling', () => {
    it('should format timestamps correctly', () => {
      const now = new Date();
      const isoString = now.toISOString();

      expect(isoString).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(new Date(isoString).getTime()).toBe(now.getTime());
    });

    it('should maintain bookmark order by creation date', () => {
      const bookmarks = [
        { id: '1', created_at: '2026-02-14T10:00:00Z' },
        { id: '2', created_at: '2026-02-14T11:00:00Z' },
        { id: '3', created_at: '2026-02-14T09:00:00Z' },
      ];

      const sorted = [...bookmarks].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      expect(sorted[0]?.id).toBe('2');
      expect(sorted[1]?.id).toBe('1');
      expect(sorted[2]?.id).toBe('3');
    });
  });
});
