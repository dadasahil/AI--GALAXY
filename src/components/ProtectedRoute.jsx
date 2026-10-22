import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../hooks/useApp";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { authLoading, isAuthenticated, profileLoaded, isSuspended } = useApp();

  if (authLoading || (isAuthenticated && !profileLoaded)) {
    return <RouteLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isSuspended) {
    return <AccessDenied message="Your account is suspended. Contact support if this looks wrong." />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const location = useLocation();
  const { authLoading, isAuthenticated, profileLoaded, isAdmin } = useApp();

  if (authLoading || (isAuthenticated && !profileLoaded)) {
    return <RouteLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { authLoading, isAuthenticated } = useApp();

  if (authLoading) return <RouteLoading />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export function AccessDenied({ message = "You do not have permission to access this admin area." }) {
  return (
    <div className="mx-auto grid min-h-[65vh] max-w-3xl place-items-center px-5 py-16 text-center">
      <section className="glass rounded-2xl p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-rose-300">403 Access Denied</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-star-100">Restricted Area</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-star-500">{message}</p>
      </section>
    </div>
  );
}

function RouteLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="glass h-36 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
