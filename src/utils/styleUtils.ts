// FIX: Add missing React import to resolve "Cannot find namespace 'React'" error.
import React from 'react';

/**
 * A simple utility to get the style object from an item's props.
 * This is now the single source of truth for the Inspector UI.
 * It does not attempt to parse Tailwind classes, which makes the system more robust.
 * Direct Tailwind editing is handled by a dedicated className input field.
 * @param props The item's props object.
 * @returns A CSSProperties object.
 */
export const getElementStyles = (props: Record<string, any>): React.CSSProperties => {
  return props.style || {};
};

/**
 * Creates an updated props object with new styles.
 * It intelligently merges the new styles with any existing inline styles.
 * @param currentProps The item's current props.
 * @param newStyles The new styles to apply.
 * @returns A new props object with the updated styles.
 */
export const DANGEROUSLY_mergeStyles = (
  currentProps: Record<string, any>,
  newStyles: Partial<React.CSSProperties>
): Record<string, any> => {
  const newProps = { ...currentProps };
  const currentStyle = { ...(currentProps.style || {}) };
  
  newProps.style = { ...currentStyle, ...newStyles };
  
  return newProps;
};