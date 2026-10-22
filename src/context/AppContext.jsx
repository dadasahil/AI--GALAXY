import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { AppContext } from "./app-context";

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(() => loadFromStorage("aigalaxy:saved", []));
  const [compareList, setCompareList] = useState(() => loadFromStorage("aigalaxy:compare", []));
  const [profileLoaded, setProfileLoaded] = useState(false);

  const user = session?.user ?? null;
  const isEmailVerified = Boolean(user && hasVerifiedEmail(user));

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setProfileLoaded(true);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
      setProfileLoaded(false);
      if (!nextSession) {
        setProfile(null);
        setSaved(loadFromStorage("aigalaxy:saved", []));
        setCompareList(loadFromStorage("aigalaxy:compare", []));
        setProfileLoaded(true);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !user || !isEmailVerified) return;

    let cancelled = false;
    async function loadProfile() {
      let { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, role, status, saved_items, compare_items, created_at, updated_at")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        const legacy = await supabase
          .from("profiles")
          .select("id, email, full_name, saved_items, compare_items, updated_at")
          .eq("id", user.id)
          .maybeSingle();

        data = legacy.data ? {
          ...legacy.data,
          avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
          role: "user",
          status: "active",
          created_at: legacy.data.updated_at,
        } : null;
        error = legacy.error;
      }

      if (cancelled) return;

      if (error) {
        console.error("Failed to load profile", error);
      }

      if (data) {
        setProfile(data);
        setSaved(Array.isArray(data.saved_items) ? data.saved_items.map(Number) : []);
        setCompareList(Array.isArray(data.compare_items) ? data.compare_items.map(Number) : []);
      } else {
        try {
          const created = await ensureProfile(user);
          setProfile(created);
        } catch (profileError) {
          console.error("Failed to create profile", profileError);
          setProfile(fallbackProfile(user));
        }
      }

      setProfileLoaded(true);
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user, isEmailVerified]);

  useEffect(() => {
    if (!isSupabaseConfigured || !session) return;

    const timeoutMs = 30 * 60 * 1000;
    let timeoutId;

    function resetTimer() {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        supabase.auth.signOut();
      }, timeoutMs);
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [session]);

  useEffect(() => {
    localStorage.setItem("aigalaxy:saved", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem("aigalaxy:compare", JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    if (!isSupabaseConfigured || !user || !profileLoaded) return;
    persistProfileState(user, saved, compareList);
  }, [user, saved, compareList, profileLoaded]);

  function toggleSave(id) {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleCompare(id) {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  function clearCompare() {
    setCompareList([]);
  }

  async function signIn(email, password) {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user && !hasVerifiedEmail(data.user)) {
      await supabase.auth.signOut();
      throw new Error("Please verify your email address before logging in. Check your inbox for the confirmation link.");
    }
    if (data.user) await ensureProfile(data.user);
    return data;
  }

  async function signInWithGoogle(redirectTo = window.location.origin) {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) throw error;
    if (data.session && data.user && !hasVerifiedEmail(data.user)) {
      await supabase.auth.signOut();
    }
    return data;
  }

  async function resetPassword(email) {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
    return data;
  }

  async function signUp(email, password, fullName) {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }

  const value = useMemo(() => ({
    saved,
    toggleSave,
    compareList,
    toggleCompare,
    clearCompare,
    user,
    session,
    authLoading,
    isAuthenticated: isEmailVerified,
    isEmailVerified,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    profile,
    profileLoaded,
    isAdmin: profile?.role === "admin" && profile?.status !== "suspended",
    isSuspended: profile?.status === "suspended",
  }), [saved, compareList, user, session, authLoading, profile, profileLoaded, isEmailVerified]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function hasVerifiedEmail(user) {
  if (user.email_confirmed_at || user.confirmed_at) return true;
  return user.app_metadata?.provider === "google"
    || user.identities?.some((identity) => identity.provider === "google");
}

async function ensureProfile(user) {
  const payload = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
    role: "user",
    status: "active",
    saved_items: [],
    compare_items: [],
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id", ignoreDuplicates: true })
    .select("id, email, full_name, avatar_url, role, status, saved_items, compare_items, created_at, updated_at")
    .maybeSingle();

  if (error) {
    const legacyPayload = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      saved_items: [],
      compare_items: [],
      updated_at: new Date().toISOString(),
    };

    const legacy = await supabase
      .from("profiles")
      .upsert(legacyPayload, { onConflict: "id", ignoreDuplicates: true })
      .select("id, email, full_name, saved_items, compare_items, updated_at")
      .maybeSingle();

    if (legacy.error) throw legacy.error;
    return legacy.data ? { ...fallbackProfile(user), ...legacy.data } : fallbackProfile(user);
  }

  return data ?? payload;
}

function fallbackProfile(user) {
  return {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
    role: "user",
    status: "active",
    saved_items: [],
    compare_items: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

async function persistProfileState(user, savedItems, compareItems) {
  const payload = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
    saved_items: savedItems.map(String),
    compare_items: compareItems.map(String),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(payload);

  if (error) {
    const { error: legacyError } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      saved_items: savedItems.map(String),
      compare_items: compareItems.map(String),
      updated_at: new Date().toISOString(),
    });

    if (legacyError) console.error("Failed to save profile", legacyError);
  }
}
