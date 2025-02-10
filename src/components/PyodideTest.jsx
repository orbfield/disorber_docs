import React, { useEffect, useState } from 'react';

const PyodideTest = () => {
  const [output, setOutput] = useState('Loading...');
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    // Add Pyodide script to document head
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js";
    script.async = true;
    script.onload = initPyodide;
    document.head.appendChild(script);

    async function initPyodide() {
      try {
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/",
          stdout: (text) => console.log(text),
          stderr: (text) => console.error(text)
        });
        
        setPyodide(pyodide);
        console.log("Pyodide loaded successfully");
        
        await pyodide.loadPackage(['micropip']);
        console.log("Micropip loaded");
        
        const micropip = pyodide.pyimport('micropip');
        
        console.log("Installing Panel...");
        // Install Panel
        await micropip.install([
          'https://cdn.holoviz.org/panel/1.6.0/dist/wheels/panel-1.6.0-py3-none-any.whl'
        ]);
        
        console.log("Running Panel test...");
        // Run a simple Panel command
        const result = await pyodide.runPythonAsync(`
          import panel as pn
          pn.extension()
          "Panel version: " + pn.__version__
        `);
        
        setOutput(result);
      } catch (error) {
        console.error("Detailed error:", error);
        setOutput(`Error: ${error.message}`);
      }
    }

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Pyodide + Panel Test</h2>
      <pre>{output}</pre>
    </div>
  );
};

export default PyodideTest;