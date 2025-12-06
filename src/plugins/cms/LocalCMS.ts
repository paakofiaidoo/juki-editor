import { JukiPlugin, CMSCollection, IAppContext } from '../../types';
import { Database } from 'lucide-react';
import { CMSPanel } from '../../components/panels/CMSPanel';

export const LocalCMS: JukiPlugin = {
    id: 'local-mock-cms',
    name: 'Juki Local CMS',
    description: 'A simple local CMS for development and prototyping.',
    version: '1.0.0',
    icon: Database,
    author: 'Juki Team',
    type: 'cms',

    sidebarIcon: Database,
    sidebarPanel: CMSPanel,

    onInit: (context: IAppContext) => {
        // Future: Initialize mock data if needed
    },

    getCollections: async (): Promise<CMSCollection[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return [
            {
                id: 'blog-posts',
                name: 'Blog Posts',
                fields: [
                    { name: 'title', type: 'text' },
                    { name: 'content', type: 'rich-text' },
                    { name: 'coverImage', type: 'image' },
                    { name: 'author', type: 'text' },
                ],
                items: [
                    {
                        id: 'item-1',
                        data: {
                            title: 'Getting Started with Juki',
                            content: 'Juki is an amazing tool for checking out how to build UI faster.',
                            coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
                            author: 'Alice Developer',
                        },
                    },
                    {
                        id: 'item-2',
                        data: {
                            title: 'Advanced React Patterns',
                            content: 'Learn how to use composition and context effectively.',
                            coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
                            author: 'Bob Engineer',
                        },
                    },
                ],
            },
            {
                id: 'authors',
                name: 'Authors',
                fields: [
                    { name: 'name', type: 'text' },
                    { name: 'avatar', type: 'image' },
                    { name: 'bio', type: 'text' },
                ],
                items: [
                    {
                        id: 'author-1',
                        data: {
                            name: 'Alice Developer',
                            avatar: 'https://i.pravatar.cc/150?u=alice',
                            bio: 'Frontend enthusiast and Juki lover.',
                        },
                    },
                    {
                        id: 'author-2',
                        data: {
                            name: 'Bob Engineer',
                            avatar: 'https://i.pravatar.cc/150?u=bob',
                            bio: 'Backend wizard turned fullstack.',
                        },
                    },
                ],
            },
        ];
    }
};
