# perlin-noise
My attempt at re-creating perlin-noise to better understand it.

I found [this article](https://rtouti.github.io/graphics/perlin-noise-algorithm) about Perlin noise and wanted to implement something 
like it.

## Files
- `noise.js` is the library containing the noise functions
- `index.js` is a test that runs noise.js for 10 million times to get an idea of its bounds
- `index.html` is a web-based demo of what 2d perlin noise can look like when used as a height map
- `app.js` is the js for the demo (manages the canvas and runs the noise functions)

NOTE: noise.js is a commonJS module, so I used a hack to load it in the browser (y creating a global variable called module).
