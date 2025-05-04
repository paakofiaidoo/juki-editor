import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useProjectStore, Project } from '../state/projectStore';

interface FormData extends Project {}

const Setup: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const createProject = useProjectStore((state) => state.createProject);
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await createProject(data);
      router.push('/editor');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div>
      <h1>Create a New Project</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" {...register('name', { required: true })} />
          {errors.name && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" {...register('description', { required: true })} />
          {errors.description && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="framework">Framework:</label>
          <input type="text" id="framework" {...register('framework', { required: true })} />
          {errors.framework && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="useTypeScript">Use TypeScript:</label>
          <input type="checkbox" id="useTypeScript" {...register('nextJSConfig.useTypeScript')} />
        </div>
        <div>
          <label htmlFor="useESLint">Use ESLint:</label>
          <input type="checkbox" id="useESLint" {...register('nextJSConfig.useESLint')} />
        </div>
        <div>
          <label htmlFor="useTailwindCSS">Use TailwindCSS:</label>
          <input type="checkbox" id="useTailwindCSS" {...register('nextJSConfig.useTailwindCSS')} />
        </div>
        <div>
          <label htmlFor="useSrcDirectory">Use Src Directory:</label>
          <input type="checkbox" id="useSrcDirectory" {...register('nextJSConfig.useSrcDirectory')} />
        </div>
        <div>
          <label htmlFor="useAppRouter">Use App Router:</label>
          <input type="checkbox" id="useAppRouter" {...register('nextJSConfig.useAppRouter')} />
        </div>
        <div>
          <label htmlFor="useTurbopack">Use Turbopack:</label>
          <input type="checkbox" id="useTurbopack" {...register('nextJSConfig.useTurbopack')} />
        </div>
        <div>
          <label htmlFor="customizeImportAlias">Customize Import Alias:</label>
          <input type="checkbox" id="customizeImportAlias" {...register('nextJSConfig.customizeImportAlias')} />
        </div>
        <div>
          <label htmlFor="importAlias">Import Alias:</label>
          <input type="text" id="importAlias" {...register('nextJSConfig.importAlias')} />
        </div>

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default Setup;