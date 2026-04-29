function detectDocumentType(text) {
  const normalizedText = (text || "").toLowerCase();
  const words = normalizedText.match(/\b[a-z]+\b/g) || [];
  const wordSet = new Set(words);

  const resumeMatches = ["experience", "skills", "education"].filter(
    (keyword) => wordSet.has(keyword)
  ).length;

  if (resumeMatches >= 2) {
    return "resume";
  }

  const contractMatches = ["agreement", "terms", "party"].filter((keyword) =>
    wordSet.has(keyword)
  ).length;

  if (contractMatches >= 2) {
    return "contract";
  }

  return "general";
}

module.exports = {
  detectDocumentType,
};
