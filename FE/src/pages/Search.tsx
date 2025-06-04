
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BlogCard, { BlogPost } from "@/components/BlogCard";
import FilterSort from "@/components/FilterSort";
import Pagination from "@/components/Pagination";
import { Search as SearchIcon } from "lucide-react";
import { fetchPosts } from "@/services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserFromLocalStorage } from "@/services/auth";

// Import the same mock data from Index page
const mockBlogs = [
  {
    id: "1",
    title: "Exploring the Hidden Beaches of Thailand",
    author: "Alex Morgan",
    country: "Thailand",
    date: "May 8, 2025",
    excerpt: "Discover secluded paradise spots away from tourist crowds in Thailand's southern islands.",
    likes: 342,
    comments: 56,
    // image property kept but commented out for future reference
    // image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000"
  },
  {
    id: "2",
    title: "Ancient Temples of Cambodia: Beyond Angkor Wat",
    author: "Sophia Chen",
    country: "Cambodia",
    date: "May 5, 2025",
    excerpt: "While Angkor Wat gets all the attention, Cambodia's countryside is dotted with equally fascinating temple ruins.",
    likes: 287,
    comments: 42,
    // image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=1000"
  },
  {
    id: "3",
    title: "Road Tripping Through New Zealand's South Island",
    author: "James Wilson",
    country: "New Zealand",
    date: "April 29, 2025",
    excerpt: "A two-week journey through stunning landscapes, from glaciers to fjords to snow-capped mountains.",
    likes: 432,
    comments: 78,
    // image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000"
  }
];

