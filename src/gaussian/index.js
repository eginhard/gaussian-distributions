import * as m from "ml-matrix";
import random from "random";

export class Gaussian1D {
  constructor(mean, variance) {
    this.mean = mean;
    this.variance = variance;
    this.normal = random.normal();
  }

  at(x) {
    const n = Math.exp((-0.5 * Math.pow(x - this.mean, 2)) / this.variance);
    const d = Math.sqrt(this.variance * 2 * Math.PI);
    return n * (1 / d);
  }

  sample() {
    return this.std() * this.normal() + this.mean;
  }

  std() {
    return Math.sqrt(this.variance);
  }
}

export class Gaussian {
  constructor(mean, cov) {
    // TODO: Consider saving the dimension
    if (mean instanceof m.Matrix && cov instanceof m.Matrix) {
      this.mean = mean;
      this.cov = cov;
    } else {
      this.mean = new m.Matrix([mean]).transpose();
      this.cov = new m.Matrix(cov);
    }
    this.dim = this.mean.rows;
  }

  at(x) {
    const diff = new m.Matrix(x).sub(this.mean);
    const n = diff
      .transpose()
      .mmul(m.inverse(this.cov))
      .mmul(diff)
      .mul(-0.5)
      .exp()
      .get(0, 0);
    const d = Math.sqrt(
      Math.pow(2 * Math.PI, this.mean.rows) * m.determinant(this.cov),
    );
    return n * (1 / d);
  }

  jointLogLikelihood(xs) {
    const logs = xs.map((x) => Math.log(this.at(x)));
    return logs.reduce((a, b) => a + b, 0);
  }

  // idx is the first row of b
  marginalize(idx) {
    // FIXME: Rewrite with Array.slice() for speed
    const aMean = sliceMat(this.mean, 0, 0, idx, 1);
    const bMean = sliceMat(this.mean, idx, 0, this.mean.rows, 1);
    const aCov = sliceMat(this.cov, 0, 0, idx, idx);
    const bCov = sliceMat(this.cov, idx, idx, this.mean.rows, this.mean.rows);
    return [new Gaussian(aMean, aCov), new Gaussian(bMean, bCov)];
  }

  // Also refer to: https://stats.stackexchange.com/questions/232959/simulating-the-posterior-of-a-gaussian-process
  // FIXME: Currently only works with \mu_e = 0
  condition(X) {
    const idx = X.length;
    const x0 = new m.Matrix([X]).transpose();
    const Exx = sliceMat(this.cov, 0, 0, idx, idx);
    const Exy = sliceMat(this.cov, 0, idx, idx, this.mean.rows);
    const Eyx = Exy.transpose();
    const Eyy = sliceMat(this.cov, idx, idx, this.mean.rows, this.mean.rows);

    // Compute new zero
    const Lxx = new m.CholeskyDecomposition(Exx).lowerTriangularMatrix;
    const mLy = m.solve(Lxx, x0);
    const Lk = m.solve(Lxx, Exy);
    const condMean = Lk.transpose().mmul(mLy); // Hack

    // FIXME: Make this more performant (use cholesky and slove instead of inverse)
    const condCov = Eyy.sub(Eyx.mmul(m.inverse(Exx)).mmul(Exy));
    return new Gaussian(condMean, condCov);
  }

  // Uses Eigenvalue decomposition to compute t from Cov = tt^T
  transformationMatrix() {
    const e = new m.EigenvalueDecomposition(this.cov);
    const r = e.eigenvectorMatrix;
    const d = m.Matrix.zeros(r.rows, r.columns);
    for (let i = 0; i < d.rows; ++i) {
      d.set(i, i, Math.sqrt(e.realEigenvalues[i]));
    }
    return r.mmul(d);
    //return r.mmul(d).to2DArray();
  }

  sample(n = 1) {
    const values = [];
    for (let i = 0; i < n; i++) {
      const z = m.Matrix.zeros(this.mean.rows, 1);
      const normal = random.normal();
      for (let i = 0; i < this.mean.rows; ++i) z.set(i, 0, normal());
      values.push(m.Matrix.add(this.mean, this.transformationMatrix().mmul(z)));
    }
    return values;
  }

  getMean() {
    return this.mean.getColumn(0);
  }

  getSd() {
    return this.cov.diag().map((s2) => Math.sqrt(s2));
  }
}

// ranges from [i1,i2) & [j1,j2)
function sliceMat(mat, i1, j1, i2, j2) {
  const result = new m.Matrix(i2 - i1, j2 - j1);
  for (let i = i1; i < i2; ++i)
    for (let j = j1; j < j2; ++j) {
      result.set(i - i1, j - j1, mat.get(i, j));
    }
  return result;
}
