
import React from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ingredient } from "@/services/recipeService";
import { toast } from "sonner";

interface IngredientsListProps {
  ingredients: Ingredient[];
  onToggleIngredient?: (index: number) => void;
}

const IngredientsList: React.FC<IngredientsListProps> = ({ 
  ingredients, 
  onToggleIngredient 
}) => {
  const availableCount = ingredients.filter(ing => ing.isAvailable).length;
  const missingCount = ingredients.length - availableCount;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Ingredients</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {availableCount} of {ingredients.length} available
          </span>
          {missingCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => toast.info("Shopping list feature coming soon!")}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add missing to list
            </Button>
          )}
        </div>
      </div>
      
      <ul className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <li 
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
              ingredient.isAvailable
                ? "bg-secondary/50"
                : "bg-secondary/20 border border-dashed border-muted"
            }`}
          >
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => onToggleIngredient?.(index)}
                className={`w-5 h-5 rounded flex items-center justify-center mr-3 transition-colors ${
                  ingredient.isAvailable 
                    ? "bg-primary text-white" 
                    : "border border-muted-foreground/50"
                }`}
              >
                {ingredient.isAvailable && <Check className="h-3 w-3" />}
              </button>
              <span className={ingredient.isAvailable ? "" : "text-muted-foreground"}>
                {ingredient.name}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {ingredient.amount} {ingredient.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsList;
