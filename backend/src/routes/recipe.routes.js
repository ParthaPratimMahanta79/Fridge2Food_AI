const express = require("express");
const router = express.Router();

const { generateRecipe } = require("../controllers/recipe.controller");

router.post("/", generateRecipe);

module.exports = router;