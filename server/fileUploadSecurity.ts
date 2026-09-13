/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * OPHIREUM ASSISTANT SECURE FILE UPLOAD & VERIFICATION ENGINE
 * 
 * Strict binary security checks:
 * - Magic byte / file signature verification
 * - Rejection of disguised executables (PE/ELF/Scripts renamed with image/pdf extensions)
 * - Filename sanitization preventing path traversal and shell injection
 * - Maximum file size enforcement (15MB)
 * - Safe text extraction and MIME-type validation
 */

import path from 'path';

export interface FileValidationResult {
  valid: boolean;
  sanitizedFilename: string;
  detectedMime: string;
  detectedCategory: 'chart_screenshot' | 'pdf_report' | 'csv_data' | 'xlsx_journal' | 'research_notes';
  error?: string;
}

// Known Magic Byte Signatures
const SIGNATURES = {
  PNG: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  JPEG: [0xFF, 0xD8, 0xFF],
  WEBP_RIFF: [0x52, 0x49, 0x46, 0x46], // 'RIFF' + 4 bytes + 'WEBP'
  PDF: [0x25, 0x50, 0x44, 0x46], // '%PDF'
  ZIP_PK: [0x50, 0x4B, 0x03, 0x04], // 'PK..' used by .zip, .xlsx, .docx
  // Dangerous Executable Signatures
  PE_EXE: [0x4D, 0x5A], // 'MZ' - Windows Executable / DLL
  ELF: [0x7F, 0x45, 0x4C, 0x46], // Linux ELF Executable
  SHEBANG: [0x23, 0x21] // '#!' Unix shell script
};

function matchesBytes(buffer: Buffer, signature: number[], offset = 0): boolean {
  if (buffer.length < offset + signature.length) return false;
  for (let i = 0; i < signature.length; i++) {
    if (buffer[offset + i] !== signature[i]) return false;
  }
  return true;
}

/**
 * Sanitizes filename to prevent directory traversal, null-byte injection, and shell exploitation.
 */
export function sanitizeFilename(rawFilename: string): string {
  const base = path.basename(rawFilename).replace(/\0/g, '');
  // Keep only alphanumeric, hyphens, underscores, and safe dots
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  // Avoid leading dots or empty filename
  const safeName = cleaned.replace(/^\.+/, '') || 'upload_file';
  return safeName.slice(0, 100);
}

/**
 * Validates uploaded file buffer against declared extension and true binary magic bytes.
 */
