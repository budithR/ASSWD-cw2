
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, User, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "@/services/auth";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.dispatchEvent(new Event("user-changed"));
  };

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const updateUser = () => setUser(getUserFromLocalStorage());
    window.addEventListener("user-changed", updateUser);
    return () => window.removeEventListener("user-changed", updateUser);
  }, []);
  
  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-display text-2xl font-bold text-primary">TravelTales</span>
            </Link>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-secondary transition-colors">
              Home
            </Link>
            <Link to="/search" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-secondary transition-colors">
              Search
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
            {user ? (
              <>
                {/* <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Current User</span>
                </div> */}
                <Button asChild variant="ghost" size="sm">
                  <Link to="/add-post">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Post
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/profile/${user.id}`}>
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Link>
                </Button>
                <Button onClick={logoutUser} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link to="/register">Register</Link>
                </Button>
                {/* <Button onClick={logoutUser} variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button> */}
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary">
            Home
          </Link>
          <Link to="/search" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary">
            Search
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="space-y-1">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>Current User</span>
                </div>
              </div>
              <Link to="/add-post" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary">
                New Post
              </Link>
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary">
                Profile
              </Link>
              <button 
                onClick={toggleLogin}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary"
              >
                Logout (Demo)
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary">
                Login
              </Link>
              <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary">
                Register
              </Link>
              <button 
                onClick={toggleLogin}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-secondary"
              >
                Login (Demo)
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
