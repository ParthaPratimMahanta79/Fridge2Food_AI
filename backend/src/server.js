const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const recipeRoutes = require("./routes/recipe.routes");

const app = express();

// 🔥 THIS MUST COME BEFORE ROUTES
app.use(cors());
app.use(express.json());

app.use("/api/recipe", recipeRoutes);

app.get("/", (req, res) => {
  res.send("Fridge2Food AI Backend Running 🍳");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});