export function validateUploadedBuffer(
  buffer: Buffer,
  rawFilename: string,
  declaredMimeType?: string
): FileValidationResult {
  const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

  if (buffer.length === 0) {
    return {
      valid: false,
      sanitizedFilename: '',
      detectedMime: '',
      detectedCategory: 'research_notes',
      error: 'File buffer is empty (0 bytes).'
    };
  }

  if (buffer.length > MAX_SIZE_BYTES) {
    return {
      valid: false,
      sanitizedFilename: '',
      detectedMime: '',
      detectedCategory: 'research_notes',
      error: `File size exceeds 15MB limit (${(buffer.length / (1024 * 1024)).toFixed(2)} MB).`
    };
  }

  const sanitized = sanitizeFilename(rawFilename);
  const ext = path.extname(sanitized).toLowerCase();

  // 1. REJECT EXECUTABLES AND SCRIPTS REGARDLESS OF EXTENSION
  if (matchesBytes(buffer, SIGNATURES.PE_EXE)) {
    return {
      valid: false,
      sanitizedFilename: sanitized,
      detectedMime: 'application/x-dosexec',
      detectedCategory: 'research_notes',
      error: 'Executable content rejected: Windows PE/MZ binary header detected.'
    };
  }

  if (matchesBytes(buffer, SIGNATURES.ELF)) {
    return {
      valid: false,
      sanitizedFilename: sanitized,
      detectedMime: 'application/x-elf',
      detectedCategory: 'research_notes',
      error: 'Executable content rejected: Linux ELF binary detected.'
    };
  }

  if (matchesBytes(buffer, SIGNATURES.SHEBANG)) {
    return {
      valid: false,
      sanitizedFilename: sanitized,
      detectedMime: 'text/x-shellscript',
      detectedCategory: 'research_notes',
      error: 'Executable script rejected: Unix shebang script detected.'
    };
  }

  // 2. CHECK LEGITIMATE FILE TYPES
  // A. PNG Image
  if (matchesBytes(buffer, SIGNATURES.PNG)) {
    if (ext !== '.png') {
      return {
        valid: false,
        sanitizedFilename: sanitized,
        detectedMime: 'image/png',
        detectedCategory: 'chart_screenshot',
        error: `File extension mismatch: PNG binary content must have .png extension (found ${ext}).`
      };
    }
    return {
      valid: true,
      sanitizedFilename: sanitized,
      detectedMime: 'image/png',
      detectedCategory: 'chart_screenshot'
    };
  }

  // B. JPEG Image
  if (matchesBytes(buffer, SIGNATURES.JPEG)) {
    if (!['.jpg', '.jpeg'].includes(ext)) {
      return {
        valid: false,
        sanitizedFilename: sanitized,
        detectedMime: 'image/jpeg',
        detectedCategory: 'chart_screenshot',
        error: `File extension mismatch: JPEG binary content must have .jpg or .jpeg extension (found ${ext}).`
      };
    }
    return {
      valid: true,
      sanitizedFilename: sanitized,
      detectedMime: 'image/jpeg',
      detectedCategory: 'chart_screenshot'
    };
  }

  // C. WebP Image
  if (matchesBytes(buffer, SIGNATURES.WEBP_RIFF) && buffer.length > 12 && buffer.toString('ascii', 8, 12) === 'WEBP') {
    if (ext !== '.webp') {
      return {
        valid: false,
        sanitizedFilename: sanitized,
        detectedMime: 'image/webp',
        detectedCategory: 'chart_screenshot',
        error: `File extension mismatch: WebP binary content must have .webp extension (found ${ext}).`
      };
    }
    return {
      valid: true,
      sanitizedFilename: sanitized,
      detectedMime: 'image/webp',
      detectedCategory: 'chart_screenshot'
    };
  }

  // D. PDF Document
  if (matchesBytes(buffer, SIGNATURES.PDF)) {
    if (ext !== '.pdf') {
      return {
        valid: false,
        sanitizedFilename: sanitized,
        detectedMime: 'application/pdf',
        detectedCategory: 'pdf_report',
        error: `File extension mismatch: PDF document must have .pdf extension (found ${ext}).`
      };
    }
    return {
      valid: true,
      sanitizedFilename: sanitized,
      detectedMime: 'application/pdf',
      detectedCategory: 'pdf_report'
    };
  }

  // E. Modern Office OpenXML (.xlsx / .docx)
  if (matchesBytes(buffer, SIGNATURES.ZIP_PK)) {
    if (ext === '.xlsx') {
      return {
        valid: true,
        sanitizedFilename: sanitized,
        detectedMime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        detectedCategory: 'xlsx_journal'
      };
    }
    if (ext === '.docx') {
      return {
        valid: true,
        sanitizedFilename: sanitized,
        detectedMime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        detectedCategory: 'research_notes'
      };
    }
    return {
      valid: false,
      sanitizedFilename: sanitized,
      detectedMime: 'application/zip',
      detectedCategory: 'research_notes',
      error: 'Raw ZIP archives are disallowed. Only formatted spreadsheets (.xlsx) and documents (.docx) are permitted.'
    };
  }

  // F. CSV & Plain Text
  if (['.csv', '.txt'].includes(ext)) {
    // Check for high density of null/binary control bytes
    const sample = buffer.slice(0, Math.min(buffer.length, 4096));
    let nonPrintable = 0;
    for (let i = 0; i < sample.length; i++) {
      const b = sample[i];
      if (b === 0 || (b < 32 && b !== 9 && b !== 10 && b !== 13)) {
        nonPrintable++;
      }
    }
    if (nonPrintable > 5) {
      return {
        valid: false,
        sanitizedFilename: sanitized,
        detectedMime: 'application/octet-stream',
        detectedCategory: 'research_notes',
        error: 'Invalid plain text file: Corrupted or binary control characters found in text stream.'
      };
    }

    return {
      valid: true,
      sanitizedFilename: sanitized,
      detectedMime: ext === '.csv' ? 'text/csv' : 'text/plain',
      detectedCategory: ext === '.csv' ? 'csv_data' : 'research_notes'
    };
  }

  return {
    valid: false,
    sanitizedFilename: sanitized,
    detectedMime: 'application/octet-stream',
    detectedCategory: 'research_notes',
    error: `Unsupported file type (${ext}). Permitted formats: PNG, JPG, WebP, PDF, CSV, TXT, XLSX, DOCX.`
  };
}
