export default function FileUploader({
  onFilesSelected,
  files,
  onAnalyze,
  loading,
}) {
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFilesSelected(selectedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesSelected(updatedFiles);
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Upload Financial Documents</h2>

        {/* Daisy UI File Input */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">
              Select documents (PDF, Word, Docs)
            </span>
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
            style={{ borderColor: "#ce1252" }}
            disabled={loading}
          />
          <label className="label">
            <span className="label-text-alt">Max file size: 25MB per file</span>
          </label>
        </div>

        {/* Display Selected Files */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">
              Selected Files ({files.length}):
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-base-300"
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#ce1252" }}>📄</span>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="btn btn-sm btn-ghost text-error"
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-6">
          <button
            onClick={onAnalyze}
            disabled={files.length === 0 || loading}
            className="btn gap-2 text-white"
            style={{ backgroundColor: "#ce1252" }}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Analysing...
              </>
            ) : (
              <>
                <span>📤</span>
                Analyse Documents
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
