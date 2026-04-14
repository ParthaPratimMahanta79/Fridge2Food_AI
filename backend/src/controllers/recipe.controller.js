const { getRecipeFromAI } = require("../services/ai.service");

const generateRecipe = async (req, res) => {
 console.log("BODY DEBUG:", req.body);
 console.log("INGREDIENTS:", req.body.ingredients);
  console.log("GROQ KEY:", process.env.GROQ_API_KEY);

  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({ message: "Ingredients required" });
    }

    const result = await getRecipeFromAI(ingredients);

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating recipe" });
  }

};

module.exports = { generateRecipe };