import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import ChatRoom from "./pages/ChatRoom";
import Rooms from "./pages/Rooms";
import Profile from "./pages/Profile";
import MenuPage from "./pages/MenuPage";
import OnlineUsers from "./pages/OnlineUsers";
import SoundSettings from "./pages/SoundSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/online" element={<OnlineUsers />} />
          <Route path="/sound" element={<SoundSettings />} />
          <Route path="/notifications" element={<ChatRoom />} />
          <Route path="/private" element={<ChatRoom />} />
          <Route path="/font" element={<ChatRoom />} />
          <Route path="/search" element={<ChatRoom />} />
          <Route path="/likes" element={<ChatRoom />} />
          <Route path="/levels" element={<ChatRoom />} />
          <Route path="/gifts" element={<ChatRoom />} />
          <Route path="/refresh" element={<ChatRoom />} />
          <Route path="/theme" element={<ChatRoom />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
