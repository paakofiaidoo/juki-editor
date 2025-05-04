import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useProjectStore, Project } from './state/projectStore'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './components/ui/form'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'

interface FormData extends Project {}

const Setup: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const createProject = useProjectStore((state) => state.createProject);
  const router = useRouter();
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await createProject(data);
      navigate('/editor');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className=\"container mx-auto p-4\">
      <h1>Create a New Project</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className=\"space-y-4\">
        <FormField
          control={register('name', { required: 'Project name is required' })}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name:</FormLabel>
              <FormControl>
                <Input id="name" {...field} />
              </FormControl>
              <FormMessage>{errors.name?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={register('description', { required: 'Description is required' })}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Description:</FormLabel>
              <FormControl>
                <Textarea id="description" {...field} />
              </FormControl>
              <FormMessage>{errors.description?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={register('framework', { required: 'Framework is required' })}
          name="framework"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="framework">Framework:</FormLabel>
              <FormControl>
                <Input id="framework" {...field} />
              </FormControl>
              <FormMessage>{errors.framework?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={register('nextJSConfig.useTypeScript')}
          name="nextJSConfig.useTypeScript"
          render={({ field }) => (
            <FormItem className=\"flex items-center space-x-2\">
              <FormControl>
                <input type=\"checkbox\" id=\"useTypeScript\" {...field} checked={field.value} />
              </FormControl>
              <FormLabel htmlFor="useTypeScript">Use TypeScript:</FormLabel>
            </FormItem>
          )}
        />

        {/* Repeat similar FormField for other nextJSConfig boolean fields */}
        <FormField
          control={register('nextJSConfig.useESLint')}
          name="nextJSConfig.useESLint"
          render={({ field }) => (
            <FormItem className=\"flex items-center space-x-2\">
              <FormControl>
                <input type=\"checkbox\" id=\"useESLint\" {...field} checked={field.value} />
              </FormControl>
              <FormLabel htmlFor="useESLint">Use ESLint:</FormLabel>
            </FormItem>
          )}
        />

        {/* Add other nextJSConfig boolean fields here */}

        <FormField
          control={register('nextJSConfig.importAlias')}
          name="nextJSConfig.importAlias"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="importAlias">Import Alias:</FormLabel>
              <FormControl>
                <Input id="importAlias" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Create Project</Button>
      </Form>
    </div>
  );
};

export default Setup;