const Search = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [searchResults, setSearchResults] = useState(mockBlogs);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState("common-search");
  const [user, setUser] = useState(null);


  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const updateUser = () => setUser(getUserFromLocalStorage());
    window.addEventListener("user-changed", updateUser);
    return () => window.removeEventListener("user-changed", updateUser);
  }, []);

  useEffect(() => {
      const loadBlogs = async () => {
        const blogData = await fetchPosts({});
        // setBlogs(blogData);
  
        // calculate page count
        const pageCount = Math.ceil(blogData.length / 6);
        setTotalPages(pageCount);
  
        // Sort by newest by default
        const sorted = [...blogData].sort((a, b) => {
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        });
  
        setBlogs(sorted);
        setLoading(false);
      };
  
      loadBlogs();
      // handleSortChange('newest');
    }, []);
  

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout( async () => {
      if (searchQuery.trim() !== "") {
        if(searchType === 'common-search') {
          const payload = {
            text: searchQuery.trim()
          }

          const blogData = await fetchPosts(payload);

          // calculate page count
          const pageCount = Math.ceil(blogData.length / 6);
          setTotalPages(pageCount);

          // Sort by newest by default
          const sorted = [...blogData].sort((a, b) => {
            return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
          });
          setSort("newest");
          setBlogs(sorted);

        } else if (searchType === 'country') {
          const payload = {
            countryName: searchQuery.trim()
          }

          const blogData = await fetchPosts(payload);

          // calculate page count
          const pageCount = Math.ceil(blogData.length / 6);
          setTotalPages(pageCount);

          // Sort by newest by default
          const sorted = [...blogData].sort((a, b) => {
            return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
          });
          setSort("newest");
          setBlogs(sorted);

        } else if (searchType === 'traveller') {
          const payload = {
            travellerName: searchQuery.trim()
          }

          const blogData = await fetchPosts(payload);

          // calculate page count
          const pageCount = Math.ceil(blogData.length / 6);
          setTotalPages(pageCount);

          // Sort by newest by default
          const sorted = [...blogData].sort((a, b) => {
            return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
          });
          setSort("newest");
          setBlogs(sorted);

        }
        setSearchResults(mockBlogs);
      } else {
        const blogData = await fetchPosts({});

          // calculate page count
          const pageCount = Math.ceil(blogData.length / 6);
          setTotalPages(pageCount);

          // Sort by newest by default
          const sorted = [...blogData].sort((a, b) => {
            return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
          });
          setSort("newest");
          setBlogs(sorted);
      }
      
      setCurrentPage(1); // Reset to first page after search
      setIsSearching(false);
    }, 500);
  };

  // Handle search type change
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
  };

  // Handle filter change
  const handleFilterChange = async (newFilter: string) => {
    setFilter(newFilter);

    if(newFilter === "following") {
      setLoading(true);

      const blogData = await fetchPosts({following: user.following});
      // setBlogs(blogData);

      // calculate page count
      const pageCount = Math.ceil(blogData.length / 6);
      setTotalPages(pageCount);

      // Sort by newest by default
      const sorted = [...blogData].sort((a, b) => {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      });
      setSort("newest");

      setBlogs(sorted);

      setLoading(false);

    } else if (newFilter === "all") {
      setLoading(true);

      const blogData = await fetchPosts({});
      // setBlogs(blogData);

      // calculate page count
      const pageCount = Math.ceil(blogData.length / 6);
      setTotalPages(pageCount);

      // Sort by newest by default
      const sorted = [...blogData].sort((a, b) => {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      });
      setSort("newest");

      setBlogs(sorted);

      setLoading(false);
    }
    setCurrentPage(1); // Reset to first page on filter change


  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSort(newSort);
  
    // Clone blogs before sorting
    let sortedBlogs = [...blogs];
  
    if (newSort === "newest") {
      sortedBlogs.sort((a, b) => {
        const dateA = new Date(a.createdDate).getTime();
        const dateB = new Date(b.createdDate).getTime();
        return dateB - dateA; // Newest first
      });
    } else if (newSort === "likes") {
      sortedBlogs.sort((a, b) => {
        const likesA = a.Likes?.length || 0;
        const likesB = b.Likes?.length || 0;
        return likesB - likesA; // Most liked first
      });
    } else if (newSort === "comments") {
      sortedBlogs.sort((a, b) => {
        const commentsA = a.comments?.length || 0;
        const commentsB = b.comments?.length || 0;
        return commentsB - commentsA; // Most commented first
      });
    }
  
    setBlogs(sortedBlogs);
    setCurrentPage(1); // Optional: reset to page 1 after sort
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you would fetch the appropriate page of search results
  };

  return (
    <div className="page-container pb-16">
      <div className="max-w-3xl mx-auto mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-6">
          Search Travel Stories
        </h1>
        
        {/* <form onSubmit={handleSearch} className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by destination, title, author..."
            className="pl-10 pr-4 py-3 text-base"
          />
          <Button 
            variant="ghost" 
            type="submit"
            size="icon"
            className="absolute left-0 top-0 h-full"
            disabled={isSearching}
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        </form> */}

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by destination, title, author..."
                className="pl-10 pr-4 py-3 text-base"
              />
              <Button 
                variant="ghost" 
                type="submit"
                size="icon"
                className="absolute left-0 top-0 h-full"
                disabled={isSearching}
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Search options:</span>
              <Select 
                value={searchType} 
                onValueChange={handleSearchTypeChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Search in..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common-search">Common Search</SelectItem>
                  <SelectItem value="country">Country Name</SelectItem>
                  <SelectItem value="traveller">Traveller Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </div>
      
      {/* Filter and Sort Controls */}
      <FilterSort
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      
      {/* Search Results */}
      {loading ? (
        <div className="my-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* {searchResults.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))} */}
            {blogs
              .slice((currentPage - 1) * 6, currentPage * 6) // 👈 Show only 6 items for the current page
              .map((post) => (
                <BlogCard key={post.postID} {...post} />
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="my-20 text-center">
          <h3 className="text-2xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-8">
            Try different keywords or browse all travel stories
          </p>
          <Button asChild>
            <a href="/">Browse All Stories</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Search;
