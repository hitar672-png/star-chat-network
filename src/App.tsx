import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import GuestRegister from "./pages/GuestRegister";
import ChatRoom from "./pages/ChatRoom";
import Rooms from "./pages/Rooms";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import MenuPage from "./pages/MenuPage";
import OnlineUsers from "./pages/OnlineUsers";
import SoundSettings from "./pages/SoundSettings";
import PrivateMessages from "./pages/PrivateMessages";
import PrivateChat from "./pages/PrivateChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/guest-register" element={<GuestRegister />} />
            <Route path="/chat/:roomId" element={<ChatRoom />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/online" element={<OnlineUsers />} />
            <Route path="/sound" element={<SoundSettings />} />
            <Route path="/private" element={<PrivateMessages />} />
            <Route path="/private/:userId" element={<PrivateChat />} />
            <Route path="/notifications" element={<Rooms />} />
            <Route path="/font" element={<Rooms />} />
            <Route path="/search" element={<Rooms />} />
            <Route path="/likes" element={<Rooms />} />
            <Route path="/levels" element={<Rooms />} />
            <Route path="/gifts" element={<Rooms />} />
            <Route path="/refresh" element={<Rooms />} />
            <Route path="/theme" element={<Rooms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
