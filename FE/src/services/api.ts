import { BlogPost } from "@/components/BlogCard";
import { API_KEY } from "@/config";
import axios from "axios";

// types.ts or in your api.ts file
export interface FollowPayload {
  userId: number;
  followUserId: number;
}

export interface FetchUsersPayload {
  userIDs: number[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  numberOfPosts: number;
  createdDate: string;
  Followers: number[];
  Following: number[];
}

export interface PostUserPayload {
  postId: number;
  userId: number;
}


export interface DeleteCommentPayload {
  commentID: number;
  userID: number;
  postID: number;
}

export interface DeletedCommentResponse {
  message: string;
  deletedComment: {
    commentID: number;
    postID: number;
    text: string;
    travellerID: number;
    travellerName: string;
    addedDate: string;
  };
}

export interface CommentPayload {
  postID: number;
  travellerID: number;
  text: string;
}

export interface CommentResponse {
  commentID: number;
  postID: number;
  text: string;
  travellerID: number;
  travellerName: string;
  addedDate: string;
}

export interface Comment {
  commentID: number;
  postID: number;
  text: string;
  travellerID: number;
  travellerName: string;
  addedDate: string;
}

export interface Country {
  name: string;
  capital: string;
  currency: string;
  languages: string[];
  flag: string;
}

export interface CreatePostPayload {
  title: string;
  description: string;
  country: string;
  travellerId: number;
  visitedDate: string; // Format: "YYYY-MM-DD"
}

export interface CreatePostResponse {
  message: string;
  post: {
    postID: number;
    title: string;
    description: string;
    country: string;
    travellerId: number;
    travellerName: string;
    Likes: any[];
    Dislikes: any[];
    Comments: any[];
    createdDate: string;
    visitedDate: string;
    allDetails: string;
    IsDeleted: boolean;
  };
}

interface LoginPayload {
    email: string;
    password: string;
  }
  
  interface LoginResponse {
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
      numberOfPosts: number;
      createdDate: string;
      followers: string[];
      following: string[];
    };
  }
  
  interface ErrorResponse {
    error: string;
  }

export const fetchPosts = async (payload: any): Promise<BlogPost[]> => {
    try {
      const response = await fetch("http://localhost:3000/api/posts/searchPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch blog data");
      }
  
      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return [];
    }
};

export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ message: string; userId: number } | { error: string }> => {
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Return error message from backend
        return { error: data.error || "Registration failed" };
      }
  
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return { error: "Something went wrong. Please try again." };
    }
};


// services/api.ts
  
export const loginUser = async (
    payload: LoginPayload
  ): Promise<LoginResponse | ErrorResponse> => {
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { error: data.error || "Login failed" };
      }
  
      return data;
    } catch (error) {
      console.error("Login error:", error);
      return { error: "An unexpected error occurred" };
    }
};


export const createPost = async (
  payload: CreatePostPayload
): Promise<CreatePostResponse | { error: string }> => {
  try {
    const response = await fetch("http://localhost:3000/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || "Failed to create post" };
    }

    return await response.json();
  } catch (error: any) {
    return { error: error.message || "Network error" };
  }
};


export const fetchAllCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch("http://localhost:3001/api/countries", {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

// export async function fetchComments(payload: any) {
//   try {
//     const response = await fetch("http://localhost:3000/api/posts/getComments", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch comments");
//     }

//     const data = await response.json();
//     return data.comments;
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     throw error;
//   }
// }



export const fetchComments = async (payload: any): Promise<Comment[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/posts/getComments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const data = await response.json();
    return data.comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

export const addComment = async (payload: CommentPayload): Promise<CommentResponse | { error: string }> => {
  try {
    const response = await fetch("http://localhost:3000/api/posts/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to add comment");
    }

    const data = await response.json();
    return data.comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
};

export const deleteComment = async (
  payload: DeleteCommentPayload
): Promise<DeletedCommentResponse | { error: string }> => {
  try {
    const response = await fetch("http://localhost:3000/api/posts/deleteComment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    const data: DeletedCommentResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return null;
  }
};


// Like a post
export const likePost = async (payload: PostUserPayload): Promise<any> => {
  try {
    const response = await fetch("http://localhost:3000/api/posts/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to like post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// Dislike a post
export const dislikePost = async (payload: PostUserPayload): Promise<any> => {
  try {
    const response = await fetch("http://localhost:3000/api/posts/dislike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to dislike post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error disliking post:", error);
    throw error;
  }
};

// Remove like from post
export const removeLike = async (payload: PostUserPayload): Promise<any> => {
  try {
    const response = await fetch("http://localhost:3000/api/posts/removeLike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to remove like");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing like:", error);
    throw error;
  }
};

// Remove dislike from post
export const removeDislike = async (payload: PostUserPayload): Promise<any> => {
  try {
    const response = await fetch("http://localhost:3000/api/posts/removeDislike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Failed to remove dislike");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing dislike:", error);
    throw error;
  }
};

export const fetchUsers = async (payload: FetchUsersPayload): Promise<User[] | { error: string }> => {
  try {
    const response = await fetch("http://localhost:3000/api/users/fetchUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};


const BASE_URL = "http://localhost:3000/api";

// Follow a user
export const followUser = async (payload: FollowPayload) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/followUser`, payload);
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to follow user" };
  }
};

// Unfollow a user
export const unfollowUser = async (payload: FollowPayload) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/unfollowUser`, payload);
    return response.data;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to unfollow user" };
  }
};

// api.ts

export const editPost = async (postId: number, data: {
  title: string;
  description: string;
  country: string;
  visitedDate: string;
}) => {
  try {
    const response = await fetch(`http://localhost:3000/api/posts/edit/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to edit post");
    }

    return result;
  } catch (error) {
    return { error: error.message };
  }
};

export const deletePost = async (postId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/api/posts/delete/${postId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete post with ID ${postId}`);
    }

    const result = await response.json();
    console.log('Post deleted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

