
import React, { useState } from "react";
import { Star } from "lucide-react";
import { rateRecipe } from "@/services/recipeService";

interface RatingSystemProps {
  initialRating: number;
  totalReviews: number;
  recipeId: string;
  onRatingChange?: (newRating: number) => void;
}

const RatingSystem: React.FC<RatingSystemProps> = ({
  initialRating,
  totalReviews,
  recipeId,
  onRatingChange,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);

  const handleRate = async (value: number) => {
    if (hasRated) return;
    
    setRating(value);
    setHasRated(true);
    
    try {
      await rateRecipe(recipeId, value);
      onRatingChange?.(value);
    } catch (error) {
      console.error("Error rating recipe:", error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="font-medium">{initialRating.toFixed(1)}</span>
          <span className="text-muted-foreground text-sm ml-1">
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>
      
      {!hasRated ? (
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-2">
            Rate this recipe:
          </p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRate(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 transition-all duration-150 ${
                    value <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium">
            Thanks for rating! <span className="text-primary">★</span>
          </p>
          <div className="flex space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`h-5 w-5 ${
                  value <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingSystem;
