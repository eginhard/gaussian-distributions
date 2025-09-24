// Hot reloading
import * as _unused from "raw-loader!./index.ejs";
// TODO: disable before publishing

import { mount } from "svelte";
import Teaser from "./components/Teaser.html";
const TeaserComponent = mount(Teaser, {
  // eslint-disable-line no-unused-vars
  target: document.querySelector("#Teaser"),
});

// lazily initialize any diagram below the fold:
import Multivariate from "./components/Multivariate.html";
const multivariateTag = document.getElementById("multivariate-dfigure");
let multivariate;
multivariateTag.addEventListener("ready", () => {
  const target = multivariateTag.querySelector("#multivariate-target");
  multivariate = mount(Multivariate, { target });
});

import EstimationError from "./components/EstimationError.html";
const estimationErrorTag = document.getElementById("estimationError-dfigure");
let estimationError;
estimationErrorTag.addEventListener("ready", () => {
  const target = estimationErrorTag.querySelector("#estimationError-target");
  estimationError = mount(EstimationError, { target });
});

import SampleLikelihood from "./components/SampleLikelihood.html";
const sampleLikelihoodTag = document.getElementById("sampleLikelihood-dfigure");
let sampleLikelihood;
sampleLikelihoodTag.addEventListener("ready", () => {
  const target = sampleLikelihoodTag.querySelector("#sampleLikelihood-target");
  sampleLikelihood = mount(SampleLikelihood, { target });
});
