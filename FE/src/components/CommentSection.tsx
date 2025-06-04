
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { getUserFromLocalStorage } from "@/services/auth";
import { addComment, CommentPayload, deleteComment, DeleteCommentPayload, fetchComments, fetchPosts } from "@/services/api";
import { useParams } from "react-router-dom";

interface Comment {
  id: string;
  author: string;
  authorImage?: string;
  content: string;
  timestamp: string;
}

interface CommentSectionProps {
  blogPost: any;
}

const CommentSection = ({ blogPost: initialBlogPost }: CommentSectionProps) => {
  const { id } = useParams();
  const [comments, setComments] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [blogPost, setBlogPost] = useState<any>(initialBlogPost);

  useEffect(() => {
    const loadComments = async () => {
      try {
        if (initialBlogPost.comments.length > 0 ) {
          const fetchedComments = await fetchComments({ commentIDs: initialBlogPost.comments });
          setComments(fetchedComments);
        }
      } catch (error) {
        console.error("Failed to load comments:", error);
      }
    };
  
    loadComments();
  }, []);

  useEffect(() => {
        const storedUser = getUserFromLocalStorage();
        setUser(storedUser);
      }, []);
    
      useEffect(() => {
        const updateUser = () => setUser(getUserFromLocalStorage());
        window.addEventListener("user-changed", updateUser);
        return () => window.removeEventListener("user-changed", updateUser);
      }, []);

      const loadPost = async () => {
        try {
          const posts = await fetchPosts({});
          const matchedPost = posts.find((post: any) => String(post.postID) === id);
          setBlogPost(matchedPost);
          return matchedPost;
        } catch (error) {
          console.error("Failed to fetch post:", error);
          return null;
        }
      };

  const loadCommentsAfterAddingComment = async (commentIdList: any) => {
      try {
        const fetchedComments = await fetchComments({ commentIDs: commentIdList});
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to load comments:", error);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new comment
    const commentPayload: CommentPayload = {
      postID: blogPost.postID,
      travellerID: user.id,
      text: newComment
    };

    const newAddedComment = await addComment(commentPayload);

    if ("error" in newAddedComment) {
      // toast.toast({
      //   title: "Post Creation Failed",
      //   description: response.error,
      //   variant: "destructive",
      // });

      toast({
        title: "Failed to add comment",
        description: newAddedComment.error,
        variant: "destructive"
      });

    } else {
      toast({
        title: "Comment added",
        description: "Your comment has been successfully posted.",
      });

      // Clear the comment field
      setNewComment("");
  
      // TODO
      // load new blogpost
      const newBlogPost = await loadPost();
      // load new comments

      if (newBlogPost) {
        await loadCommentsAfterAddingComment(newBlogPost.comments);
      }
      

    }


    
    // Add the comment to the list
    // setComments([...comments, comment]);
    
    // Show toast notification
    // toast({
    //   title: "Comment added",
    //   description: "Your comment has been successfully posted.",
    // });
    
    // // Clear the comment field
    // setNewComment("");
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: any) => {

    const deleteCommentPayload: DeleteCommentPayload = {
      commentID: commentId,
      userID: user.id,
      postID: blogPost.postID
    };

    const deletedCommentResponse = await deleteComment(deleteCommentPayload);

    if ("error" in deletedCommentResponse) {

      toast({
        title: "Failed to add comment",
        description: deletedCommentResponse.error,
        variant: "destructive"
      });

    } else {
      toast({
        title: "Comment deleted",
        description: "Your comment has been successfully deleted.",
      });

      // Clear the comment field
      setNewComment("");
  
      // TODO
      // load new blogpost
      const newBlogPost = await loadPost();
      // load new comments

      if (newBlogPost) {
        await loadCommentsAfterAddingComment(newBlogPost.comments);
      }
      

    }

    // // Remove the comment from the list
    // setComments(comments.filter(comment => comment.id !== commentId));
    
    // // Show toast notification
    // toast({
    //   title: "Comment deleted",
    //   description: "Your comment has been removed.",
    // });
  };

  // Extract initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("");
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display text-2xl font-semibold">Comments ({blogPost.comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-muted/50 rounded-md p-4 text-center">
          <p className="text-muted-foreground">
            Please <a href="/login" className="text-primary font-semibold">log in</a> to leave a comment.
          </p>
        </div>
      )}
      
      {comments && comments.length > 0 && (
        <div className="space-y-6 mt-8">
          {comments.map((comment) => (
            <div key={comment.commentID} className="flex gap-4">
              <Avatar className="h-10 w-10">
                {/* <AvatarImage src={comment.authorImage} alt={comment.author} /> */}
                <AvatarFallback className="bg-primary/20 text-primary">
                  {getInitials(comment.travellerName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{comment.travellerName}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.addedDate), { addSuffix: true })}
                    </span>
                    
                    {user && (comment.travellerID === user.id || user.id === blogPost.travellerId) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteComment(comment.commentID)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete comment</span>
                      </Button>
                    )} 
                   
                  </div>
                </div>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CommentSection;
