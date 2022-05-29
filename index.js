const { noise2d } = require('./noise');

let min = 1000, max = -1000;

const NUM_ITERATIONS = 10000000;
for (let i = 0; i < NUM_ITERATIONS; i++) {
  const x = Math.random() * NUM_ITERATIONS;
  const y = Math.random() * NUM_ITERATIONS;
  const value = noise2d(x, y);
  if (value > max) {
    max = value;
  }
  if (value < min) {
    min = value;
  }
}

console.log('Noise Test');
console.log('count =', NUM_ITERATIONS.toLocaleString())
console.log('min =', min);
console.log('max =', max);
/*
Noise Test
count = 100,000,000;
min = -0.9999999043499834
max = 0.9999986714359219
*/
