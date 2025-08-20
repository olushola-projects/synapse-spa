import DOMPurify from 'dompurify';
export class SFDRValidationService {
  static validateClassificationForm(data) {
    const errors = [];
    // Fund name validation
    if (!data.fundName || data.fundName.trim().length < 2) {
      errors.push('Fund name must be at least 2 characters long');
    }
    if (data.fundName && data.fundName.length > 200) {
      errors.push('Fund name cannot exceed 200 characters');
    }
    // Description validation
    if (!data.description || data.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    if (data.description && data.description.length > 5000) {
      errors.push('Description cannot exceed 5000 characters');
    }
    // Investment strategy validation
    if (data.investmentStrategy && data.investmentStrategy.length > 2000) {
      errors.push('Investment strategy cannot exceed 2000 characters');
    }
    // ESG integration validation
    if (data.esgIntegration && !this.isValidESGIntegration(data.esgIntegration)) {
      errors.push('Invalid ESG integration description');
    }
    // Sustainability objectives validation
    if (data.sustainabilityObjectives && data.sustainabilityObjectives.length > 2000) {
      errors.push('Sustainability objectives cannot exceed 2000 characters');
    }
    // PAI validation
    if (data.principalAdverseImpacts && data.principalAdverseImpacts.length > 2000) {
      errors.push('Principal adverse impacts cannot exceed 2000 characters');
    }
    // Taxonomy alignment validation
    if (data.taxonomyAlignment && data.taxonomyAlignment.length > 2000) {
      errors.push('Taxonomy alignment cannot exceed 2000 characters');
    }
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: this.sanitizeInput(data)
    };
  }
  static sanitizeInput(data) {
    return {
      fundName: DOMPurify.sanitize(data.fundName || '', { ALLOWED_TAGS: [] }),
      description: DOMPurify.sanitize(data.description || '', { ALLOWED_TAGS: [] }),
      investmentStrategy: DOMPurify.sanitize(data.investmentStrategy || '', { ALLOWED_TAGS: [] }),
      esgIntegration: DOMPurify.sanitize(data.esgIntegration || '', { ALLOWED_TAGS: [] }),
      sustainabilityObjectives: DOMPurify.sanitize(data.sustainabilityObjectives || '', {
        ALLOWED_TAGS: []
      }),
      principalAdverseImpacts: DOMPurify.sanitize(data.principalAdverseImpacts || '', {
        ALLOWED_TAGS: []
      }),
      taxonomyAlignment: DOMPurify.sanitize(data.taxonomyAlignment || '', { ALLOWED_TAGS: [] })
    };
  }
  static isValidESGIntegration(text) {
    const esgKeywords = [
      'environmental',
      'social',
      'governance',
      'esg',
      'sustainability',
      'climate',
      'carbon',
      'green'
    ];
    return esgKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }
  static sanitizeFile(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
  }
  // File validation
  static validateFile(file) {
    const errors = [];
    const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB
    const ALLOWED_FILE_TYPES = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'text/plain'
    ];
    // File size validation
    if (file.size > FILE_SIZE_LIMIT) {
      errors.push(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the 50MB limit`);
    }
    // File type validation
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      errors.push(
        `File type "${file.type}" is not supported. Please upload PDF, DOCX, XLSX, CSV, or TXT files.`
      );
    }
    // File name validation
    if (file.name.length > 255) {
      errors.push('File name is too long (maximum 255 characters)');
    }
    // Check for potentially malicious files
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
    const hasSuspiciousExtension = suspiciousExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (hasSuspiciousExtension) {
      errors.push('This file type is not allowed for security reasons');
    }
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: this.sanitizeFile(file)
    };
  }
}
