// ============================================================
// CMS SDK — registerComponent
// Developer-facing API for registering new React components
// into the CMS component registry at runtime.
// ============================================================

import type { ComponentType } from 'react';
import type { CMSSectionProps } from '../cms/types';
import { registerComponent, isRegistered } from '../cms/ComponentRegistry';

export type PropType = 'string' | 'number' | 'boolean' | 'color' | 'image' | 'url' | 'select' | 'richtext' | 'json';

export interface PropSchema {
  type: PropType;
  label: string;
  default?: any;
  required?: boolean;
  options?: { label: string; value: string }[];  // for 'select' type
  description?: string;
}

export interface StyleOption {
  backgroundColor?: boolean;
  textColor?: boolean;
  padding?: boolean;
  margin?: boolean;
  borderRadius?: boolean;
  maxWidth?: boolean;
  backgroundImage?: boolean;
  className?: boolean;
}

export interface ComponentDefinition {
  /** Unique type key used in CMS and ComponentRegistry */
  name: string;
  /** Human-readable label for Filament UI */
  label?: string;
  /** Description shown in the CMS page builder */
  description?: string;
  /** The React component to render */
  component: ComponentType<CMSSectionProps>;
  /** JSON schema defining editable props */
  propsSchema?: Record<string, PropSchema>;
  /** Default prop values */
  defaultProps?: Record<string, any>;
  /** Allowed child component types (for nested blocks) */
  allowedChildren?: string[];
  /** Which style controls to expose in the CMS */
  styleOptions?: StyleOption;
  /** Whether this component can be used at the top level */
  isTopLevel?: boolean;
}

// Runtime component definition registry (for introspection)
const componentDefinitions: Map<string, ComponentDefinition> = new Map();

/**
 * Register a new frontend component into the CMS system.
 *
 * @example
 * registerCMSComponent({
 *   name: 'my_banner',
 *   label: 'My Custom Banner',
 *   component: MyBannerComponent,
 *   propsSchema: {
 *     title: { type: 'string', label: 'Title', default: 'Hello' },
 *     image: { type: 'image', label: 'Background Image' },
 *   },
 *   defaultProps: { title: 'Hello World' },
 *   styleOptions: { backgroundColor: true, textColor: true },
 * });
 */
export function registerCMSComponent(definition: ComponentDefinition): void {
  if (isRegistered(definition.name)) {
    console.warn(`[CMS SDK] Component "${definition.name}" is already registered. Overwriting.`);
  }

  // Register with the component registry for rendering
  registerComponent(definition.name, definition.component);

  // Store full definition for introspection
  componentDefinitions.set(definition.name, definition);

  if (import.meta.env?.DEV) {
    console.log(`[CMS SDK] Registered component: "${definition.name}"`);
  }
}

/**
 * Get the full definition for a registered component.
 */
export function getComponentDefinition(name: string): ComponentDefinition | undefined {
  return componentDefinitions.get(name);
}

/**
 * Get all registered component definitions.
 */
export function getAllComponentDefinitions(): ComponentDefinition[] {
  return Array.from(componentDefinitions.values());
}

/**
 * Get the props schema for a component type.
 */
export function getPropsSchema(name: string): Record<string, PropSchema> {
  return componentDefinitions.get(name)?.propsSchema ?? {};
}

/**
 * Get default props for a component type.
 */
export function getDefaultProps(name: string): Record<string, any> {
  return componentDefinitions.get(name)?.defaultProps ?? {};
}

export { registerComponent } from '../cms/ComponentRegistry';
