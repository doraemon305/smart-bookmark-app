import { describe, it, expect } from 'vitest';

describe('Supabase Configuration', () => {
  it('should have required environment variables', () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();
    expect(supabaseUrl).toMatch(/^https:\/\/.+\.supabase\.co$/);
    expect(supabaseKey).toBeTruthy();
  });

  it('should validate Supabase URL format', () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const urlPattern = /^https:\/\/[a-z0-9-]+\.supabase\.co$/;
    expect(supabaseUrl).toMatch(urlPattern);
  });

  it('should validate Supabase anon key format', () => {
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    // Supabase keys are typically long base64-like strings
    expect(supabaseKey.length).toBeGreaterThan(20);
  });
});
