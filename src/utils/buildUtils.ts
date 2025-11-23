import JSZip from 'jszip';
import saveAs from 'file-saver';
import { Project, Page } from '../types';
import { generatePageComponent, generateUserComponentFile } from './jsxGenerator';

const generatePackageJson = (project: Project): string => {
    const dependencies: Record<string, string> = {
        "react": "^18",
        "react-dom": "^18",
        "next": "14.2.4",
        "lucide-react": "^0.395.0" // A common version
    };
    project.packages.forEach(pkg => {
        dependencies[pkg.name] = pkg.version || 'latest';
    });

    const packageJson = {
        name: project.name.toLowerCase().replace(/\s/g, '-'),
        version: "0.1.0",
        private: true,
        scripts: {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint"
        },
        dependencies,
        devDependencies: {
            "postcss": "^8",
            "tailwindcss": "^3.4.1",
            "eslint": "^8",
            "eslint-config-next": "14.2.4"
        }
    };
    return JSON.stringify(packageJson, null, 2);
};

const generateTailwindConfig = (project: Project): string => {
    const { theme } = project;
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '${theme.colors.primary}',
        'secondary': '${theme.colors.secondary}',
        'accent': '${theme.colors.accent}',
        'text': '${theme.colors.text}',
        'background': '${theme.colors.background}',
      },
      fontFamily: {
        body: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
      }
    },
  },
  plugins: [],
};
`;
};

const generateGlobalsCss = (project: Project): string => {
    const { theme } = project;
    const fontImports = theme.importedFonts.map(font => `@import url('${font.url}');`).join('\n');
    
    return `${fontImports}
@tailwind base;
@tailwind utilities;
@tailwind components;

:root {
  --font-body: ${theme.fonts.body};
  --font-heading: ${theme.fonts.heading};
}

body {
  color: ${theme.colors.text};
  background: ${theme.colors.background};
  font-family: var(--font-body);
}
`;
};

const generateLayoutFile = (project: Project): string => {
    return `import './globals.css';

export const metadata = {
  title: '${project.name}',
  description: '${project.description}',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
};

const sanitizeRoute = (route: string): string => {
    if (route === '/') return 'page';
    return route.replace(/^\//, '').replace(/\/$/, '') + '/page';
}

export const exportProjectAsZip = async (project: Project) => {
    const zip = new JSZip();

    // Root files
    zip.file('package.json', generatePackageJson(project));
    zip.file('tailwind.config.js', generateTailwindConfig(project));
    zip.file('.gitignore', 'node_modules\n.next\nout\n.env.local');

    // App directory and core files
    const app = zip.folder('app');
    if (!app) return;
    app.file('layout.tsx', generateLayoutFile(project));
    app.file('globals.css', generateGlobalsCss(project));

    // Pages
    project.pages.forEach(page => {
        const routePath = sanitizeRoute(page.route);
        app.file(`${routePath}.tsx`, generatePageComponent(page, project));
    });

    // Components
    const components = zip.folder('components');
    if (!components) return;
    project.userComponents.forEach(component => {
        const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');
        components.file(`${componentName}.tsx`, generateUserComponentFile(component, project));
    });

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    const projectName = project.name.toLowerCase().replace(/\s/g, '-');
    saveAs(content, `${projectName}.zip`);
};