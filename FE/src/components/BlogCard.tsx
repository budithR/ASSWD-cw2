
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Calendar, Edit, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getUserFromLocalStorage } from "@/services/auth";
import { deletePost } from "@/services/api";

// interface BlogCardProps {
//   id: string;
//   title: string;
//   author: string;
//   authorImage?: string;
//   country: string;
//   date: string;
//   description: string;
//   likes: number;
//   comments: number;
//   image?: string; // Keeping this prop for future reference
// }

export interface BlogPost {
  postID: string;
  title: string;
  description: string;
  country: string;
  travellerId: string;
  travellerName: string;
  // authorImage?: string;
  Likes: string[];
  comments: string[];
  createdDate: string;
  visitedDate: string;
  dislike: string[];
  allDetails: string;
  IsDeleted: number;
  // image?: string; // Keeping this prop for future reference
}


const BlogCard = ({
  postID,
  title,
  description,
  country,
  travellerId,
  travellerName,
  Likes,
  comments,
  createdDate,
  visitedDate,
  dislike,
  allDetails,
  IsDeleted
}: BlogPost) => {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const updateUser = () => setUser(getUserFromLocalStorage());
    window.addEventListener("user-changed", updateUser);
    return () => window.removeEventListener("user-changed", updateUser);
  }, []);
  // Extract author initials for avatar fallback
  const initials = travellerName
    .split(" ")
    .map((name) => name[0])
    .join("");

    const handleDelete = async (e: React.MouseEvent) =>  {
      e.preventDefault(); // Prevent link navigation
      e.stopPropagation();

      const deletePostResponse = await deletePost(Number(postID));

      if ("error" in deletePostResponse) {
        toast.success("Fail to delete post!");
  
      } else {
        setTimeout(() => {
          navigate('/', { replace: true }); // Redirect to "/"
          window.location.reload();         // Refresh the page
        }, 1000); 
        toast.success("Post deleted successfully!");
        
      }
      
      
      // In a real app, you would call an API to delete the post
      // For now, just show a toast message
      
    };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/blog/${postID}`}>
        {/* Image section removed. To restore the image section, uncomment the following:
        <div className="aspect-video w-full overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-secondary to-primary/30 flex items-center justify-center">
              <span className="text-primary font-display text-xl">Global Nomad</span>
            </div>
          )}
        </div>
        */}
      </Link>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className="bg-accent hover:bg-accent/80">{country}</Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {createdDate}
          </div>
        </div>
        <Link to={`/blog/${postID}`} className="hover:text-primary transition-colors">
          <h3 className="font-display font-bold text-lg mt-2 line-clamp-2">{title}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-7 w-7 mr-2">
            {/* <AvatarImage src={authorImage} alt={author} /> */}
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{travellerName}</span>
        </div>
        
        <div className="flex items-center space-x-3 text-muted-foreground text-xs">
          {user && user.id === travellerId && (
            <div className="flex items-center space-x-2">
              <Link to={`/edit-post/${postID}`} onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )
          }
        
          <div className="flex items-center">
            <Heart className="h-3.5 w-3.5 mr-1" />
            {Likes.length}
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            {comments.length}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
