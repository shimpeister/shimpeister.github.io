# 3D Viewer

Inspect an OBJ mesh directly in the browser. Drop an `.obj` file onto the viewer or choose one from your computer.

<section class="obj-viewer" aria-label="OBJ 3D viewer">
  <div class="obj-viewer__toolbar">
    <label class="obj-viewer__file-button" for="obj-file">Choose OBJ file</label>
    <input id="obj-file" type="file" accept=".obj,text/plain">
    <button id="obj-reset" type="button" title="Reset camera view">Reset view</button>
    <span id="obj-status" role="status">Waiting for an OBJ file</span>
  </div>
  <div id="obj-dropzone" class="obj-viewer__canvas">
    <div class="obj-viewer__empty">Drop your OBJ file here</div>
  </div>
</section>

The viewer supports orbiting with the mouse, panning, and zooming. The model is centered and scaled automatically when loaded.