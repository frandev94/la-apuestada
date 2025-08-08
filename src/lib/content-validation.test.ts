import { describe, expect, it } from 'vitest';
import {
  cleanText,
  containsInappropriateContent,
  sanitizeText,
  validateUserInput,
  validateUserName,
} from './content-validation';

describe('Content Validation', () => {
  describe('containsInappropriateContent', () => {
    it('should detect inappropriate Spanish content', () => {
      expect(containsInappropriateContent('mi culo huele mal')).toBe(true);
      expect(containsInappropriateContent('esto es una mierda')).toBe(true);
      expect(containsInappropriateContent('CULO')).toBe(true); // case insensitive
    });

    it('should detect inappropriate English content', () => {
      expect(containsInappropriateContent('this is shit')).toBe(true);
      expect(containsInappropriateContent('you are an idiot')).toBe(true);
    });

    it('should allow appropriate content', () => {
      expect(containsInappropriateContent('Hola amigos de La Velada')).toBe(
        false,
      );
      expect(containsInappropriateContent('Buena suerte en los combates')).toBe(
        false,
      );
      expect(containsInappropriateContent('¡Vamos que se puede!')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(containsInappropriateContent('')).toBe(false);
      // biome-ignore lint/suspicious/noExplicitAny: Testing edge cases with invalid types
      expect(containsInappropriateContent(null as any)).toBe(false);
      // biome-ignore lint/suspicious/noExplicitAny: Testing edge cases with invalid types
      expect(containsInappropriateContent(undefined as any)).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    it('should replace inappropriate words with asterisks', () => {
      expect(sanitizeText('mi culo huele mal')).toBe('mi **** *********');
      expect(sanitizeText('esto es una mierda')).toBe('esto es una ******');
    });

    it('should maintain original text structure', () => {
      expect(sanitizeText('Hola mundo')).toBe('Hola mundo');
    });

    it('should handle edge cases', () => {
      expect(sanitizeText('')).toBe('');
      // biome-ignore lint/suspicious/noExplicitAny: Testing edge cases with invalid types
      expect(sanitizeText(null as any)).toBe(null);
      // biome-ignore lint/suspicious/noExplicitAny: Testing edge cases with invalid types
      expect(sanitizeText(undefined as any)).toBe(undefined);
    });
  });

  describe('validateUserInput', () => {
    it('should validate clean input', () => {
      const input = {
        name: 'Juan Pérez',
        message: 'Buena suerte en La Velada',
        comment: 'Excelente evento',
      };

      const result = validateUserInput(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitized).toEqual(input);
    });

    it('should detect inappropriate content in name', () => {
      const input = {
        name: 'usuario mierda',
        message: 'Hola mundo',
      };

      const result = validateUserInput(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'El nombre contiene contenido inapropiado',
      );
      expect(result.sanitized.name).toBe('usuario ******');
    });

    it('should detect inappropriate content in message', () => {
      const input = {
        name: 'Juan',
        message: 'esto es una mierda',
      };

      const result = validateUserInput(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'El mensaje contiene contenido inapropiado',
      );
      expect(result.sanitized.message).toBe('esto es una ******');
    });

    it('should handle multiple inappropriate fields', () => {
      const input = {
        name: 'idiota',
        message: 'mierda',
        comment: 'shit',
      };

      const result = validateUserInput(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('cleanText', () => {
    it('should normalize whitespace', () => {
      expect(cleanText('  hello   world  ')).toBe('hello world');
      expect(cleanText('multiple\n\nlines')).toBe('multiple lines');
    });

    it('should remove unsafe characters', () => {
      expect(cleanText('hello<script>alert("hack")</script>world')).toBe(
        'helloscriptalerthackscriptworld',
      );
    });

    it('should preserve Spanish characters', () => {
      expect(cleanText('Hola niños, ¿cómo están?')).toBe(
        'Hola niños, ¿cómo están?',
      );
    });

    it('should limit text length', () => {
      const longText = 'a'.repeat(600);
      expect(cleanText(longText)).toHaveLength(500);
    });

    it('should handle edge cases', () => {
      expect(cleanText('')).toBe('');
      // biome-ignore lint/suspicious/noExplicitAny: Testing edge cases with invalid types
      expect(cleanText(null as any)).toBe(null);
      // biome-ignore lint/suspicious/noExplicitAny: Testing edge cases with invalid types
      expect(cleanText(undefined as any)).toBe(undefined);
    });
  });

  describe('validateUserName', () => {
    it('should validate good names', () => {
      const result = validateUserName('Juan Pérez');

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.sanitizedName).toBe('Juan Pérez');
    });

    it('should reject empty names', () => {
      const result = validateUserName('');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El nombre es requerido');
    });

    it('should reject short names', () => {
      const result = validateUserName('a');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El nombre debe tener al menos 2 caracteres');
    });

    it('should reject long names', () => {
      const longName = 'a'.repeat(60);
      const result = validateUserName(longName);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'El nombre no puede tener más de 50 caracteres',
      );
      expect(result.sanitizedName).toHaveLength(50);
    });

    it('should reject inappropriate names', () => {
      const result = validateUserName('mi culo');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El nombre contiene contenido inapropiado');
      expect(result.sanitizedName).toBe('mi ****');
    });

    it('should handle edge cases', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Testing edge cases with invalid types
      expect(validateUserName(null as any).isValid).toBe(false);
      // biome-ignore lint/suspicious/noExplicitAny: Testing edge cases with invalid types
      expect(validateUserName(undefined as any).isValid).toBe(false);
    });
  });
});
