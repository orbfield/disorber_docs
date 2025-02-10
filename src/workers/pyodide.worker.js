// Web Worker for Pyodide
self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js');

let pyodide = null;

async function initializePyodide() {
  pyodide = await loadPyodide();
  await pyodide.loadPackage(['numpy', 'pandas', 'panel', 'bokeh', 'datashader']);
  self.postMessage({ type: 'ready' });
}

self.onmessage = async (event) => {
  const { type, code, id } = event.data;
  
  if (type === 'init') {
    try {
      await initializePyodide();
    } catch (error) {
      self.postMessage({ type: 'error', error: error.message });
    }
    return;
  }

  if (!pyodide) {
    self.postMessage({ 
      type: 'error', 
      error: 'Pyodide not initialized',
      id 
    });
    return;
  }

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

// Initialize immediately
initializePyodide();
