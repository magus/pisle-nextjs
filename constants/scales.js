// @flow strict

// [scale: string]: number
// value is the 1e# factor of scaling for given key
// e.g. t = 1e60
const Factors = {
  a: 3,
  b: 6,
  c: 9,
  d: 12,
  e: 15,
  f: 18,
  g: 21,
  h: 24,
  i: 27,
  j: 30,
  k: 33,
  l: 36,
  m: 39,
  n: 42,
  o: 45,
  p: 48,
  q: 51,
  r: 54,
  s: 57,
  t: 60,
  u: 63,
  v: 66,
  w: 69,
  x: 72,
  y: 75,
  z: 78,
};

const FromFactor = {};
Object.keys(Factors).forEach(f => {
  FromFactor[Factors[f]] = f;
});

const FromFactorKeys = Object.keys(FromFactor);

function factorToNumber(factor: number): number {
  return Math.pow(10, factor);
}

function toNumber(notation: ?ShortNotation): number {
  if (!notation) return 0;

  const [value, scale] = notation;

  // missing scale, return value
  if (!scale) return value;

  const factor = Factors[scale];

  // invalid scale, return value
  if (!factor) return value;

  return value * factorToNumber(factor);
}

function shortToString(notation: ShortNotation): string {
  const [value, scale] = notation;
  const scaleString = scale || '';
  return `${value.toFixed(2)}${scaleString}`;
}

function numberToShortString(value: number): string {
  return shortToString(fromNumber(value));
}

function fromNumber(value: number): ShortNotation {
  const log10floor = Math.floor(Math.log10(value));
  let factor;
  for (let i = 0; i < FromFactorKeys.length; i++) {
    if (log10floor >= +FromFactorKeys[i]) {
      factor = FromFactorKeys[i];
    } else if (log10floor < +FromFactorKeys[i]) {
      break;
    }
  }

  // factor not found, our scale is not sufficient
  if (!factor && value >= 1000) throw new Error(`factor not found [${value}]`);

  // value smaller than smallest factor (a), return value itself
  if (!factor) return [value, undefined];

  const factorMult = +(value / factorToNumber(+factor)).toFixed(2);
  const factorName = FromFactor[factor];
  return [factorMult, factorName];
}

const ShortNotationRegex = /^(\d+(\.\d+)?)\s*([a-z]{1})?$/;
function validateShort(shortString: string): ?ShortNotation {
  if (!shortString) return null;
  const match = shortString.match(ShortNotationRegex);
  if (!match) return null;

  const value = parseFloat(match[1]);

  if (isNaN(value)) return null;

  const scale = match[3];

  if (!scale) return [value, undefined];

  return [value, scale];
}

const MultiplierRegex = /^(\d+)\s*%?$/;
function validateMultiplier(multiplier: string): ?number {
  if (!multiplier) return null;

  const match = multiplier.match(MultiplierRegex);
  if (!match) return null;

  const value = parseFloat(match[1]);

  if (isNaN(value) || value < 100) return null;

  return value / 100;
}

export default {
  Factors,
  fromNumber,
  numberToShortString,
  shortToString,
  toNumber,
  validateMultiplier,
  validateShort,
};
