// Web Worker for Pyodide
self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js');

let pyodide = null;

// Initialize Pyodide with required packages
async function initializePyodide() {
  try {
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/'
    });
    
    // Load required packages for visualization
    await pyodide.loadPackage(['numpy', 'pandas', 'panel', 'bokeh', 'datashader']);
    self.postMessage({ type: 'ready' });
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      error: `Failed to initialize Pyodide: ${error.message}` 
    });
  }
}

// Handle messages from main thread
self.onmessage = async (event) => {
  const { type, code, id } = event.data;

  // Handle initialization request (though we auto-initialize)
  if (type === 'init') {
    if (!pyodide) {
      await initializePyodide();
    }
    return;
  }

  // Ensure Pyodide is initialized
  if (!pyodide) {
    self.postMessage({ 
      type: 'error', 
      error: 'Pyodide not initialized. Please wait for initialization to complete.',
      id 
    });
    return;
  }

  // Execute Python code
  try {
    const result = await pyodide.runPythonAsync(code);
    self.postMessage({ 
      type: 'result', 
      result: result,
      id 
    });
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      error: error.message,
      id 
    });
  }
};

// Initialize Pyodide immediately
initializePyodide().catch(error => {
  self.postMessage({ 
    type: 'error', 
    error: `Initialization error: ${error.message}` 
  });
});
