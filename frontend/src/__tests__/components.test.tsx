import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../components/ui/button';

describe('Component Tests', () => {
  it('should have a passing test', () => {
    expect(true).toBe(true);
  });

  it('should render Button component', () => {
    const { container } = render(<Button>Test Button</Button>);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('should apply correct variant classes', () => {
    const { container } = render(<Button variant="dnd">D&D Button</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-red-700');
  });
});
