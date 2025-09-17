import { add, multiply, divide } from '../math';
import { describe, it, expect } from 'vitest';

describe('Math utilities', () => {
  describe('add', () => {
    it('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('adds positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });

    it('adds zero', () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('multiplies two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('multiplies by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it('multiplies negative numbers', () => {
      expect(multiply(-2, -3)).toBe(6);
    });
  });

  describe('divide', () => {
    it('divides two positive numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('throws error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });

    it('handles negative numbers', () => {
      expect(divide(-10, 2)).toBe(-5);
    });
  });
});