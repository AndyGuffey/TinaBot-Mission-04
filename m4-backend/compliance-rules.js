/**
 * 6-Step Financial Planning Process Compliance Rules
 * Used to validate financial planning documents against the structured framework
 */

module.exports = {
  framework: "6-Step Financial Planning Process Compliance v1.0",
  description:
    "Validates that financial planning documents adhere to the 6-step financial planning process",

  rules: [
    {
      id: "FP-001",
      step: 1,
      name: "Relationship Establishment",
      category: "Foundation",
      severity: "critical",
      description:
        "Documents must clearly outline the scope of services, responsibilities, compensation, and engagement duration",
      keyElements: [
        "Scope of services defined",
        "Client and planner responsibilities clearly stated",
        "Compensation structure documented",
        "Engagement duration specified",
      ],
      applicableTo: ["all"],
    },
    {
      id: "FP-002",
      step: 2,
      name: "Client Data and Goals Collection",
      category: "Data Gathering",
      severity: "critical",
      description:
        "Documents must demonstrate collection of comprehensive financial and personal information",
      keyElements: [
        "Personal information gathered",
        "Assets documented",
        "Liabilities documented",
        "Cash flow information collected",
        "Insurance details captured",
        "Client objectives defined",
        "Priorities identified",
        "Risk tolerance assessed",
      ],
      applicableTo: ["all"],
    },
    {
      id: "FP-003",
      step: 3,
      name: "Financial Status Analysis",
      category: "Analysis",
      severity: "high",
      description:
        "Documents must show analysis and evaluation of the client's financial status",
      keyElements: [
        "Current financial situation assessed",
        "Strengths identified",
        "Weaknesses identified",
        "Roadblocks to goals documented",
        "Analysis conclusions presented",
      ],
      applicableTo: ["all"],
    },
    {
      id: "FP-004",
      step: 4,
      name: "Recommendations Development",
      category: "Strategy",
      severity: "high",
      description:
        "Documents must include customized recommendations aligned with client goals",
      keyElements: [
        "Investment strategy recommendations",
        "Tax strategy recommendations",
        "Retirement planning recommendations",
        "Recommendations clearly explained",
        "Client understanding confirmed",
        "Informed decision-making documented",
      ],
      applicableTo: ["all"],
    },
    {
      id: "FP-005",
      step: 5,
      name: "Plan Implementation",
      category: "Execution",
      severity: "high",
      description: "Documents must show execution of agreed-upon strategies",
      keyElements: [
        "Strategies put into action",
        "Implementation timeline documented",
        "Responsible parties assigned",
        "Professional coordination noted (if applicable)",
      ],
      applicableTo: ["all"],
    },
    {
      id: "FP-006",
      step: 6,
      name: "Monitoring and Review",
      category: "Ongoing",
      severity: "medium",
      description:
        "Documents must establish monitoring and review procedures for plan progress",
      keyElements: [
        "Review schedule established",
        "Performance evaluation method documented",
        "Adjustment process defined",
        "Progress tracking mechanism identified",
      ],
      applicableTo: ["all"],
    },
    {
      id: "FP-007",
      step: "Cross",
      name: "Holistic Approach",
      category: "Integration",
      severity: "high",
      description:
        "Documents must demonstrate consideration of all financial planning aspects",
      keyElements: [
        "Cash flow management addressed",
        "Risk management included",
        "Investment strategy covered",
        "Estate planning considered",
        "Long-term objectives alignment shown",
      ],
      applicableTo: ["all"],
    },
  ],
};
