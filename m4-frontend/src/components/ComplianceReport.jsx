export default function ComplianceReport({ report }) {
  if (!report) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body text-center">
          <p className="text-gray-500">No report data available</p>
        </div>
      </div>
    );
  }

  // Handle raw text response if Gemini doesn't return JSON
  if (report.rawResponse) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Analysis Results</h2>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{report.summary}</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine risk level color
  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "critical":
        return "badge-error";
      case "high":
        return "badge-warning";
      case "medium":
        return "badge-info";
      case "low":
        return "badge-success";
      default:
        return "badge-ghost";
    }
  };

  // Determine status badge color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PASS":
        return "badge-success";
      case "FAIL":
        return "badge-error";
      case "PARTIAL":
        return "badge-warning";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="space-y-6">
      {/* OVERALL SUMMARY */}
      <div
        className="card text-white shadow-xl"
        style={{ backgroundColor: "#ce1252" }}
      >
        <div className="card-body">
          <h2 className="card-title text-3xl">Compliance Analysis Report</h2>
          <p className="text-lg">{report.summary}</p>

          <div className="flex gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm opacity-80">Overall Risk Level</span>
              <span
                className={`badge badge-lg font-bold ${getRiskColor(
                  report.overallRisk,
                )}`}
              >
                {report.overallRisk}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm opacity-80">Compliance Score</span>
              <span className="badge badge-lg font-bold">
                {report.overallComplianceScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLIANCE BY STEP */}
      {report.complianceByStep && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">6-Step Process Compliance</h3>

          <div className="grid grid-cols-1 gap-4">
            {report.complianceByStep.map((step, idx) => (
              <div key={idx} className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="card-title text-lg">
                        Step {step.stepNumber}: {step.stepName}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2">
                        {step.summary}
                      </p>
                    </div>
                    <span
                      className={`badge badge-lg font-bold ${getStatusColor(
                        step.status,
                      )}`}
                    >
                      {step.status}
                    </span>
                  </div>

                  {/* Step Details */}
                  {step.compliance && step.compliance.length > 0 && (
                    <div className="mt-4">
                      <div className="divider my-2"></div>
                      <div className="space-y-3">
                        {step.compliance.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-2 bg-base-100 rounded"
                          >
                            <span
                              className={`text-xl ${
                                item.status === "PASS"
                                  ? "text-success"
                                  : "text-error"
                              }`}
                            >
                              {item.status === "PASS" ? "✓" : "✗"}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {item.element}
                              </p>
                              {item.evidence && (
                                <p className="text-xs text-gray-600 mt-1 italic">
                                  {item.sourceFile}: "{item.evidence}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOLISTIC APPROACH */}
      {report.holisticApproach && (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between gap-4">
              <h3 className="card-title">Holistic Approach Assessment</h3>
              <span
                className={`badge badge-lg font-bold ${getStatusColor(
                  report.holisticApproach.status,
                )}`}
              >
                {report.holisticApproach.status}
              </span>
            </div>

            {report.holisticApproach.areasAddressed && (
              <div className="mt-4">
                <p className="font-semibold text-success mb-2">
                  ✓ Areas Covered:
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.holisticApproach.areasAddressed.map((area, i) => (
                    <span key={i} className="badge badge-success badge-lg">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {report.holisticApproach.areasGapped &&
              report.holisticApproach.areasGapped.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-error mb-2">
                    ✗ Areas with Gaps:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {report.holisticApproach.areasGapped.map((area, i) => (
                      <span key={i} className="badge badge-error badge-lg">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {report.holisticApproach.evidence && (
              <p className="text-sm mt-4 p-3 bg-base-100 rounded">
                {report.holisticApproach.evidence}
              </p>
            )}
          </div>
        </div>
      )}

      {/* CRITICAL GAPS */}
      {report.criticalGaps && report.criticalGaps.length > 0 && (
        <div className="card bg-error/10 border-2 border-error shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-error mb-4">
              Critical Gaps Identified
            </h3>

            <div className="space-y-4">
              {report.criticalGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-base-100 rounded border-l-4 border-error"
                >
                  <p className="font-semibold text-sm">{gap.gap}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Impact:</strong> {gap.impact}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Remediation:</strong> {gap.remediation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTS ANALYZED */}
      {report.documentsAnalyzed && (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Analysis Details</h3>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm opacity-80">Documents Analyzed</p>
                <p className="text-2xl font-bold">
                  {report.documentsAnalyzed.files?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-80">Total Pages</p>
                <p className="text-2xl font-bold">
                  {report.documentsAnalyzed.totalPages || 0}
                </p>
              </div>
            </div>

            {report.documentsAnalyzed.files && (
              <div className="mt-4">
                <p className="font-semibold text-sm mb-2">Files:</p>
                <ul className="list-disc list-inside space-y-1">
                  {report.documentsAnalyzed.files.map((file, i) => (
                    <li key={i} className="text-sm">
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {report.documentsAnalyzed.analysisDate && (
              <p className="text-xs text-gray-500 mt-4">
                Analysis Date: {report.documentsAnalyzed.analysisDate}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
