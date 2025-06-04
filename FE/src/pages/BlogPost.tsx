
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/CommentSection";
import { Heart, ThumbsUp, ThumbsDown, MessageSquare, Calendar, User, Clock, MapPin, Globe, CreditCard, Languages, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { deletePost, dislikePost, fetchAllCountries, fetchPosts, likePost, PostUserPayload, removeDislike, removeLike } from "@/services/api";
import { getUserFromLocalStorage } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogCancel, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";


const BlogPost = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  // const [likesCount, setLikesCount] = useState(mockBlogPost.likes);
  // const [dislikesCount, setDislikesCount] = useState(mockBlogPost.dislikes);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Changed to true for demonstration
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const [countryDetail, setCountryDetail] = useState<any>(null);
  const navigate = useNavigate();


  // Format dates for display
  // const formattedVisitDate = format(new Date(mockBlogPost.visitDate), "MMMM d, yyyy");
  // const formattedAddedDate = format(new Date(mockBlogPost.addedDate), "MMMM d, yyyy");

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
    const loadPost = async () => {
      try {
        const posts = await fetchPosts({});
        const matchedPost = posts.find((post: any) => String(post.postID) === id);
        setBlogPost(matchedPost);
        console.log(blogPost);
        // setLiked(checkIsLiked());
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadPost();
  }, [id]);

  useEffect(() => {
    if (blogPost && user) {
      setLiked(checkIsLiked());
      setDisliked(checkIsDisliked());
    }
  }, [blogPost, user]);

  useEffect(() => {
    const loadCountries = async () => {
      const data = await fetchAllCountries();
      const matchedCountry = data.find(
        (country: any) => country.name === blogPost?.country
      );
      setCountryDetail(matchedCountry);
    };
  
    if (blogPost) {
      loadCountries();
    }
  }, [blogPost]);

  const checkIsLiked = (): boolean => {
    if (!blogPost || !user) return false;
  
    return Array.isArray(blogPost.Likes) && blogPost.Likes.includes(user.id);
  };

  const checkIsDisliked = (): boolean => {
    if (!blogPost || !user) return false;
  
    return Array.isArray(blogPost.dislike) && blogPost.dislike.includes(user.id);
  };

  const loadPost = async () => {
    try {
      const posts = await fetchPosts({});
      const matchedPost = posts.find((post: any) => String(post.postID) === id);
      setBlogPost(matchedPost);
      console.log(blogPost);
      // setLiked(checkIsLiked());
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    // if (!isLoggedIn) {
    //   alert("Please log in to like this post");
    //   return;
    // }

    if (liked) {
      // setLiked(false);
      // setLikesCount(likesCount - 1);
      // TODO - call removelike API load post and check like dislike
      if (user) {
        const payload = {
          postId: blogPost.postID,
          userId: user.id
        }
        await removeLikePostMethod(payload);

        // await loadPost();
        setLiked(checkIsLiked());
        setDisliked(checkIsDisliked());
      } else {
        setLiked(false);
        const payload = {
          postId: blogPost.postID,
          userId: -1
        }
        await removeLikePostMethod(payload);
      }
    } else {
      // setLiked(true);
      // setLikesCount(likesCount + 1);
      // TODO - call like API load post and check like dislike
      if (user) {
        const payload = {
          postId: blogPost.postID,
          userId: user.id
        }
        await likePostMethod(payload);

        // await loadPost();
        setLiked(checkIsLiked());
        setDisliked(checkIsDisliked());
      } else {
        setLiked(true);
        const payload = {
          postId: blogPost.postID,
          userId: -1
        }
        await likePostMethod(payload);
      }
    }
  };

  function getInitialsArray(travellerName: string): string[] {
    return travellerName
      .trim()
      .split(/\s+/)
      .map(name => name[0]);
  }

  const handleDislike = async () => {

    if (disliked) {
      // setDisliked(false);
      // setDislikesCount(dislikesCount - 1);
      // TODO - call removeDilike API load post and check like dislike
      if (user) {
        const payload = {
          postId: blogPost.postID,
          userId: user.id
        }
        await removeDislikePostMethod(payload);

        // await loadPost();
        setLiked(checkIsLiked());
        setDisliked(checkIsDisliked());
      } else {
        setDisliked(false);
        const payload = {
          postId: blogPost.postID,
          userId: -1
        }
        await removeDislikePostMethod(payload);
      }
    } else {
      // setDisliked(true);
      // setDislikesCount(dislikesCount + 1);
      // TODO - call dilike API load post and check like dislike
      if (user) {
        const payload = {
          postId: blogPost.postID,
          userId: user.id
        }
        await dislikePostMethod(payload);

        // await loadPost();
        setLiked(checkIsLiked());
        setDisliked(checkIsDisliked());
      } else {
        setDisliked(true);
        const payload = {
          postId: blogPost.postID,
          userId: -1
        }
        await dislikePostMethod(payload);
      }

      
      // if (liked) {
      //   setLiked(false);
      //   // setLikesCount(likesCount - 1);
      // }
    }
  };

  // Add a login/logout toggle button for demo purposes
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const likePostMethod = async (payload: PostUserPayload) => {
    const likePostResponse = await likePost(payload);

    if ("error" in likePostResponse) {
      toast({
        title: "Failed to like post",
        description: likePostResponse.error,
        variant: "destructive"
      });

    } else {
      toast({
        title: "Liked successfully",
        // description: "Your comment has been successfully posted.",
      });
      await loadPost();

    }
  };

  const removeLikePostMethod = async (payload: PostUserPayload) => {
    const removelikePostResponse = await removeLike(payload);

    if ("error" in removelikePostResponse) {
      toast({
        title: "Failed to remove like",
        description: removelikePostResponse.error,
        variant: "destructive"
      });

    } else {
      toast({
        title: "Removed the liked successfully",
        // description: "Your comment has been successfully posted.",
      });

      await loadPost();
      // setLiked(checkIsLiked());
      // setDisliked(checkIsDisliked());
    }
    
  };

  const dislikePostMethod = async (payload: PostUserPayload) => {
    const dislikePostResponse = await dislikePost(payload);

    if ("error" in dislikePostResponse) {
      toast({
        title: "Failed to dislike",
        description: dislikePostResponse.error,
        variant: "destructive"
      });

    } else {
      toast({
        title: "Dislike the post successfully",
        // description: "Your comment has been successfully posted.",
      });

      await loadPost();
      // setLiked(checkIsLiked());
      // setDisliked(checkIsDisliked());
    }
    
  };

  const removeDislikePostMethod = async (payload: PostUserPayload) => {
    const removeDislikePostResponse = await removeDislike(payload);

    if ("error" in removeDislikePostResponse) {
      toast({
        title: "Failed to remove dislike",
        description: removeDislikePostResponse.error,
        variant: "destructive"
      });

    } else {
      toast({
        title: "Remove Dislike successfully",
        // description: "Your comment has been successfully posted.",
      });

      await loadPost();
      // setLiked(checkIsLiked());
      // setDisliked(checkIsDisliked());
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async () => {
    // In a real app, you would call an API to delete the post
    // For now, just show a toast message and redirect
    // toast({
    //   title: "Post deleted successfully",
    //   description: "Your post has been deleted.",
    // });
    // navigate("/");
    const deletePostResponse = await deletePost(Number(blogPost.postID));

      if ("error" in deletePostResponse) {
        toast({
          title: "Delete Post Failed",
          description: "Your post has been deleted.",
          variant: "destructive",
        });
  
      } else {
        setTimeout(() => {
          navigate('/', { replace: true }); // Redirect to "/"
          window.location.reload();         // Refresh the page
        }, 1000); 
        toast({
          title: "Post deleted successfully",
          description: "Your post has been deleted.",
        });
        
      }
  };


  return  (
    <div className="page-container py-10">
      <div className="max-w-4xl mx-auto">
        {/* Show loading or post not found */}
      {loading ? (
        <div>Loading...</div>
      ) : !blogPost ? (
        <div>Post not found.</div>
      ) : (
        <>
        {/* Hero Image removed. To restore it, uncomment the following:
        <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
          <img
            src={mockBlogPost.image}
            alt={mockBlogPost.title}
            className="w-full h-full object-cover"
          />
        </div>
        */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2 ">
            {user && user.id === blogPost.travellerId && (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your travel post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
          
          {/* <Button 
            variant={isLoggedIn ? "destructive" : "default"} 
            onClick={toggleLogin}
            size="sm"
          >
            {isLoggedIn ? "Logout (Demo)" : "Login (Demo)"}
          </Button> */}
        </div>
        
        {/* Title and Meta */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-accent hover:bg-accent/80">
              {blogPost.country}
            </Badge>
            <span className="text-muted-foreground text-sm">•</span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Visited {format(new Date(blogPost.visitedDate), "MMMM d, yyyy")}
            </div>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {blogPost.title}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                {/* <AvatarImage src={mockBlogPost.authorImage} alt={mockBlogPost.author} /> */}
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {getInitialsArray(blogPost.travellerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  to={`/profile/${blogPost.travellerId}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {blogPost.travellerName}
                </Link>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Posted on {format(new Date(blogPost.createdDate), "MMMM d, yyyy")}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-3">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                className={liked ? "bg-primary" : ""}
                onClick={handleLike}
              >
                <ThumbsUp className={`h-4 w-4 ${liked ? "mr-1" : "mr-0 sm:mr-1"}`} />
                <span className="hidden sm:inline">Like</span>
                <span className="ml-1">({blogPost.Likes.length})</span>
              </Button>
              
              <Button
                variant={disliked ? "default" : "outline"}
                size="sm"
                className={disliked ? "bg-destructive" : ""}
                onClick={handleDislike}
              >
                <ThumbsDown className={`h-4 w-4 ${disliked ? "mr-1" : "mr-0 sm:mr-1"}`} />
                <span className="hidden sm:inline">Dislike</span>
                <span className="ml-1">({blogPost.dislike.length})</span>
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        {/* Blog Content */}
        <article
          className="blog-content mb-10"
          dangerouslySetInnerHTML={{ __html: blogPost.description }}
        />
        
        {/* Tagged Info */}
        <Card className="p-4 bg-muted/50 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm">
                <span className="font-medium">Country:</span> {blogPost.country}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm">
                <span className="font-medium">Visit Date:</span> {format(new Date(blogPost.visitedDate), "MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm">
                <span className="font-medium">Author:</span>{" "}
                <Link
                  to={`/profile/${blogPost.travellerId}`}
                  className="hover:text-primary transition-colors"
                >
                  {blogPost.travellerName}
                </Link>
              </span>
            </div>
          </div>
        </Card>

        {/* Country Information Card */}
        <Card className="p-4 bg-muted/50 mb-10">
         {countryDetail && (
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center md:w-1/4">
              <img
                src={countryDetail.flag}
                alt={`https://flagcdn.com/w320/cg.png flag`}
                className="h-12 md:h-16 rounded shadow-sm mr-3"
              />
            </div>
            
            <div className="flex flex-col md:flex-row md:w-3/4 gap-4 md:gap-6">
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-medium">Capital:</span> {countryDetail.capital}
                </span>
              </div>
              
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-medium">Currency:</span> {countryDetail.currency}
                </span>
              </div>
              
              <div className="flex items-start md:items-center">
                <Languages className="h-4 w-4 text-muted-foreground mr-2 mt-1 md:mt-0 flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-medium">Languages:</span>{" "}
                  {countryDetail.languages.join(", ")}
                </span>
              </div>
            </div>
          </div>
         )}
        </Card>
        
        <Separator className="my-8" />
        
        <Separator className="my-8" />
        
        {/* Comments Section */}
        <CommentSection blogPost={blogPost}/>
        </>
      )}
        
      </div>
    </div>
  );
};

export default BlogPost;
