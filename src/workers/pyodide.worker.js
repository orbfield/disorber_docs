// Web Worker for Pyodide
self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js');

let pyodide = null;

// Initialize Pyodide with required packages
async function initializePyodide() {
  try {
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/'
    });
    
    // First load core dependencies
    await pyodide.loadPackage(['micropip']);
    const micropip = pyodide.pyimport('micropip');

    // Load Panel and its dependencies in the correct order
    await micropip.install([
      'https://cdn.holoviz.org/panel/1.6.0/dist/wheels/bokeh-3.6.2-py3-none-any.whl',
      'https://cdn.holoviz.org/panel/1.6.0/dist/wheels/panel-1.6.0-py3-none-any.whl'
    ]);

    // Load additional packages needed for visualization
    await pyodide.loadPackage([
      'numpy',
      'pandas'
    ]);

    // Initialize Panel's JS dependencies
    await pyodide.runPythonAsync(`
      import panel as pn
      pn.extension()
    `);
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
