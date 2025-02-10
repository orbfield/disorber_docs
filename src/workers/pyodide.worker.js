// Web Worker for Pyodide
self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js');

let pyodideReadyPromise = loadPyodide();

self.onmessage = async (event) => {
  // Make sure loading is done
  const pyodide = await pyodideReadyPromise;
  const { id, python, context } = event.data;

  try {
    // Load numpy for calculations
    await pyodide.loadPackage(['numpy']);
    
    // Convert context to Python dictionary
    const globals = pyodide.toPy(context || {});
    
    // Execute the python code in this context
    let result = await pyodide.runPythonAsync(python, { globals });
    
    // Parse the JSON string into a plain JavaScript object
    result = JSON.parse(result);
    
    // Send the cloneable result back 
    self.postMessage({ result, id });
  } catch (error) {
    self.postMessage({ error: error.message, id });
  }
};

// Initialize Pyodide immediately
pyodideReadyPromise.catch(error => {
  self.postMessage({ 
    type: 'error', 
    error: `Initialization error: ${error.message}` 
  });
});
