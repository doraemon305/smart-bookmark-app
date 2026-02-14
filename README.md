# Smart Bookmark Manager

A modern, elegant bookmark management application built with Next.js, Supabase, and Tailwind CSS. Save, organize, and synchronize your favorite links in real-time across all your devices.

## 🌟 Features

- **Google OAuth Authentication**: Secure sign-in using Google OAuth via Supabase Auth
- **Real-time Synchronization**: Bookmarks sync instantly across multiple tabs and devices using Supabase Realtime
- **Private Bookmark Storage**: Each user's bookmarks are completely private and encrypted
- **URL Validation**: Automatic validation ensures only valid URLs are saved
- **Elegant UI**: Modern, responsive design with smooth animations and micro-interactions
- **Delete Confirmation**: Confirmation dialogs prevent accidental bookmark deletion
- **Search Functionality**: Quick search to filter bookmarks by title or URL
- **Mobile Responsive**: Fully responsive design that works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS 4 + Shadcn/UI components
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase Realtime subscriptions for multi-tab sync
- **Deployment**: Vercel

## 📋 Prerequisites

Before getting started, ensure you have:

- Node.js 18+ and pnpm installed
- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- A Google Cloud project with OAuth credentials
- A Vercel account for deployment

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/doraemon305/smart-bookmark-app.git
cd smart-bookmark-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Note your project URL and anonymous key from the API settings

#### Configure Google OAuth

1. In your Supabase dashboard, go to **Authentication > Providers**
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID from your Google Cloud project
   - Client Secret from your Google Cloud project
4. Set the redirect URL to: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

#### Create Database Schema

Run the following SQL in your Supabase SQL editor to create the bookmarks table:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON bookmarks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime for bookmarks table
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual Supabase project URL and anonymous key.

### 5. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## 🔧 Project Structure

```
smart-bookmark-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddBookmarkForm.tsx      # Form to add new bookmarks
│   │   │   ├── BookmarkCard.tsx         # Individual bookmark display
│   │   │   └── ui/                      # Shadcn/UI components
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx          # Supabase auth context
│   │   ├── hooks/
│   │   │   └── useBookmarks.ts          # Bookmark management hook
│   │   ├── lib/
│   │   │   └── supabase.ts              # Supabase client config
│   │   ├── pages/
│   │   │   ├── Home.tsx                 # Landing page
│   │   │   ├── Auth.tsx                 # Login page
│   │   │   ├── Dashboard.tsx            # Main app page
│   │   │   └── AuthCallback.tsx         # OAuth callback handler
│   │   ├── App.tsx                      # Main app component
│   │   ├── main.tsx                     # Entry point
│   │   └── index.css                    # Global styles
│   ├── index.html
│   └── vite.config.ts
├── public/                              # Static assets
├── package.json
└── README.md
```

## 🎯 Usage

### Sign In

1. Click "Sign In" or "Get Started" on the landing page
2. Click "Sign in with Google"
3. Authorize the application with your Google account
4. You'll be redirected to the dashboard

### Add a Bookmark

1. Fill in the bookmark title (e.g., "React Documentation")
2. Enter the URL (must start with http:// or https://)
3. Click "Add Bookmark"
4. The bookmark appears instantly in your list

### Delete a Bookmark

1. Click the trash icon on any bookmark card
2. Confirm the deletion in the dialog
3. The bookmark is removed immediately

### Search Bookmarks

Use the search bar to filter bookmarks by title or URL in real-time.

### Real-time Sync

Open the same bookmark manager in multiple tabs. When you add, update, or delete a bookmark in one tab, it automatically appears/updates/disappears in all other tabs without page refresh.

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit: Smart Bookmark Manager"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Set environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
5. Click "Deploy"

### 3. Configure Supabase Redirect URL

Update your Supabase Google OAuth redirect URL to include your Vercel deployment URL:
- Add: `https://your-vercel-domain.vercel.app/auth/callback`

## 🐛 Problems Encountered & Solutions

### Problem 1: Real-time Subscriptions Not Working Across Tabs

**Issue**: Bookmarks added in one tab weren't appearing in another tab in real-time.

**Root Cause**: Supabase Realtime subscriptions are per-connection. Each browser tab creates a separate connection to Supabase, and the subscription wasn't properly configured to handle multiple connections.

**Solution**: Implemented a robust subscription system in `useBookmarks.ts` that:
- Subscribes to the `postgres_changes` event for the bookmarks table
- Filters by the current user's ID to only receive their bookmarks
- Handles INSERT, UPDATE, and DELETE events
- Properly cleans up subscriptions on component unmount
- Uses React hooks to manage subscription lifecycle

```typescript
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
      // Handle INSERT, UPDATE, DELETE events
    }
  )
  .subscribe();
```

### Problem 2: URL Validation

**Issue**: Users could save invalid URLs, leading to broken links.

**Root Cause**: No client-side validation before sending to database.

**Solution**: Added URL validation using the native `URL` constructor:
```typescript
try {
  new URL(url);
} catch {
  throw new Error('Please enter a valid URL');
}
```

This ensures only valid URLs are accepted before database insertion.

### Problem 3: Authentication State Persistence

**Issue**: Users were logged out on page refresh.

**Root Cause**: Supabase session wasn't being checked on app initialization.

**Solution**: Implemented `getSession()` and `onAuthStateChange()` in the AuthContext:
```typescript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    }
  );

  return () => subscription?.unsubscribe();
}, []);
```

### Problem 4: Protected Routes

**Issue**: Users could access the dashboard without authentication.

**Root Cause**: No route protection mechanism in place.

**Solution**: Created a `ProtectedRoute` component that checks authentication state:
```typescript
function ProtectedRoute({ component: Component }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Auth />;

  return <Component />;
}
```

### Problem 5: Row Level Security (RLS) Policies

**Issue**: Users could see other users' bookmarks.

**Root Cause**: RLS policies weren't properly configured in Supabase.

**Solution**: Implemented comprehensive RLS policies:
```sql
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

These policies ensure users can only access their own bookmarks at the database level.

### Problem 6: Responsive Design on Mobile

**Issue**: Bookmark cards were too cramped on mobile devices.

**Root Cause**: Fixed padding and font sizes didn't adapt to smaller screens.

**Solution**: Used Tailwind's responsive utilities:
```tsx
<h3 className="font-semibold text-gray-900 text-sm sm:text-base">
  {bookmark.title}
</h3>
```

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

This includes tests for:
- Supabase configuration validation
- Authentication flow
- Bookmark CRUD operations

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Considerations

1. **Google OAuth**: All authentication is handled by Google and Supabase
2. **Row Level Security**: Database-level policies ensure users can only access their own bookmarks
3. **HTTPS Only**: All communication is encrypted
4. **No Password Storage**: We never store passwords; Google handles authentication
5. **Secure Cookies**: Session cookies are httpOnly and secure

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

## 🎉 Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Backend powered by [Supabase](https://supabase.com)
- Deployed on [Vercel](https://vercel.com)
- UI components from [Shadcn/UI](https://ui.shadcn.com)

---

**Happy bookmarking! 🔖**
