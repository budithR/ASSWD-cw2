
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getUserFromLocalStorage } from "@/services/auth";

interface FilterSortProps {
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
}

const FilterSort = ({ onFilterChange, onSortChange }: FilterSortProps) => {
  const [activeFilter, setActiveFilter] = useState("all");
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
  
  const filters = useMemo(() => [
    { id: "all", label: "All" },
    // { id: "recent", label: "Recent" },
    // { id: "popular", label: "Popular" },
    ...(user ? [{ id: "following", label: "Following" }] : []),
  ], [user]);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick(filter.id)}
            className={activeFilter === filter.id ? "bg-primary text-white" : ""}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <div className="w-full sm:w-auto">
        <Select onValueChange={onSortChange} defaultValue="newest">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="comments">Most Commented</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterSort;
