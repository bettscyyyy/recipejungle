
import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import { Recipe, searchRecipes } from "@/services/recipeService";
import { Utensils } from "lucide-react";

const Index = () => {
  const [searchIngredients, setSearchIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  const handleSearch = async (ingredients: string[]) => {
    setSearchIngredients(ingredients);
    setIsLoading(true);
    
    try {
      const results = await searchRecipes(ingredients);
      setRecipes(results);
      setInitialized(true);
    } catch (error) {
      console.error("Error searching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
        <div className="relative z-10 container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight mb-4">
              Discover Recipes with Ingredients You Already Have
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter the ingredients you have on hand, and we'll create perfect recipes tailored just for you.
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
      
      {/* Results Section */}
      <section className="flex-grow pb-24 container px-4 mx-auto">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block p-6 rounded-full bg-primary/10 animate-pulse mb-4">
              <Utensils className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Discovering recipes for you...</h3>
            <p className="text-muted-foreground mt-2">
              We're finding the perfect dishes based on your ingredients
            </p>
          </div>
        ) : (
          <>
            {initialized && (
              <div className="mb-6">
                <h2 className="text-2xl font-display font-medium tracking-tight">
                  {recipes.length > 0
                    ? `${recipes.length} ${recipes.length === 1 ? "Recipe" : "Recipes"} Found`
                    : "No recipes found"}
                </h2>
                {searchIngredients.length > 0 && (
                  <p className="text-muted-foreground">
                    for {searchIngredients.join(", ")}
                  </p>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  delay={index * 100}
                />
              ))}
            </div>
            
            {initialized && recipes.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block p-6 rounded-full bg-secondary mb-4">
                  <Utensils className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No recipes found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try searching with different ingredients or fewer ingredients to get more results.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Index;
