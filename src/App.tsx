import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { useNotificationSound } from "@/hooks/useNotificationSound";

// Eager load critical routes
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Rooms from "./pages/Rooms";

// Lazy load non-critical routes
const GuestRegister = lazy(() => import("./pages/GuestRegister"));
const ChatRoom = lazy(() => import("./pages/ChatRoom"));
const Profile = lazy(() => import("./pages/Profile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const MenuPage = lazy(() => import("./pages/MenuPage"));
const OnlineUsers = lazy(() => import("./pages/OnlineUsers"));
const SoundSettings = lazy(() => import("./pages/SoundSettings"));
const PrivateMessages = lazy(() => import("./pages/PrivateMessages"));
const PrivateChat = lazy(() => import("./pages/PrivateChat"));
const Notifications = lazy(() => import("./pages/Notifications"));
const FontSettings = lazy(() => import("./pages/FontSettings"));
const SearchUsers = lazy(() => import("./pages/SearchUsers"));
const Likes = lazy(() => import("./pages/Likes"));
const Levels = lazy(() => import("./pages/Levels"));
const Gifts = lazy(() => import("./pages/Gifts"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const UpgradeAccount = lazy(() => import("./pages/UpgradeAccount"));
const Friends = lazy(() => import("./pages/Friends"));
const RoomsList = lazy(() => import("./pages/RoomsList"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const NotificationListener = () => {
  useNotificationSound();
  return null;
};

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationListener />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/guest-register" element={<GuestRegister />} />
              <Route path="/chat/:roomId" element={<ChatRoom />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/online" element={<OnlineUsers />} />
              <Route path="/sound" element={<SoundSettings />} />
              <Route path="/private" element={<PrivateMessages />} />
              <Route path="/private/:userId" element={<PrivateChat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/font" element={<FontSettings />} />
              <Route path="/search" element={<SearchUsers />} />
              <Route path="/likes" element={<Likes />} />
              <Route path="/levels" element={<Levels />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/upgrade" element={<UpgradeAccount />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/rooms-list" element={<RoomsList />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
