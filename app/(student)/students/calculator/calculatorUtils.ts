// calculatorUtils.ts
// Utility functions for calculator operations

/**
 * Calculate factorial of a number
 * @param n - Non-negative integer
 * @returns The factorial value
 */
export const factorial = (n: number): number => {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Invalid input for factorial");
  }
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

/**
 * Handle calculus operations (symbolic representation)
 * @param operation - Type of calculus operation ('derivative', 'integral', 'limit')
 * @param expression - Mathematical expression
 * @returns Result as string (symbolic representation)
 */
export const handleCalculusOperation = (
  operation: string,
  expression: string,
): string => {
  try {
    // Clean up the expression
    const cleanExpression = expression
      .replace(/π/g, "pi")
      .replace(/√/g, "sqrt");

    // Return symbolic representation based on operation type
    switch (operation) {
      case "derivative":
        return `d/dx(${cleanExpression})`;
      case "integral":
        return `∫(${cleanExpression})dx`;
      case "limit":
        return `lim x→∞ ${cleanExpression}`;
      default:
        throw new Error("Unknown calculus operation");
    }
  } catch (error) {
    console.error("Calculus operation error:", error);
    return "Error";
  }
};

/**
 * Handle geometry operations with numeric results
 * @param operation - Type of geometry operation
 * @param value - Input value (e.g., radius for circle)
 * @returns Calculated numeric result
 */
export const handleGeometryOperation = (
  operation: string,
  value: number,
): number => {
  switch (operation) {
    case "circle-area":
      return Math.PI * value * value; // πr²
    case "circle-circumference":
      return 2 * Math.PI * value; // 2πr
    case "sphere-volume":
      return (4 / 3) * Math.PI * Math.pow(value, 3); // (4/3)πr³
    case "sphere-surface-area":
      return 4 * Math.PI * value * value; // 4πr²
    case "cube-volume":
      return Math.pow(value, 3); // a³
    case "cube-surface-area":
      return 6 * value * value; // 6a²
    default:
      throw new Error("Unknown geometry operation");
  }
};

/**
 * Format a number for display
 * @param value - Number to format
 * @param precision - Precision to use (default: 10)
 * @returns Formatted string
 */
export const formatNumber = (value: number, precision: number = 10): string => {
  return parseFloat(value.toPrecision(precision)).toString();
};
