
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BlogCard, { BlogPost } from "@/components/BlogCard";
import FilterSort from "@/components/FilterSort";
import Pagination from "@/components/Pagination";
import { fetchPosts } from "@/services/api";
import { getUserFromLocalStorage } from "@/services/auth";

const Index = () => {
  // const [blogs, setBlogs] = useState(mockBlogs);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [totalPages, setTotalPages] = useState(3); // Mock total pages
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
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
  };

  return (
    <div className="page-container pb-16">
      {/* Filter and Sort Controls */}
      <FilterSort
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {blogs.map((post) => (
          <BlogCard key={post.postID} {...post} />
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
    </div>
  );
};

export default Index;

