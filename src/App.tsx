import './App.css'
import { useEffect, useState } from 'react';
import { useProjectStore } from './state/projectStore';
import Setup from './setup';

function App() {
  const { getProject, project } = useProjectStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProject = async () => {
      try {
        await getProject('myProject');
        // If successful, navigate to the editor page (not implemented yet)
        setLoading(false); // Assuming success means we don't need setup
      } catch (error) {
        console.error('Failed to get project:', error);
        setLoading(false); // Allow rendering setup if project not found
      }
    };

    checkProject();
  }, [getProject]);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }
  return (
    <>
      <header>
        <h1>Drag and Drop Next JS App Builder</h1>
      </header>
      {project ? (
        <div>{/* Editor page content will go here */}</div>
      ) : (
        <Setup />
      )}
    </>
  )
}

export default App