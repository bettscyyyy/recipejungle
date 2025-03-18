
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, Recipe as RecipeType } from "@/services/recipeService";
import VideoPlayer from "@/components/VideoPlayer";
import IngredientsList from "@/components/IngredientsList";
import NutritionChart from "@/components/NutritionChart";
import RatingSystem from "@/components/RatingSystem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, ChefHat, ArrowLeft, Printer } from "lucide-react";
import { toast } from "sonner";

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setIsLoading(true);
      try {
        const result = await getRecipeById(id);
        setRecipe(result);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        toast.error("Failed to load recipe details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleToggleIngredient = (index: number) => {
    if (!recipe) return;

    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      isAvailable: !updatedIngredients[index].isAvailable,
    };

    setRecipe({
      ...recipe,
      ingredients: updatedIngredients,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-medium">Loading recipe...</h2>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Recipe not found</h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Image and Title */}
      <div className="relative h-[50vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover animate-blur-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container px-4 mx-auto py-12">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-6 hover:bg-background/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to recipes
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-4 animate-slide-up">
              {recipe.title}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
              {recipe.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span>
                  <span className="font-medium">{recipe.prepTime + recipe.cookTime} min</span>
                  <span className="text-muted-foreground"> total time</span>
                </span>
              </div>
              
              <RatingSystem
                initialRating={recipe.rating}
                totalReviews={recipe.reviews}
                recipeId={recipe.id}
              />
              
              <Button
                variant="outline"
                onClick={handlePrint}
                className="ml-auto hidden md:flex"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column - Video and Instructions */}
          <div className="lg:col-span-2 space-y-8">
            <VideoPlayer recipeId={recipe.id} videoUrl={recipe.videoUrl} />
            
            <div className="space-y-6 glass-card p-6 rounded-xl">
              <h2 className="text-2xl font-display font-medium">Instructions</h2>
              <ol className="space-y-6">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex-none mr-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <p className="text-base">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {/* Right Column - Ingredients and Nutrition */}
          <div className="space-y-8">
            <div className="glass-card p-6 rounded-xl">
              <IngredientsList 
                ingredients={recipe.ingredients} 
                onToggleIngredient={handleToggleIngredient}
              />
            </div>
            
            <NutritionChart
              calories={recipe.calories}
              protein={recipe.protein}
              carbs={recipe.carbs}
              fat={recipe.fat}
            />
            
            <div className="md:hidden">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="w-full"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
