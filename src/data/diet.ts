export interface Food {
  name: string;
  proteinPer100: number; // grams of protein per 100g
  caloriesPer100: number; // kcal per 100g
  serving: string; // typical serving description
  servingGrams: number;
  meal: "Breakfast" | "Lunch" | "Snack" | "Dinner" | "Any";
}

export const FOODS: Food[] = [
  { name: "Paneer", proteinPer100: 18, caloriesPer100: 265, serving: "100g", servingGrams: 100, meal: "Lunch" },
  { name: "Milk", proteinPer100: 3.4, caloriesPer100: 61, serving: "1 glass (250ml)", servingGrams: 250, meal: "Breakfast" },
  { name: "Curd / Dahi", proteinPer100: 11, caloriesPer100: 98, serving: "1 bowl (150g)", servingGrams: 150, meal: "Any" },
  { name: "Greek Yogurt", proteinPer100: 10, caloriesPer100: 97, serving: "1 cup (170g)", servingGrams: 170, meal: "Snack" },
  { name: "Soy Chunks", proteinPer100: 52, caloriesPer100: 345, serving: "50g dry", servingGrams: 50, meal: "Lunch" },
  { name: "Tofu", proteinPer100: 8, caloriesPer100: 76, serving: "100g", servingGrams: 100, meal: "Lunch" },
  { name: "Dal (cooked)", proteinPer100: 7, caloriesPer100: 105, serving: "1 bowl (200g)", servingGrams: 200, meal: "Dinner" },
  { name: "Rajma (cooked)", proteinPer100: 8, caloriesPer100: 130, serving: "1 bowl (200g)", servingGrams: 200, meal: "Lunch" },
  { name: "Chole (cooked)", proteinPer100: 8, caloriesPer100: 120, serving: "1 bowl (200g)", servingGrams: 200, meal: "Lunch" },
  { name: "Moong / Sprouts", proteinPer100: 7, caloriesPer100: 44, serving: "1 cup (100g)", servingGrams: 100, meal: "Snack" },
  { name: "Peanuts", proteinPer100: 26, caloriesPer100: 567, serving: "1 handful (30g)", servingGrams: 30, meal: "Snack" },
  { name: "Almonds", proteinPer100: 21, caloriesPer100: 579, serving: "10-12 pieces (15g)", servingGrams: 15, meal: "Snack" },
  { name: "Sattu", proteinPer100: 20, caloriesPer100: 400, serving: "2 tbsp (30g)", servingGrams: 30, meal: "Breakfast" },
  { name: "Oats", proteinPer100: 13, caloriesPer100: 389, serving: "50g dry", servingGrams: 50, meal: "Breakfast" },
  { name: "Egg (optional)", proteinPer100: 13, caloriesPer100: 155, serving: "1 egg (50g)", servingGrams: 50, meal: "Breakfast" },
];

export const PROTEIN_TARGETS = {
  beginner: 60,
  intermediate: 80,
  advanced: 100,
};
