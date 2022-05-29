// app.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/*
returns an array of rgb color values for drawing

dark blue = #00008b
light blue = #566cb8
-- water level --
dark green = #006200
light green = #90ee90
white = #ffffff

grandient index range: color range
0 - 63: dark blue - light blue
64 - 191: dark green - light green
192 - 255: light green - white
*/
const createGradientMap = () => {
  const map = new Array(256).fill();

  // 0 - 64: dark blue - light blue
  for (let i = 0; i < 64; i++) {
    const t = i / 63;
    const r = lerp(t, 0, parseInt('56', 16));
    const g = lerp(t, 0, parseInt('6c', 16));
    const b = lerp(t, parseInt('8b', 16), parseInt('b8', 16));
    map[i] = { r, g, b };
  }

  // 64 - 192: dark green - light green
  for (let i = 64; i < 192; i++) {
    const t = (i - 64) / (192 - 64);
    const r = lerp(t, 0, parseInt('90', 16));
    const g = lerp(t, parseInt('62', 16), parseInt('ee', 16));
    const b = lerp(t, parseInt('00', 16), parseInt('90', 16));
    map[i] = { r, g, b }
  }

  // 192 - 255: light green - white
  for (let i = 192; i < 256; i++) {
    const t = (i - 192) / (256 - 192);
    const r = lerp(t, parseInt('90', 16), parseInt('ff', 16));
    const g = lerp(t, parseInt('ee', 16), parseInt('ff', 16));
    const b = lerp(t, parseInt('90', 16), parseInt('ff', 16));
    map[i] = { r, g, b }
  }

  return map;
}
const GRADIENT_MAP = createGradientMap();

const HEIGHT_MAP_SIZE = canvas.width;

const createImageData = (size = canvas.width) => {
  let imageData = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const noise = (noiseWithOctaves(x / size, y / size) + 0.5);
      let value = ~~Math.abs(noise * 255);
      // fill in the colour using the gradient map
      const { r, g, b } = GRADIENT_MAP[value];
      const offset = (y * size + x) * 4;
      imageData.data[offset + 0] = r; // R value
      imageData.data[offset + 1] = g; // G value
      imageData.data[offset + 2] = b; // B value
      imageData.data[offset + 3] = 255;   // A value
    }
  }
  return imageData;
};
let imageData = ctx.createImageData(HEIGHT_MAP_SIZE, HEIGHT_MAP_SIZE);
let imageBitmap = undefined;
createImageBitmap(createImageData(HEIGHT_MAP_SIZE*2))
  .then(result => { imageBitmap = result; });

const PIXELS_PER_SECOND = 500;
const msPerPixel = 1000 / PIXELS_PER_SECOND;
const draw = (tick) => {
  if (imageBitmap !== undefined && imageBitmap instanceof ImageBitmap) {
    const timeOffset = ~~(tick / msPerPixel)
    ctx.drawImage(imageBitmap,
      // source
      timeOffset % imageBitmap.width / 2, timeOffset % imageBitmap.height / 2, canvas.width, canvas.height,
      // destination
      0, 0, canvas.width, canvas.height
    );
  }
};

const loop = (tick) => {
  draw(tick);
  requestAnimationFrame(loop);
};

const init = () => {
  console.log('Perlin Noise Demo');
  requestAnimationFrame(loop);
};
init();

