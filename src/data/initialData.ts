import { Project, Theme } from '../types';

export const defaultTheme: Theme = {
  colors: {
    primary: '#00f2a1',
    secondary: '#24282e',
    accent: '#30363d',
    text: '#ffffff',
    background: '#1a1d21',
  },
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
  },
  importedFonts: [],
};

export const initialProject: Project = {
  id: 'proj_1',
  name: 'My Juki Project',
  description: 'A new project created with Juki Editor.',
  settings: { useTypescript: true, framework: "NextJS" },
  theme: defaultTheme,
  packageManager: null,
  packages: [],
  rootRoute: {
    id: 'root',
    name: 'Root',
    segment: '/',
    fullPath: '/',
    type: 'STATIC',
    children: []
  },
  pages: [
    {
      id: 'page_1',
      name: 'Home',
      description: 'The main landing page.',
      route: '/',
      props: { className: "min-h-screen bg-[var(--juki-color-background)]" },
      children: [
        {
          id: crypto.randomUUID(),
          name: 'Hero Section',
          type: 'ELEMENT',
          tag: 'div',
          props: { className: 'w-full bg-[var(--juki-color-secondary)] p-12 text-center' },
          content: [
            { id: crypto.randomUUID(), name: 'Main Heading', type: 'ELEMENT', tag: 'h1', props: { className: 'text-5xl font-bold text-[var(--juki-color-text)] font-[var(--juki-font-heading)]' }, content: 'Welcome to Juki Editor' },
            { id: crypto.randomUUID(), name: 'Subheading', type: 'ELEMENT', tag: 'p', props: { className: 'text-xl text-[var(--juki-color-text)]/80 mt-4 font-[var(--juki-font-body)]' }, content: 'Build your UI visually.' },
          ]
        },
      ],
    }
  ],
  userComponents: [],
  modules: [],
  templates: [],
  layouts: [],
  assetLibrary: [],
  apiDefinitions: [],
  stateDefinitions: [],
};