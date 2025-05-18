import './App.css'
import { useEffect, useState } from 'react';
import { useProjectStore } from './state/projectStore';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Setup from './setup';
import Editor from './Editor'; // Assuming you will create an Editor component

function App() {
  const { getProject, project } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [projectExists, setProjectExists] = useState(false);

  useEffect(() => {
    const checkProject = async () => {
      try {
        const fetchedProject = await getProject(''); // Call getProject with empty string
        if (fetchedProject) {
          setProjectExists(true);
        } else {
          setProjectExists(false);
        }
      } catch (error) {
        console.error('Failed to get project:', error);
        setProjectExists(false); // Assume project doesn't exist on error
      }
      setLoading(false);
    };

    checkProject().then(() => {});
  }, [getProject]);

  return (
    <>
    
      {!loading && (
        <BrowserRouter>
          <Routes>
            <Route path="/setup" element={<Setup />} />
            <Route path="/editor" element={<Editor />} /> {/* Route for the Editor */}
            <Route path="*" element={projectExists ? <Navigate to="/editor" /> : <Navigate to="/setup" />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

export default App