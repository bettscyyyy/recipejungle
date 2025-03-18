
import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  isAvailable: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl: string;
  videoUrl: string | null;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  rating: number;
  reviews: number;
}

// Mock data for initial development
const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Creamy Mushroom Pasta",
    description: "A rich and creamy pasta dish with sautéed mushrooms and garlic.",
    ingredients: [
      { name: "Pasta", amount: "250", unit: "g", isAvailable: true },
      { name: "Mushrooms", amount: "200", unit: "g", isAvailable: true },
      { name: "Garlic", amount: "3", unit: "cloves", isAvailable: true },
      { name: "Heavy Cream", amount: "200", unit: "ml", isAvailable: false },
      { name: "Parmesan", amount: "50", unit: "g", isAvailable: true },
      { name: "Olive Oil", amount: "2", unit: "tbsp", isAvailable: true },
      { name: "Salt", amount: "1", unit: "tsp", isAvailable: true },
      { name: "Black Pepper", amount: "1/2", unit: "tsp", isAvailable: true },
    ],
    instructions: [
      "Cook pasta according to package instructions.",
      "Heat olive oil in a pan over medium heat.",
      "Add minced garlic and sauté until fragrant.",
      "Add sliced mushrooms and cook until golden brown.",
      "Pour in heavy cream and simmer for 5 minutes.",
      "Add cooked pasta to the sauce and mix well.",
      "Sprinkle with grated parmesan and black pepper.",
      "Serve hot and enjoy!"
    ],
    imageUrl: "https://images.unsplash.com/photo-1661174791092-b695bf5afd66",
    videoUrl: null,
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    calories: 450,
    protein: 12,
    carbs: 48,
    fat: 22,
    rating: 4.7,
    reviews: 128
  },
  {
    id: "2",
    title: "Mediterranean Chickpea Salad",
    description: "A refreshing salad with chickpeas, cucumber, tomatoes, and feta cheese.",
    ingredients: [
      { name: "Chickpeas", amount: "400", unit: "g", isAvailable: true },
      { name: "Cucumber", amount: "1", unit: "medium", isAvailable: true },
      { name: "Cherry Tomatoes", amount: "200", unit: "g", isAvailable: true },
      { name: "Red Onion", amount: "1/2", unit: "", isAvailable: true },
      { name: "Feta Cheese", amount: "100", unit: "g", isAvailable: false },
      { name: "Lemon", amount: "1", unit: "", isAvailable: true },
      { name: "Olive Oil", amount: "3", unit: "tbsp", isAvailable: true },
      { name: "Fresh Parsley", amount: "1/4", unit: "cup", isAvailable: false },
      { name: "Salt", amount: "1/2", unit: "tsp", isAvailable: true },
      { name: "Black Pepper", amount: "1/4", unit: "tsp", isAvailable: true },
    ],
    instructions: [
      "Drain and rinse the chickpeas.",
      "Dice the cucumber, tomatoes, and red onion.",
      "Combine all vegetables and chickpeas in a large bowl.",
      "Crumble feta cheese over the top.",
      "In a small bowl, mix lemon juice, olive oil, salt, and pepper.",
      "Pour the dressing over the salad and toss gently.",
      "Sprinkle with chopped fresh parsley.",
      "Chill for at least 30 minutes before serving."
    ],
    imageUrl: "https://images.unsplash.com/photo-1612967676197-6a95f3272b6c",
    videoUrl: null,
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    calories: 320,
    protein: 15,
    carbs: 35,
    fat: 15,
    rating: 4.5,
    reviews: 93
  },
  {
    id: "3",
    title: "Avocado Toast with Poached Egg",
    description: "A simple yet nutritious breakfast with creamy avocado and perfectly poached eggs.",
    ingredients: [
      { name: "Bread", amount: "2", unit: "slices", isAvailable: true },
      { name: "Avocado", amount: "1", unit: "ripe", isAvailable: true },
      { name: "Eggs", amount: "2", unit: "large", isAvailable: true },
      { name: "Lemon", amount: "1/2", unit: "", isAvailable: true },
      { name: "Red Pepper Flakes", amount: "1/4", unit: "tsp", isAvailable: false },
      { name: "Salt", amount: "1/2", unit: "tsp", isAvailable: true },
      { name: "Black Pepper", amount: "1/4", unit: "tsp", isAvailable: true },
    ],
    instructions: [
      "Toast the bread until golden and crisp.",
      "Mash the avocado with lemon juice, salt, and pepper.",
      "Spread the avocado mixture on the toast.",
      "Bring a pot of water to a gentle simmer and add a splash of vinegar.",
      "Crack an egg into a small cup and gently slide it into the water.",
      "Poach for 3-4 minutes until the whites are set but the yolk is still runny.",
      "Remove with a slotted spoon and place on the avocado toast.",
      "Sprinkle with red pepper flakes and serve immediately."
    ],
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
    videoUrl: null,
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    calories: 280,
    protein: 10,
    carbs: 22,
    fat: 18,
    rating: 4.8,
    reviews: 156
  }
];

export async function searchRecipes(ingredients: string[]): Promise<Recipe[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (ingredients.length === 0) {
        resolve(mockRecipes);
        return;
      }
      
      const lowercasedIngredients = ingredients.map(ing => ing.toLowerCase());
      
      const filteredRecipes = mockRecipes.filter(recipe => {
        const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
        return lowercasedIngredients.some(ing => 
          recipeIngredients.some(recipeIng => recipeIng.includes(ing))
        );
      });
      
      resolve(filteredRecipes);
    }, 1500);
  });
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const recipe = mockRecipes.find(r => r.id === id);
      resolve(recipe || null);
    }, 800);
  });
}

export async function generateRecipeVideo(recipeId: string): Promise<string> {
  toast.info("Generating recipe video...", { duration: 3000 });
  
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    
    // First check if we already have a video for this recipe in Supabase
    const { data: existingVideo, error: fetchError } = await supabase
      .from('recipe_videos')
      .select('video_url')
      .eq('recipe_id', recipeId)
      .single();
    
    if (existingVideo && existingVideo.video_url) {
      toast.success("Recipe video loaded successfully!", { duration: 3000 });
      return existingVideo.video_url;
    }
    
    // If no existing video, determine the appropriate video based on recipe type
    let videoUrl = "";
    
    if (recipe.title.toLowerCase().includes("pasta") || recipe.title.toLowerCase().includes("mushroom")) {
      videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
    } else if (recipe.title.toLowerCase().includes("salad") || recipe.title.toLowerCase().includes("chickpea")) {
      videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
    } else if (recipe.title.toLowerCase().includes("avocado") || recipe.title.toLowerCase().includes("toast")) {
      videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4";
    } else {
      videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    }
    
    // Store the generated video URL in Supabase for future use
    const { error: insertError } = await supabase
      .from('recipe_videos')
      .insert([{ 
        recipe_id: recipeId, 
        video_url: videoUrl,
        created_at: new Date().toISOString() 
      }]);
    
    if (insertError) {
      console.error("Error storing video URL:", insertError);
      // Continue even if storage fails - we still have the video URL
    }
    
    toast.success("Recipe video generated successfully!", { duration: 3000 });
    return videoUrl;
    
  } catch (error) {
    console.error("Error generating video:", error);
    toast.error("Failed to generate video. Please try again.");
    
    // Fallback video if something goes wrong
    return "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  }
}

export async function rateRecipe(recipeId: string, rating: number): Promise<void> {
  toast.success(`Recipe rated ${rating} stars!`, { duration: 3000 });
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}
