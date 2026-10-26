(() => {
  'use strict';
  if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;
  const $ = id => document.getElementById(id), map = structuredClone(HQData.map);
  let previewURL;
  $('editor').hidden = false;
  $('image-path').value = map.image; $('image-alt').value = map.alt;
  $('marker-service').replaceChildren(...HQData.services.map(s => new Option(s.name, s.id)));
  function exportConfig() {
    map.image = $('image-path').value.trim(); map.alt = $('image-alt').value.trim();
    $('marker-export').value = JSON.stringify(map, null, 2); $('copy-status').textContent = '';
  }
  function draw() {
    $('editor-markers').replaceChildren(...map.markers.map(marker => {
      const service = HQData.services.find(s => s.id === marker.service);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'map-marker';
      button.textContent = HQData.services.indexOf(service) + 1; button.setAttribute('aria-label', `Select ${service.name} marker`);
      button.style.left = marker.x + '%'; button.style.top = marker.y + '%';
      button.addEventListener('click', event => { event.stopPropagation(); $('marker-service').value = marker.service; selectMarker(); $('marker-x').focus(); });
      return button;
    }));
    exportConfig();
  }
  function selectMarker() {
    const marker = map.markers.find(m => m.service === $('marker-service').value);
    $('marker-x').value = marker?.x ?? 50; $('marker-y').value = marker?.y ?? 50; $('marker-error').textContent = '';
  }
  function place(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100) throw new Error('Both coordinates must be between 0 and 100 percent.');
    const service = $('marker-service').value;
    map.markers = map.markers.filter(m => m.service !== service);
    map.markers.push({ service, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    selectMarker(); draw();
  }
  $('marker-form').addEventListener('submit', event => { event.preventDefault(); try { place($('marker-x').valueAsNumber, $('marker-y').valueAsNumber); } catch (error) { $('marker-error').textContent = error.message; } });
  $('editor-map').addEventListener('click', event => {
    const rect = $('editor-image').getBoundingClientRect();
    if (rect.width && rect.height) place((event.clientX - rect.left) / rect.width * 100, (event.clientY - rect.top) / rect.height * 100);
  });
  $('marker-service').addEventListener('change', selectMarker);
  $('remove-marker').addEventListener('click', () => { map.markers = map.markers.filter(m => m.service !== $('marker-service').value); draw(); });
  $('image-path').addEventListener('change', () => {
    const path = $('image-path').value.trim();
    if (!/^static\/images\/[a-zA-Z0-9_./ -]+\.(png|jpe?g|webp|svg)$/i.test(path) || path.includes('..')) { $('marker-error').textContent = 'Use a local image path under static/images/.'; return; }
    $('editor-image').src = '../' + path; exportConfig();
  });
  $('image-alt').addEventListener('input', exportConfig);
  $('image-file').addEventListener('change', () => { const file = $('image-file').files[0]; if (file) { if (previewURL) URL.revokeObjectURL(previewURL); previewURL = URL.createObjectURL(file); $('editor-image').src = previewURL; } });
  $('editor-image').addEventListener('error', () => { $('marker-error').textContent = 'Image could not be loaded. Check its path or choose a local preview file.'; });
  $('copy-markers').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('marker-export').value); $('copy-status').textContent = 'Copied. Replace HQData’s map configuration with this object.'; } catch { $('marker-export').focus(); $('marker-export').select(); $('copy-status').textContent = 'Select and copy the JSON above with Ctrl+C / Cmd+C.'; } });
  $('download-markers').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([$ ('marker-export').value], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = 'hq-map.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  $('editor-image').src = '../' + map.image; selectMarker(); draw();
})();
