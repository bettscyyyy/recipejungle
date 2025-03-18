
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Utensils, Star } from "lucide-react";
import { Recipe } from "@/services/recipeService";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  recipe: Recipe;
  delay?: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, delay = 0 }) => {
  const { id, title, description, prepTime, cookTime, rating, ingredients } = recipe;

  // Calculate what percentage of ingredients are available
  const availableCount = ingredients.filter(ing => ing.isAvailable).length;
  const availabilityPercentage = Math.round((availableCount / ingredients.length) * 100);
  
  // Get the first 3 main ingredients to display
  const mainIngredients = ingredients.slice(0, 3).map(ing => ing.name);

  return (
    <Link to={`/recipe/${id}`}>
      <Card
        className="overflow-hidden h-full transition-all duration-500 hover:shadow-xl group glass-card"
        style={{ 
          animationDelay: `${delay}ms`,
          opacity: 0,
          animation: `fade-in 0.5s ease-out ${delay}ms forwards, slide-up 0.5s ease-out ${delay}ms forwards`
        }}
      >
        <div className="relative w-full h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={recipe.imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 z-20">
            <Badge className="bg-white/90 text-black font-medium">
              {availabilityPercentage}% match
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 className="font-display text-xl text-white font-medium tracking-tight mb-1 line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center space-x-1 text-white/90">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {description}
          </p>
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{prepTime + cookTime} min</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Utensils className="h-4 w-4 mr-1" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {mainIngredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="bg-secondary/50">
                {ingredient}
              </Badge>
            ))}
            {ingredients.length > 3 && (
              <Badge variant="outline" className="bg-secondary/50">
                +{ingredients.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RecipeCard;
