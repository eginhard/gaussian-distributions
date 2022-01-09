// Hot reloading
import * as _unused from "raw-loader!./index.ejs";
// TODO: disable before publishing

import Example from "./diagrams/svelte-example.svelte";

// lazily initialize any diagram below the fold. E.G:
const exampleTag = document.getElementById("svelte-example-dfigure");
let example;
exampleTag.addEventListener("ready", () => {
  const target = exampleTag.querySelector("#svelte-example-target");
  example = new Example({ target });
});

import Multivariate from './components/Multivariate.html';
const multivariateTag = document.getElementById("multivariate-dfigure");
let multivariate;
multivariateTag.addEventListener("ready", () => {
  const target = multivariateTag.querySelector("#multivariate-target");
  multivariate = new Multivariate({ target });
});
// const MultivariateComponent = new Multivariate({ // eslint-disable-line no-unused-vars
//   target: document.querySelector('#Multivariate')
// });
