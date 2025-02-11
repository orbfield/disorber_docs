// Web Worker for Pyodide
self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js');
let pyodideReadyPromise = loadPyodide();

self.onmessage = async (event) => {
  // Make sure loading is done
  const pyodide = await pyodideReadyPromise;
  const { id, python, context } = event.data;
  
  try {
    // Load minimal required packages
    await pyodide.loadPackage(['numpy']);
    await pyodide.loadPackage("micropip");
    
    // Install only Panel and Bokeh
    await pyodide.runPythonAsync(`
      import micropip
      await micropip.install(['bokeh', 'panel'])
    `);

    // Initialize Panel with Bokeh backend
    await pyodide.runPythonAsync(`
      import panel as pn
      import bokeh
      # Initialize with Bokeh backend
      pn.extension('bokeh', sizing_mode='stretch_width')
    `);
    
    // Convert context to Python dictionary
    const globals = pyodide.toPy(context || {});
   
    // Execute the python code in this context
    console.log('Executing Python code...');
    let result;
    try {
      result = await pyodide.runPythonAsync(python, { globals });
      console.log('Python code executed successfully');
    } catch (err) {
      console.error('Python execution error:', err);
      throw err;
    }
    
    // Handle Panel objects specifically
    if (result && result._repr_html_) {
      result = result._repr_html_();
    }
   
    // Send the result back
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