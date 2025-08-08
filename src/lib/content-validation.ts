/**
 * Content validation and sanitization utilities
 * Helps prevent inappropriate content and maintain a safe environment
 */

/**
 * List of inappropriate words and phrases that should be filtered
 * This helps maintain a family-friendly environment for La Velada del Año
 */
const INAPPROPRIATE_WORDS = [
  // Spanish profanity and inappropriate terms
  'culo',
  'mierda',
  'joder',
  'puta',
  'puto',
  'coño',
  'cabrón',
  'gilipollas',
  'pendejo',
  'maricón',
  'idiota',
  'estúpido',
  'tonto',
  // English profanity
  'shit',
  'fuck',
  'damn',
  'ass',
  'bitch',
  'bastard',
  'idiot',
  'stupid',
  // Specific inappropriate phrases (not individual words that might be part of normal words)
  'huele mal',
  'apesta',
  'feo',
  'ugly',
];

/**
 * Check if text contains inappropriate content
 */
export function containsInappropriateContent(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const normalizedText = text.toLowerCase().trim();

  return INAPPROPRIATE_WORDS.some((word) =>
    normalizedText.includes(word.toLowerCase()),
  );
}

/**
 * Sanitize text by replacing inappropriate content with asterisks
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let sanitized = text;

  for (const word of INAPPROPRIATE_WORDS) {
    const regex = new RegExp(word, 'gi');
    const replacement = '*'.repeat(word.length);
    sanitized = sanitized.replace(regex, replacement);
  }

  return sanitized;
}

/**
 * Validate user input for appropriate content
 */
export function validateUserInput(input: {
  name?: string;
  message?: string;
  comment?: string;
}): {
  isValid: boolean;
  errors: string[];
  sanitized: typeof input;
} {
  const errors: string[] = [];
  const sanitized = { ...input };

  // Check name
  if (input.name && containsInappropriateContent(input.name)) {
    errors.push('El nombre contiene contenido inapropiado');
    sanitized.name = sanitizeText(input.name);
  }

  // Check message
  if (input.message && containsInappropriateContent(input.message)) {
    errors.push('El mensaje contiene contenido inapropiado');
    sanitized.message = sanitizeText(input.message);
  }

  // Check comment
  if (input.comment && containsInappropriateContent(input.comment)) {
    errors.push('El comentario contiene contenido inapropiado');
    sanitized.comment = sanitizeText(input.comment);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Clean text by removing extra spaces and normalizing
 */
export function cleanText(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ.,!?¡¿-]/g, '') // Keep only safe characters
    .slice(0, 500); // Limit length
}

/**
 * Validate and sanitize user name specifically
 */
export function validateUserName(name: string): {
  isValid: boolean;
  error?: string;
  sanitizedName: string;
} {
  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      error: 'El nombre es requerido',
      sanitizedName: '',
    };
  }

  const cleanedName = cleanText(name);

  if (cleanedName.length < 2) {
    return {
      isValid: false,
      error: 'El nombre debe tener al menos 2 caracteres',
      sanitizedName: cleanedName,
    };
  }

  if (cleanedName.length > 50) {
    return {
      isValid: false,
      error: 'El nombre no puede tener más de 50 caracteres',
      sanitizedName: cleanedName.slice(0, 50),
    };
  }

  if (containsInappropriateContent(cleanedName)) {
    return {
      isValid: false,
      error: 'El nombre contiene contenido inapropiado',
      sanitizedName: sanitizeText(cleanedName),
    };
  }

  return {
    isValid: true,
    sanitizedName: cleanedName,
  };
}
