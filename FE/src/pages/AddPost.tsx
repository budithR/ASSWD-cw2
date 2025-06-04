
import { useEffect, useState } from "react";
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
import { createPost, fetchAllCountries } from "@/services/api";
import { getUserFromLocalStorage } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";


const AddPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [visitDate, setVisitDate] = useState<Date | undefined>(undefined);
  const [countries, setCountries] = useState<string[]>([]);
  const toast = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    country: "",
    visitDate: "",
  });
  const [user, setUser] = useState(null);

  /* Image change handler removed. To restore the image upload functionality, uncomment the following:
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  */

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
    const loadCountries = async () => {
      const data = await fetchAllCountries();
      const names = data
      .map((country: any) => country.name)
      .sort((a: string, b: string) => a.localeCompare(b));
      setCountries(names);
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

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (validateForm()) {
  //     // Here you would normally submit the post to your backend
  //     console.log("Creating post:", {
  //       title,
  //       description,
  //       country,
  //       visitDate,
  //       // image, // Removed from submission
  //     });
      
  //     // Mock successful post creation
  //     alert("Blog post created successfully!");
  //     // In a real app, you would redirect to the new blog post or back to the home page
  //   }
  // };
  const adjustedDate = visitDate
  ? new Date(visitDate.getTime() + 24 * 60 * 60 * 1000)
  : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    // const userString = localStorage.getItem("user");
    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }
  
    // const user = JSON.parse(userString);
    const travellerId = user?.id;
  
    try {
      const payload = {
        title,
        description,
        country,
        travellerId,
        // visitedDate: visitDate?.toISOString().split("T")[0], // Format as YYYY-MM-DD
        visitedDate: adjustedDate?.toISOString().split("T")[0],
      };
  
      const response = await createPost(payload);

      if ("error" in response) {
        toast.toast({
          title: "Post Creation Failed",
          description: response.error,
          variant: "destructive",
        });

      } else {
        toast.toast({
          title: "Post Created Succesfully",
          description: 'Blog post created successfully!'
        });
    
        // Optionally, reset form or redirect
        setTitle("");
        setDescription("");
        setCountry("");
        setVisitDate(undefined);
        
        navigate("/"); 
      }
  
      
    } catch (error: any) {
      console.error("Post creation failed:", error);
      alert(error.message || "Something went wrong while creating the post.");
    }
  };

  return (
    <div className="page-container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-8 text-center">
          Share Your Travel Story
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload section removed. To restore it, uncomment the following:
          <div className="mb-8">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors",
                  previewUrl ? "border-primary/50" : "border-gray-300"
                )}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium">Change image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          */}
          
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
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              Publish Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
