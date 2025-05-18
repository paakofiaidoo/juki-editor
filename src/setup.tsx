import React from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import {useProjectStore, Project} from './state/projectStore'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from './components/ui/form'
import {Input} from './components/ui/input'
import {Button} from './components/ui/button'
import {Textarea} from './components/ui/textarea'
import {zodResolver} from "@hookform/resolvers/zod"
import {Checkbox} from "@/components/ui/checkbox"

import {z} from "zod";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "description must be at least 2 characters.",
    }),
    framework: z.string().min(2, {
        message: "framework must be at least 2 characters.",
    }),
    nextJSConfig: z.object({
        useTypeScript: z.boolean(),
        useESLint: z.boolean(),
        useTailwindCSS: z.boolean(),
        useSrcDirectory: z.boolean(),
        useAppRouter: z.boolean(),
        useTurbopack: z.boolean(),
        customizeImportAlias: z.boolean(),
        importAlias: z.string().min(2, {
            message: "importAlias must be at least 2 characters.",
        }),
    })
})

const Setup: React.FC = () => {
    // const {  handleSubmit, formState: { errors } } = useForm();
    const createProject = useProjectStore((state) => state.createProject);
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createProject((values as unknown as Project));
            navigate('/editor');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1>Create a New Project</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel htmlFor="name">Name:</FormLabel>
                                <FormControl>
                                    <Input id="name" {...field} />
                                </FormControl>
                                <FormMessage/>

                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel htmlFor="description">Description:</FormLabel>
                                <FormControl>
                                    <Textarea id="description" {...field} />
                                </FormControl>
                                <FormMessage/>

                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="framework"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel htmlFor="framework">Framework:</FormLabel>
                                <FormControl>
                                    <Input id="framework" {...field} />
                                </FormControl>
                                <FormMessage/>

                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nextJSConfig.useTypeScript"
                        render={({field}) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel htmlFor="useTypeScript">Use TypeScript:</FormLabel>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nextJSConfig.useESLint"
                        render={({field}) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel htmlFor="useESLint">Use ESLint:</FormLabel>
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="nextJSConfig.importAlias"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel htmlFor="importAlias">Import Alias:</FormLabel>
                                <FormControl>
                                    <Input id="importAlias" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Create Project</Button>
                </form>
            </Form>
        </div>
    );
};

export default Setup;