const express = require("express");

const { analyzeOffer } = require("../services/aiService");

const router = express.Router();

router.post("/analyze-offer", async (req, res, next) => {
  try {
    const { fileName, text } = req.body;

    if (!fileName || typeof fileName !== "string" || !fileName.trim()) {
      const error = new Error("fileName is required.");
      error.statusCode = 400;
      throw error;
    }

    if (!text || typeof text !== "string" || !text.trim()) {
      const error = new Error("text is required.");
      error.statusCode = 400;
      throw error;
    }

    const trimmedText = text.trim();

    if (trimmedText.length < 100) {
      const error = new Error(
        "Document text is too short for offer analysis."
      );
      error.statusCode = 400;
      throw error;
    }

    const analysis = await analyzeOffer({
      fileName: fileName.trim(),
      text: trimmedText,
    });

    res.status(200).json(analysis);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
