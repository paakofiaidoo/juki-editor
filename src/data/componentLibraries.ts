import { ComponentLibrary, ElementCanvasItem } from '../types';

const htmlElementsLibrary: ComponentLibrary = {
    name: 'HTML Elements',
    categories: [
        {
            name: 'Layout',
            items: [
                { id: 'el-div', name: 'Container', description: 'A generic div container.', item: { type: 'ELEMENT', tag: 'div', props: { className: 'p-4 border border-dashed border-gray-500 min-h-[50px]' }, content: [] } },
            ]
        },
        {
            name: 'Typography',
            items: [
                { id: 'el-h1', name: 'Heading 1', description: 'A large heading.', item: { type: 'ELEMENT', tag: 'h1', props: { className: 'text-4xl font-bold text-[var(--juki-color-text)] font-[var(--juki-font-heading)]' }, content: 'Heading 1' } },
                { id: 'el-p', name: 'Paragraph', description: 'A paragraph of text.', item: { type: 'ELEMENT', tag: 'p', props: { className: 'my-2 text-[var(--juki-color-text)] font-[var(--juki-font-body)]' }, content: 'This is a paragraph.' } },
            ]
        },
        {
            name: 'Media',
            items: [
                { id: 'el-img', name: 'Image', description: 'An image element.', item: { type: 'ELEMENT', tag: 'img', props: { className: 'w-full h-auto', src: 'https://picsum.photos/400/300', alt: 'Placeholder' } } },
            ]
        },
    ]
};

const shadcnLibrary: ComponentLibrary = {
    name: 'Shadcn',
    categories: [
        {
            name: 'Buttons',
            items: [
                { id: 'shd-btn-default', name: 'Default', description: 'Default button style.', item: { type: 'ELEMENT', tag: 'button', props: { className: 'h-10 px-4 py-2 bg-slate-900 text-slate-50 hover:bg-slate-900/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors' }, content: 'Button' } },
                { id: 'shd-btn-destructive', name: 'Destructive', description: 'For dangerous actions.', item: { type: 'ELEMENT', tag: 'button', props: { className: 'h-10 px-4 py-2 bg-red-500 text-slate-50 hover:bg-red-500/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors' }, content: 'Destructive' } },
                { id: 'shd-btn-outline', name: 'Outline', description: 'An outlined button.', item: { type: 'ELEMENT', tag: 'button', props: { className: 'h-10 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors' }, content: 'Outline' } },
                { id: 'shd-btn-secondary', name: 'Secondary', description: 'A less prominent button.', item: { type: 'ELEMENT', tag: 'button', props: { className: 'h-10 px-4 py-2 bg-slate-100 text-slate-900 hover:bg-slate-100/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors' }, content: 'Secondary' } },
                { id: 'shd-btn-ghost', name: 'Ghost', description: 'For minimal emphasis.', item: { type: 'ELEMENT', tag: 'button', props: { className: 'h-10 px-4 py-2 hover:bg-slate-100 hover:text-slate-900 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors' }, content: 'Ghost' } },
                { id: 'shd-btn-link', name: 'Link', description: 'A button styled as a link.', item: { type: 'ELEMENT', tag: 'button', props: { className: 'h-10 px-4 py-2 text-slate-900 underline-offset-4 hover:underline inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors' }, content: 'Link' } },
            ]
        },
        {
            name: 'Forms',
            items: [
                { id: 'shd-form-input', name: 'Input', description: 'A standard form input field.', item: { type: 'ELEMENT', tag: 'input', props: { className: 'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black', placeholder: 'Enter text...' } } },
                { id: 'shd-form-label', name: 'Label', description: 'A label for form inputs.', item: { type: 'ELEMENT', tag: 'label', props: { className: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black' }, content: 'Label' } },
                { id: 'shd-form-textarea', name: 'Textarea', description: 'A multi-line text input.', item: { type: 'ELEMENT', tag: 'textarea', props: { className: 'flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black', placeholder: 'Type your message here.' } } },
            ]
        },
        {
            name: 'Feedback',
            items: [
                 { id: 'shd-feedback-alert', name: 'Alert', description: 'Displays a callout for users.', item: { type: 'ELEMENT', tag: 'div', props: { className: 'relative w-full rounded-lg border border-slate-200 p-4 text-slate-950' }, content: [
                    { id: crypto.randomUUID(), name: 'Alert Title', type: 'ELEMENT', tag: 'h5', props: { className: 'mb-1 font-medium leading-none tracking-tight text-black' }, content: 'Heads up!' } as ElementCanvasItem,
                    { id: crypto.randomUUID(), name: 'Alert Description', type: 'ELEMENT', tag: 'div', props: { className: 'text-sm text-slate-600' }, content: 'You can add components to your page.' } as ElementCanvasItem,
                 ] } },
                 { id: 'shd-feedback-alert-destructive', name: 'Alert (Destructive)', description: 'For errors or destructive actions.', item: { type: 'ELEMENT', tag: 'div', props: { className: 'relative w-full rounded-lg border border-red-500/50 text-red-500 p-4' }, content: [
                    { id: crypto.randomUUID(), name: 'Alert Title', type: 'ELEMENT', tag: 'h5', props: { className: 'mb-1 font-medium leading-none tracking-tight text-red-500' }, content: 'Error' } as ElementCanvasItem,
                    { id: crypto.randomUUID(), name: 'Alert Description', type: 'ELEMENT', tag: 'div', props: { className: 'text-sm text-red-500/80' }, content: 'Your session has expired. Please log in again.' } as ElementCanvasItem,
                 ] } },
                 { id: 'shd-feedback-badge', name: 'Badge', description: 'A small badge for info.', item: { type: 'ELEMENT', tag: 'div', props: { className: 'inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 text-black' }, content: 'Badge' } },
            ]
        }
    ]
};


export const componentLibraries: ComponentLibrary[] = [
    htmlElementsLibrary,
    shadcnLibrary,
];