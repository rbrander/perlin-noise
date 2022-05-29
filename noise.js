const Vector2 = function(x, y) {
  this.x = x;
  this.y = y;
  return this;
}
Vector2.prototype.dot = function(other) { return ((other.x * this.x) + (other.y * this.y)) };

const PERMUTATION_SIZE = 256;

const createPermutationTable = (size) => {
  const table = new Array(size).fill().map((_, idx) => idx);
  // shuffle the table
  for (let i = size - 1; i > 0; i--) {
    const index = Math.round(Math.random() * (i-1));
    const temp = table[i];
    table[i] = table[index];
    table[index] = temp;
  }
  // return the table duplicated so that it can wrap safely
  return [...table, ...table];
}
const PERMUTATION_TABLE = createPermutationTable(PERMUTATION_SIZE);
const getPermutationValue = (x, y) => PERMUTATION_TABLE[PERMUTATION_TABLE[x] + y];

const fade = (t) => ((6 * t - 15) * t + 10) * t * t * t;
const lerp = (t, a, b) => a + t * (b - a);

const CONSTANT_VECTORS = [
  new Vector2(-1.0, -1.0),
  new Vector2(-1.0, 1.0),
  new Vector2(1.0, -1.0),
  new Vector2(1.0, 1.0)
];
const getConstantVector = (value) => {
  const quarter = value % 4;
  return CONSTANT_VECTORS[quarter];
};

// inputs: x and y are floating point numbers
const noise2d = (x, y) => {
  // create variables that are bounded within 0-255
  // so we can use it for the permutation array
  const X = ~~x % PERMUTATION_SIZE;
  const Y = ~~y % PERMUTATION_SIZE;
  // get the fractional part of the inputs
  const xf = x - ~~x;
  const yf = y - ~~y;

  // create vectors representing a 1x1 box using fractional coordinates
  const topRight = new Vector2(xf - 1.0, yf - 1.0);
  const topLeft = new Vector2(xf, yf - 1.0);
  const bottomRight = new Vector2(xf - 1.0, yf);
  const bottomLeft = new Vector2(xf, yf);

  // get a value from the permutation table corresponding to location
  const valueTopRight = getPermutationValue(X + 1, Y + 1);
  const valueTopLeft = getPermutationValue(X, Y + 1);
  const valueBottomRight = getPermutationValue(X + 1, Y);
  const valueBottomLeft = getPermutationValue(X, Y);

  // get constant vectors for ecah corner based on permutation value
  const vectorTopRight = getConstantVector(valueTopRight);
  const vectorTopLeft = getConstantVector(valueTopLeft);
  const vectorBottomRight = getConstantVector(valueBottomRight);
  const vectorBottomLeft = getConstantVector(valueBottomLeft);

  // get the dot product of the two vectors
  const dotTopRight = topRight.dot(vectorTopRight);
  const dotTopLeft = topLeft.dot(vectorTopLeft);
  const dotBottomRight = bottomRight.dot(vectorBottomRight);
  const dotBottomLeft = bottomLeft.dot(vectorBottomLeft);

  // Before we can use the dot products, we need to create scalar value
  // that is smoother than a linear interpolation of the fractional parts
  const u = fade(xf);
  const v = fade(yf);

  const leftInterpolation = lerp(v, dotBottomLeft, dotTopLeft);
  const rightInterpolation = lerp(v, dotBottomRight, dotTopRight);

  const finalInterpolation = lerp(u, leftInterpolation, rightInterpolation);
  return finalInterpolation;
}

const noiseWithOctaves = (x,y, NUM_OCTAVES=8) => {
  let sum = 0;
  for (let octave = 1; octave <= NUM_OCTAVES; octave++) {
    const multiplyer = 1 << (octave - 1);
    const sumContributionFactor =  (1/multiplyer)/2; // 0.5 for the first octave, halving each iteration
    const value = noise2d(x * multiplyer, y * multiplyer) * sumContributionFactor;
    sum += value;
  }
  return sum;
}

module.exports = {
  noise2d,
  noiseWithOctaves
};

