import * as d3 from 'd3';

export const contourInterpolator = t => d3.interpolateRdPu(0.05 + 0.3 * t);

export function range(n){
  return Array(n).fill().map((_, i) => i);
}

export function twoDecimals(x) {
   return Math.round(x * 100) / 100;
 }

export function nDecimals(x, n) {
   return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
 }
