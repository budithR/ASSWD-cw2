
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { editPost, fetchAllCountries, fetchPosts } from "@/services/api";

// Reuse countries array from AddPost
const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", 
  "Bangladesh", "Belgium", "Brazil", "Bulgaria", "Cambodia", "Canada", 
  "Chile", "China", "Colombia", "Croatia", "Czech Republic", "Denmark", 
  "Egypt", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", 
  "India", "Indonesia", "Iran", "Ireland", "Israel", "Italy", "Japan", 
  "Kenya", "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", 
  "Nigeria", "Norway", "Pakistan", "Peru", "Philippines", "Poland", 
  "Portugal", "Romania", "Russia", "Saudi Arabia", "Singapore", "South Africa", 
  "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey", 
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
  "Venezuela", "Vietnam"
];

// Mock data for posts (in a real app, you would fetch from an API)
const mockBlogs = [
  {
    id: "1",
    title: "Exploring the Hidden Beaches of Thailand",
    author: "Alex Morgan",
    country: "Thailand",
    date: "2025-05-08",
    description: "Discover secluded paradise spots away from tourist crowds in Thailand's southern islands.",
  },
  {
    id: "2",
    title: "Ancient Temples of Cambodia: Beyond Angkor Wat",
    author: "Sophia Chen",
    country: "Cambodia",
    date: "2025-05-05",
    description: "While Angkor Wat gets all the attention, Cambodia's countryside is dotted with equally fascinating temple ruins.",
  }
];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [visitDate, setVisitDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    country: "",
    visitDate: "",
  });
  const [post, setPost] = useState(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [countriesLoaded, setCountriesLoaded] = useState(false);

  


  // Load post data when component mounts
  useEffect(() => {
    if (!countriesLoaded) return; 
  
    const loadPost = async () => {
      try {
        const posts = await fetchPosts({});
        const matchedPost = posts.find((post: any) => String(post.postID) === id);
        if (!matchedPost) throw new Error("Post not found");
  
        setPost(matchedPost);
        setTitle(matchedPost.title);
        setDescription(matchedPost.description);
        setCountry(matchedPost.country);
        setVisitDate(new Date(matchedPost.visitedDate));
      } catch (error) {
        toast.error("Post not found");
        navigate("/");
      }
    };
  
    loadPost();
  }, [countriesLoaded, id, navigate]);

  useEffect(() => {
      const loadCountries = async () => {
        const data = await fetchAllCountries();
        const names = data
        .map((country: any) => country.name)
        .sort((a: string, b: string) => a.localeCompare(b));
        setCountries(names);
        setCountriesLoaded(true);
      };
    
      loadCountries();
    }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      title: "",
      description: "",
      country: "",
      visitDate: "",
    };

    // Title validation
    if (!title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }

    // Country validation
    if (!country) {
      newErrors.country = "Country is required";
      valid = false;
    }

    // Visit date validation
    if (!visitDate) {
      newErrors.visitDate = "Visit date is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would normally update the post via your backend
      console.log("Updating post:", {
        id,
        title,
        description,
        country,
        visitDate,
      });

      const payload = {
        title: title,
        description: description,
        country: country,
        visitedDate: adjustedDate?.toISOString().split("T")[0]
      }

      const editPostResponse = await editPost(Number(id), payload);
      
      // Mock successful post update
      toast.success("Blog post updated successfully!");
      navigate(`/blog/${id}`);
    }
  };

  const adjustedDate = visitDate
  ? new Date(visitDate.getTime() + 24 * 60 * 60 * 1000)
  : undefined;

  return (
    <div className="page-container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-8 text-center">
          Edit Travel Story
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Amazing Journey to..."
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && (
              <p className="text-destructive text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger
                id="country"
                className={errors.country ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-destructive text-sm mt-1">{errors.country}</p>
            )}
          </div>
          
          {/* Visit Date */}
          <div className="space-y-2">
            <Label htmlFor="visitDate">Visit Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="visitDate"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !visitDate && "text-muted-foreground",
                    errors.visitDate && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {visitDate ? format(visitDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={visitDate}
                  onSelect={setVisitDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.visitDate && (
              <p className="text-destructive text-sm mt-1">{errors.visitDate}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your travel experience, tips, and highlights..."
              className="min-h-[200px]"
              aria-invalid={errors.description ? "true" : "false"}
            />
            {errors.description && (
              <p className="text-destructive text-sm mt-1">{errors.description}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/blog/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Update Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;