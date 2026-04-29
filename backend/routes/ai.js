const express = require("express");

const { generateSummary } = require("../services/aiService");

const router = express.Router();

router.post("/ai-summary", async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      const error = new Error("Text is required.");
      error.statusCode = 400;
      throw error;
    }

    try {
      const summary = await generateSummary(text);

      res.status(200).json({ summary });
    } catch (aiError) {
      console.error("AI summary generation failed:", aiError);

      res.status(200).json({
        summary: "Summary could not be generated right now. Please try again later.",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
