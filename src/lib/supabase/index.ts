/**
 * BHUSHAKTI AI — Supabase / PostGIS Client Layer
 * Handles database pooling, spatial geometry queries, and realtime channel subscriptions.
 */

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
