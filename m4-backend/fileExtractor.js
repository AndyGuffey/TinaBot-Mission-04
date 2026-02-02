/**
 * File Text Extraction Utility
 * Handles extraction of text from PDF, DOCX, DOC, and TXT files
 */

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extract text from a PDF file
 * @param {Buffer} fileBuffer - The PDF file buffer
 * @returns {Promise<string>} Extracted text
 */
async function extractFromPDF(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

/**
 * Extract text from a DOCX file
 * @param {Buffer} fileBuffer - The DOCX file buffer
 * @returns {Promise<string>} Extracted text
 */
async function extractFromDOCX(fileBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error) {
    console.error("Error extracting from DOCX:", error);
    throw new Error("Failed to extract text from DOCX");
  }
}

/**
 * Extract text from a plain text file
 * @param {Buffer} fileBuffer - The text file buffer
 * @returns {string} Extracted text
 */
function extractFromTXT(fileBuffer) {
  return fileBuffer.toString("utf-8");
}

/**
 * Extract text from any supported file type
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} filename - The filename (to determine file type)
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromFile(fileBuffer, filename) {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case ".pdf":
      return await extractFromPDF(fileBuffer);

    case ".docx":
      return await extractFromDOCX(fileBuffer);

    case ".doc":
      // For .doc files, try to use mammoth (it may have limited support)
      // Fall back to text if mammoth can't handle it
      try {
        return await extractFromDOCX(fileBuffer);
      } catch {
        return extractFromTXT(fileBuffer);
      }

    case ".txt":
      return extractFromTXT(fileBuffer);

    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

module.exports = {
  extractTextFromFile,
  extractFromPDF,
  extractFromDOCX,
  extractFromTXT,
};
