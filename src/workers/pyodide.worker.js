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
    
    // Make a Python dictionary with the data from context
    const globals = pyodide.globals.get("dict")(Object.entries(context || {}));
    
    // Execute the python code in this context
    let result = await pyodide.runPythonAsync(python, { globals });
    
    // Convert result to JavaScript object
    try {
      result = result.toJs();
    } catch (e) {
      // If toJs() fails, try getting the object directly
      result = result;
    }
    
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
