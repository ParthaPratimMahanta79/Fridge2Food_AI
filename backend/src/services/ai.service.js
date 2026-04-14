const axios = require("axios");

const getRecipeFromAI = async (ingredients) => {
    console.log("GROQ KEY:", process.env.GROQ_API_KEY);
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `Give 3 different recipes using these ingredients: ${ingredients}. 
Return in JSON format like:
{
  "options": [
    { "dish": "", "steps": [] }
  ]
}`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

   const text = response.data.choices[0].message.content;

// Strip markdown code fences if present
const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

return JSON.parse(cleaned);

} catch (err) {
    console.error("STATUS:", err.response?.status);
    console.error("FULL ERROR:", JSON.stringify(err.response?.data, null, 2));
    console.error("MESSAGE:", err.message);

    return {
      options: [
        {
          dish: "Fallback Recipe 🍳",
          steps: [
            "Prepare ingredients",
            "Cook everything together",
            "Serve hot"
          ]
        }
      ]
    };
  }
};

module.exports = { getRecipeFromAI };