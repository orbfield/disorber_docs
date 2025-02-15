// Web Worker for Pyodide
self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js');

let pyodideReadyPromise = (async function() {
  try {
    console.log('Loading Pyodide from CDN...');
    const pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
      
      stderr: (text) => console.error('Python stderr:', text)
    });
    console.log('Pyodide loaded successfully');
    return pyodide;
  } catch (error) {
    console.error('Failed to load Pyodide:', error);
    throw error;
  }
})();

let installedPackages = new Set();

async function installPackage(pyodide, packages) {
  if (!Array.isArray(packages)) packages = [packages];
  const packagesToInstall = packages.filter(pkg => !installedPackages.has(pkg));
  if (packagesToInstall.length === 0) return;

  try {
    if (!installedPackages.has('micropip')) {
      await pyodide.loadPackage('micropip');
      installedPackages.add('micropip');
    }

    await pyodide.runPythonAsync(`
      import micropip
      await micropip.install(${JSON.stringify(packagesToInstall)})
    `);

    packagesToInstall.forEach(pkg => installedPackages.add(pkg));
  } catch (err) {
    console.error('Package installation error:', err);
    throw err;
  }
}

async function initializePanel(pyodide) {
  if (!installedPackages.has('panel')) {
    await pyodide.loadPackage(['numpy']);
    await installPackage(pyodide, [
      'bokeh',
      'packaging',
      'jinja2',
      'pillow',
      'panel',
      'param',
      'markdown',
      'pyct'
    ]);

    await pyodide.runPythonAsync(`
      import sys
      import param
      import panel as pn
      import bokeh.plotting
      from bokeh.resources import INLINE
      
      bokeh.plotting.reset_output()
      pn.config.sizing_mode = 'stretch_width'
      pn.config.console_output = 'disable'
      
      try:
          pn.extension(
              notifications=False,
              loading_spinner=False,
              loading_indicator=False,
              inline=True
          )
      except Exception as e:
          print(f"Panel extension error: {str(e)}")
          raise

      print("Panel initialization complete")
      print("Available packages:")
      help('modules')
    `);
  }
}

self.onmessage = async (event) => {
  try {
    const pyodide = await pyodideReadyPromise;
    if (!event.data?.python) throw new Error('No Python code provided');
    
    const { id, python, context, packages } = event.data;
    
    if (packages) await installPackage(pyodide, packages);
    if (python.includes('panel')) await initializePanel(pyodide);
    
    await pyodide.loadPackagesFromImports(python);
    
    const result = await pyodide.runPythonAsync(`
      try:
          exec(${JSON.stringify(python)}, globals())
          globals().get('result')
      except Exception as e:
          import traceback
          raise RuntimeError(f"Error executing Python code:\\n{traceback.format_exc()}")
    `);

    if (result) {
      let html = await pyodide.runPythonAsync(`
        import panel as pn
        
        def get_html(obj):
            try:
                if hasattr(obj, '_repr_html_'):
                    return obj._repr_html_()
                return str(obj)
            except:
                return str(obj)
                
        get_html(globals().get('result'))
      `);
      
      self.postMessage({ result: html, id, type: 'success' });
    }
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({ 
      error: error.message,
      id: event.data?.id,
      type: 'error'
    });
  }
};

pyodideReadyPromise.catch(error => {
  console.error('Pyodide initialization error:', error);
  self.postMessage({
    type: 'error',
    error: `Failed to initialize Pyodide: ${error.message}`
  });
});