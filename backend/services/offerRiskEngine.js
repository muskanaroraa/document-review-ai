function evaluateOffer(offerDetails) {
  const risks = [];
  let score = 10;

  function addRisk(title, severity, explanation) {
    risks.push({ title, severity, explanation });

    // Deduct score based on severity while keeping the floor at 1.
    if (severity === "low") {
      score -= 1;
    } else if (severity === "medium") {
      score -= 2;
    } else if (severity === "high") {
      score -= 3;
    }
  }

  if (
    typeof offerDetails.noticePeriodDays === "number" &&
    offerDetails.noticePeriodDays > 60
  ) {
    addRisk(
      "Long notice period",
      "medium",
      "Long notice period may reduce flexibility when switching jobs"
    );
  }

  if (
    typeof offerDetails.variablePay === "number" &&
    typeof offerDetails.totalCompensation === "number" &&
    offerDetails.totalCompensation > 0 &&
    offerDetails.variablePay / offerDetails.totalCompensation > 0.3
  ) {
    addRisk(
      "High variable compensation",
      "high",
      "High portion of compensation is variable and not guaranteed"
    );
  }

  if (offerDetails.bondPresent === true) {
    addRisk(
      "Bond or service agreement present",
      "high",
      "Bond or service agreement may restrict early exit"
    );
  }

  if (offerDetails.fixedPay === null) {
    addRisk(
      "Fixed pay unclear",
      "medium",
      "Fixed compensation not clearly defined"
    );
  }

  if (offerDetails.totalCompensation === null) {
    addRisk(
      "Total compensation unclear",
      "high",
      "Total compensation is not clearly specified"
    );
  }

  score = Math.max(score, 1);

  let recommendation = "Offer looks strong with manageable risk";

  if (score >= 5 && score <= 7) {
    recommendation =
      "Offer is acceptable but requires clarification or negotiation";
  } else if (score >= 1 && score <= 4) {
    recommendation =
      "Offer has significant risks and should be reviewed carefully";
  }

  return {
    risks,
    score,
    recommendation,
  };
}

module.exports = {
  evaluateOffer,
};
