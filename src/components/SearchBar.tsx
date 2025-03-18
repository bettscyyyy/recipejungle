
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SearchBarProps {
  onSearch: (ingredients: string[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addIngredient();
    } else if (e.key === "Backspace" && !inputValue && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    }
  };

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      const newIngredients = [...ingredients, inputValue.trim()];
      setIngredients(newIngredients);
      setInputValue("");
      onSearch(newIngredients);
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    onSearch(newIngredients);
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      addIngredient();
    } else {
      onSearch(ingredients);
    }
  };

  useEffect(() => {
    // Initial search with empty ingredients
    onSearch(ingredients);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`flex flex-col items-center space-y-4 p-8 rounded-2xl transition-all duration-300 ${
          isFocused
            ? "glass-card shadow-lg transform scale-[1.02]"
            : "bg-white/10 dark:bg-black/10 shadow"
        }`}
      >
        <div className="text-center mb-2 animate-slide-down">
          <h2 className="text-lg font-medium text-muted-foreground">
            <span className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary mr-2">Find Recipes</span>
            by entering ingredients you have
          </h2>
        </div>
        
        <div className="relative w-full">
          <div
            className={`flex items-center w-full overflow-hidden rounded-xl border transition-all duration-300 ${
              isFocused
                ? "border-primary shadow-[0_0_0_2px_rgba(var(--primary),0.25)] pulse-border"
                : "border-input"
            }`}
          >
            <div className="flex flex-wrap items-center gap-1 p-2 flex-grow">
              {ingredients.map((ingredient, index) => (
                <Badge
                  key={index}
                  className="animate-scale-in bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1"
                >
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="ml-2 text-xs hover:text-primary transition-colors"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-grow min-w-[120px] border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                placeholder={ingredients.length > 0 ? "Add another ingredient..." : "Enter an ingredient..."}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="rounded-l-none h-full px-4 animate-fade-in"
              size="icon"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground animate-fade-in">
          Press Enter after each ingredient or click the search icon to find recipes
        </p>
      </div>
    </div>
  );
};

export default SearchBar;
