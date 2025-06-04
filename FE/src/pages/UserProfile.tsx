
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import BlogCard, { BlogPost } from "@/components/BlogCard";
import { getUserFromLocalStorage } from "@/services/auth";
import { fetchPosts, fetchUsers, followUser, unfollowUser, User } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

// Mock user data
const mockUser = {
  id: "u1",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  bio: "Travel enthusiast, photographer, and foodie. I've visited over 30 countries and counting. Always looking for hidden gems and authentic experiences.",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  coverImage: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1200&q=80",
  followers: [{
    id: "f1",
    name: "Sophie Williams",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80"
  }, {
    id: "f2",
    name: "James Wilson",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80"
  }, {
    id: "f3",
    name: "Linda Zhang",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
  }, {
    id: "f4",
    name: "Robert Brown",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
  }],
  following: [{
    id: "ff1",
    name: "Maria Rodriguez",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
  }, {
    id: "ff2",
    name: "Omar Hassan",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
  }, {
    id: "ff3",
    name: "Emma Johnson",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
  }],
  posts: [{
    id: "1",
    title: "Exploring the Hidden Beaches of Thailand",
    author: "Alex Morgan",
    authorImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
    country: "Thailand",
    date: "May 8, 2025",
    excerpt: "Discover secluded paradise spots away from tourist crowds in Thailand's southern islands.",
    likes: 342,
    comments: 56,
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000"
  }, {
    id: "4",
    title: "A Foodie's Guide to Mexico City",
    author: "Alex Morgan",
    authorImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
    country: "Mexico",
    date: "April 22, 2025",
    excerpt: "From street tacos to high-end cuisine, Mexico City is a culinary paradise waiting to be explored.",
    likes: 211,
    comments: 34,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000"
  }]
};

const UserProfile = () => {
  const { userId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [fetchedUser, setFetchedUser] = useState(null);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [followings, setFollowings] = useState<User[]>([]);
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


  useEffect(() => {
    const loadUser = async () => {
      const fetchedUserData = await fetchUsers({
        userIDs: [Number(userId)]
      });
      // setBlogs(blogData);

      if ("error" in fetchedUserData) {
        toast({
          title: "Failed to fetch user",
          description: fetchedUserData.error,
          variant: "destructive"
        });
  
      } else {
        setFetchedUser(fetchedUserData[0]);
        // setIsFollowing(fetchedUser?.Followers?.includes(user?.id))
      }
    };

    loadUser();
    // handleSortChange('newest');
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      if (!fetchedUser) return; // Prevent running until fetchedUser is set
  
      const blogData = await fetchPosts({
        travellerId: fetchedUser.id,
      });
  
      setBlogs(blogData);
    };
  
    loadBlogs();
  }, [fetchedUser]);

  useEffect(() => {
    const loadFollowers = async () => {
      if (!fetchedUser) return; // Prevent running until fetchedUser is set
  
      const followersData = await fetchUsers({
        userIDs: fetchedUser.Followers
      });

      if ("error" in followersData) {
        toast({
          title: "Failed to fetch followers",
          description: followersData.error,
          variant: "destructive"
        });
  
      } else {
        setFollowers(followersData);
      }
    };
  
    loadFollowers();
  }, [fetchedUser]);

  useEffect(() => {
    const loadFollowings = async () => {
      if (!fetchedUser) return; // Prevent running until fetchedUser is set
  
      const followingsData = await fetchUsers({
        userIDs: fetchedUser.Following
      });

      if ("error" in followingsData) {
        toast({
          title: "Failed to fetch followers",
          description: followingsData.error,
          variant: "destructive"
        });
  
      } else {
        setFollowings(followingsData);
      }
    };
  
    loadFollowings();
  }, [fetchedUser]);

  useEffect(() => {
    if (fetchedUser && user) {
      setIsFollowing(fetchedUser.Followers?.includes(user.id));
    }
  }, [fetchedUser, user]);
  

  // In a real app, you would fetch user data based on the username parameter
  // const user = mockUser;

  const handleFollow = async () => {
    // setIsFollowing(!isFollowing);

    const payload = {
      userId: user.id,
      followUserId: fetchedUser.id
    };
  
    const res = isFollowing
      ? await unfollowUser(payload)
      : await followUser(payload);
  
    if (!res.error) {
      setIsFollowing(!isFollowing);
      window.location.reload(); 
      // Optionally update followers list or refetch user data
    } else {
      console.error(res.error);
    }
    // In a real app, you would make an API call to follow/unfollow
  };

  function getInitialsArray(travellerName: string): string[] {
    return travellerName
      .trim()
      .split(/\s+/)
      .map(name => name[0]);
  }

  return (
    <div className="min-h-screen bg-background">
      {fetchedUser && followers && followings && (
        <div className="page-container pb-16">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-card rounded-lg p-6 shadow-sm">
                <Avatar className="h-24 w-24 border-4 border-background">
                  {/* <AvatarImage src={user.profileImage} alt={user.name} /> */}
                  <AvatarFallback className="text-3xl">
                    {getInitialsArray(fetchedUser.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="font-display text-3xl font-bold">
                    {fetchedUser.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {fetchedUser.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <span className="font-semibold">{blogs.length}</span>
                      <span className="text-muted-foreground ml-1">Posts</span>
                    </div>
                    <div>
                      <span className="font-semibold">{fetchedUser.Followers.length}</span>
                      <span className="text-muted-foreground ml-1">Followers</span>
                    </div>
                    <div>
                      <span className="font-semibold">{fetchedUser.Following.length}</span>
                      <span className="text-muted-foreground ml-1">Following</span>
                    </div>
                  </div>
                </div>

                {
                  fetchedUser.id !== user.id && (
                    <div className="mt-4 md:mt-0">
                      <Button variant={isFollowing ? "outline" : "default"} onClick={handleFollow}>
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    </div>
                  )
                }
                
              </div>

              {/* <div className="mt-6 bg-card rounded-lg p-6 shadow-sm">
                <h3 className="font-medium mb-2">Bio</h3>
                <p className="text-muted-foreground">test</p>
              </div> */}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="followers">Followers</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-6">
                {/* TODO - user.posts.length > 0 */}
                {blogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogs.map(post => (
                      <BlogCard key={post.postID} {...post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {user.name} hasn't shared any travel stories yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="followers" className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Followers ({followers.length})</h3>

                {followers.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {followers.map(follower => (
                    <Card key={follower.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {/* <AvatarImage src={follower.image} alt={follower.name} /> */}
                            <AvatarFallback>
                              {follower.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{follower.name}</h4>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => (window.location.href = `/profile/${follower.id}`)}>
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No Followers yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {fetchedUser.name} hasn't been followed by any one.
                    </p>
                  </div>
                )}

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.followers.map(follower => (
                    <Card key={follower.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={follower.image} alt={follower.name} />
                            <AvatarFallback>
                              {follower.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{follower.name}</h4>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div> */}
              </TabsContent>

              <TabsContent value="following" className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Following ({followings.length})</h3>

                {followings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {followings.map(following => (
                    <Card key={following.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {/* <AvatarImage src={following.image} alt={following.name} /> */}
                            <AvatarFallback>
                              {following.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{following.name}</h4>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => (window.location.href = `/profile/${following.id}`)}>
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No Followings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {fetchedUser.name} hasn't followed any one.
                    </p>
                  </div>
                )}
                
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
</div>

  );
};

export default UserProfile;