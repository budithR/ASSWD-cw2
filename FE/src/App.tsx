import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddPost from "./pages/AddPost";
import Search from "./pages/Search";
import BlogPost from "./pages/BlogPost";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import EditPost from "./pages/EditPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/search" element={<Search />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/profile/:userId?" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;