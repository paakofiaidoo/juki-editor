import { parseNextJsProjectStructure } from './nextJsStructure';

const sampleInputs = [
    {
        id: 'layout1',
        name: 'layout',
        route: '/',
        path: 'app/layout.tsx',
        rawContent: `<div>Layout</div>`,
    },
    {
        id: 'page1',
        name: 'home',
        route: '/',
        path: 'app/page.tsx',
        rawContent: `<p>Page</p>`,
    },
];

const result = parseNextJsProjectStructure(sampleInputs);
console.log(JSON.stringify(result, null, 2));
