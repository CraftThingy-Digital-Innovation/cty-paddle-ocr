var Y = Object.defineProperty;
var q = (a, t, e) => t in a ? Y(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var m = (a, t, e) => q(a, typeof t != "symbol" ? t + "" : t, e);
import * as I from "onnxruntime-node";
import l from "@techstark/opencv-js";
import "onnxruntime-web";
function v(a, t) {
  const e = typeof t == "string" && t.toLowerCase().includes("utf-8") || typeof t == "object" && t.encoding && t.encoding.toLowerCase().includes("utf-8"), i = new XMLHttpRequest();
  if (i.open("GET", a, !1), e) {
    if (i.send(), i.status !== 200 && i.status !== 0)
      throw new Error(`Failed to read text file at ${a}: HTTP ${i.status}`);
    return i.responseText;
  } else {
    if (i.overrideMimeType("text/plain; charset=x-user-defined"), i.send(), i.status !== 200 && i.status !== 0)
      throw new Error(`Failed to read binary file at ${a}: HTTP ${i.status}`);
    const r = i.responseText, o = r.length, n = new Uint8Array(o);
    for (let s = 0; s < o; s++)
      n[s] = r.charCodeAt(s) & 255;
    return {
      buffer: n.buffer,
      byteLength: n.byteLength
    };
  }
}
function W() {
  return !1;
}
function F() {
}
function k() {
  return [];
}
function j() {
}
function H() {
  return {
    write(a, t) {
      return typeof t == "function" && t(), !0;
    },
    end() {
    },
    on() {
    }
  };
}
const J = {
  readFileSync: v,
  existsSync: W,
  mkdirSync: F,
  readdirSync: k,
  unlinkSync: j,
  createWriteStream: H
}, Q = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createWriteStream: H,
  default: J,
  existsSync: W,
  mkdirSync: F,
  readFileSync: v,
  readdirSync: k,
  unlinkSync: j
}, Symbol.toStringTag, { value: "Module" }));
function M(...a) {
  const t = a[a.length - 1];
  return typeof t == "string" && (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/")), t;
}
function E(...a) {
  return a.some((t) => typeof t == "string" && (t.startsWith("http://") || t.startsWith("https://"))) ? a.join("/") : a.join("/").replace(/\/+/g, "/");
}
function V(a) {
  if (typeof a == "string" && (a.startsWith("http://") || a.startsWith("https://")))
    try {
      const t = new URL(a), e = t.pathname, i = e.substring(0, e.lastIndexOf("/"));
      return t.origin + (i || "/");
    } catch {
      return a.substring(0, a.lastIndexOf("/")) || ".";
    }
  return a.substring(0, a.lastIndexOf("/")) || ".";
}
const S = { resolve: M, join: E, dirname: V }, Z = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: S,
  dirname: V,
  join: E,
  resolve: M
}, Symbol.toStringTag, { value: "Module" })), L = typeof HTMLCanvasElement < "u" ? HTMLCanvasElement : class {
};
function P(a, t) {
  const e = document.createElement("canvas");
  return e.width = a, e.height = t, e;
}
function tt(a) {
  return typeof HTMLImageElement < "u" && a instanceof HTMLImageElement ? a.complete ? Promise.resolve(a) : new Promise((t, e) => {
    a.onload = () => t(a), a.onerror = (i) => e(new Error("Failed to load image element: " + i.message));
  }) : typeof HTMLCanvasElement < "u" && a instanceof HTMLCanvasElement ? Promise.resolve(a) : new Promise((t, e) => {
    const i = new Image();
    if (i.crossOrigin = "anonymous", i.onload = () => {
      typeof a == "object" && i.src.startsWith("blob:") && URL.revokeObjectURL(i.src), t(i);
    }, i.onerror = (r) => e(new Error("Failed to load image source: " + r.message)), a instanceof Blob || a instanceof File)
      i.src = URL.createObjectURL(a);
    else if (a instanceof ArrayBuffer || ArrayBuffer.isView(a)) {
      const r = new Blob([a]);
      i.src = URL.createObjectURL(r);
    } else
      i.src = a;
  });
}
class et {
  constructor() {
    m(this, "operations", /* @__PURE__ */ new Map());
    m(this, "defaultOptions", /* @__PURE__ */ new Map());
  }
  register(t, e, i) {
    this.operations.set(t, e), i && this.defaultOptions.set(t, i);
  }
  getOperation(t) {
    return this.operations.get(t);
  }
  getDefaultOptionsGenerator(t) {
    return this.defaultOptions.get(t) || {};
  }
  hasOperation(t) {
    return this.operations.has(t);
  }
  getOperationNames() {
    return Array.from(this.operations.keys());
  }
}
let x = new et();
function it(a, t, e) {
  let i = x.getOperation(a);
  if (!i)
    throw new Error(`Operation "${a}" not found in registry`);
  let r = x.getDefaultOptionsGenerator(a), n = { ...(typeof r == "function" ? r : () => ({}))(), ...e };
  return i(t, n);
}
function rt() {
  return { upper: 255, method: l.ADAPTIVE_THRESH_GAUSSIAN_C, type: l.THRESH_BINARY_INV, size: 7, constant: 2 };
}
function nt(a, t) {
  let e = new l.Mat();
  return l.adaptiveThreshold(a, e, t.upper, t.method, t.type, t.size, t.constant), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("adaptiveThreshold", nt, rt);
function ot() {
  return { size: [5, 5], sigma: 0 };
}
function st(a, t) {
  let e = new l.Mat();
  return l.GaussianBlur(a, e, new l.Size(t.size[0], t.size[1]), t.sigma), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("blur", st, ot);
function at() {
  return { size: 10, borderType: l.BORDER_CONSTANT, borderColor: [255, 255, 255, 255] };
}
function lt(a, t) {
  let e = new l.Mat();
  return l.copyMakeBorder(a, e, t.size, t.size, t.size, t.size, t.borderType, t.borderColor), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("border", lt, at);
function ct() {
  return { lower: 50, upper: 150 };
}
function ht(a, t) {
  let e = new l.Mat();
  return l.Canny(a, e, t.lower, t.upper), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("canny", ht, ct);
function dt(a, t) {
  if (t.rtype === void 0)
    throw new Error("Invalid options: rtype is required");
  let e = new l.Mat();
  return a.convertTo(e, t.rtype), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("convert", dt);
function ut() {
  return { size: [5, 5], iter: 1 };
}
function gt(a, t) {
  let e = new l.Mat(), i = l.getStructuringElement(l.MORPH_RECT, new l.Size(t.size[0], t.size[1]));
  return l.dilate(a, e, i, new l.Point(-1, -1), t.iter), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("dilate", gt, ut);
function ft() {
  return { size: [5, 5], iter: 1 };
}
function pt(a, t) {
  let e = new l.Mat(), i = l.getStructuringElement(l.MORPH_RECT, new l.Size(t.size[0], t.size[1]));
  return l.erode(a, e, i, new l.Point(-1, -1), t.iter), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("erode", pt, ft);
function mt() {
  return {};
}
function wt(a, t) {
  let e = new l.Mat();
  return l.cvtColor(a, e, l.COLOR_RGBA2GRAY), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("grayscale", wt, mt);
function yt() {
  return {};
}
function xt(a, t) {
  let e = new l.Mat();
  return l.bitwise_not(a, e), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("invert", xt, yt);
function bt() {
  return { size: [3, 3] };
}
function Ct(a, t) {
  let e = new l.Mat(), i = l.getStructuringElement(l.MORPH_RECT, new l.Size(t.size[0], t.size[1]));
  return l.morphologyEx(a, e, l.MORPH_GRADIENT, i), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("morphologicalGradient", Ct, bt);
function Tt(a, t) {
  if (!t.width || !t.height)
    throw new Error("Invalid options: width and height are required");
  let e = new l.Mat();
  return l.resize(a, e, new l.Size(t.width, t.height)), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("resize", Tt);
function It(a, t) {
  let e = t.center || new l.Point(a.cols / 2, a.rows / 2), i = l.getRotationMatrix2D(e, t.angle, 1), r = new l.Size(a.cols, a.rows), o = new l.Mat();
  return l.warpAffine(a, o, i, r, l.INTER_LINEAR, l.BORDER_CONSTANT, new l.Scalar()), a.delete(), i.delete(), { img: o, width: o.cols, height: o.rows };
}
x.register("rotate", It);
function Ot() {
  return { lower: 0, upper: 255, type: l.THRESH_BINARY_INV + l.THRESH_OTSU };
}
function Rt(a, t) {
  let e = new l.Mat();
  return l.threshold(a, e, t.lower, t.upper, t.type), a.delete(), { img: e, width: e.cols, height: e.rows };
}
x.register("threshold", Rt, Ot);
function vt(a, t) {
  if (!t.points || !t.bbox)
    throw new Error("Invalid options: points and bbox are required");
  const { points: e, bbox: i } = t;
  let r = new l.Mat(), o = i.x1 - i.x0, n = i.y1 - i.y0, s = [0, 0, o - 1, 0, o - 1, n - 1, 0, n - 1], c = [e.topLeft.x, e.topLeft.y, e.topRight.x, e.topRight.y, e.bottomRight.x, e.bottomRight.y, e.bottomLeft.x, e.bottomLeft.y], h = l.matFromArray(4, 1, l.CV_32FC2, s), d = l.matFromArray(4, 1, l.CV_32FC2, c), u = l.getPerspectiveTransform(d, h), g = new l.Size(o, n);
  return l.warpPerspective(a, r, u, g), u.delete(), d.delete(), h.delete(), a.delete(), { img: r, width: r.cols, height: r.rows };
}
x.register("warp", vt);
const C = class C {
  constructor() {
    m(this, "step", 0);
  }
  static getInstance() {
    return C.instance || (C.instance = new C()), C.instance;
  }
  crop(t) {
    const { bbox: e, canvas: i } = t;
    let r = P(e.x1 - e.x0, e.y1 - e.y0);
    return r.getContext("2d").drawImage(i, e.x0, e.y0, e.x1 - e.x0, e.y1 - e.y0, 0, 0, r.width, r.height), r;
  }
  isDirty(t) {
    const { canvas: e, threshold: i = 127.5, majorColorThreshold: r = 0.97 } = t;
    let o = 0, n = 0, s = this.crop({ bbox: { x0: e.width * 0.1, y0: e.height * 0.1, x1: e.width * 0.9, y1: e.height * 0.9 }, canvas: e }), h = s.getContext("2d").getImageData(0, 0, s.width, s.height).data;
    for (let u = 0; u < h.length; u += 4) {
      let g = h[u], f = h[u + 1], p = h[u + 2];
      g >= i && f >= i && p >= i ? o++ : n++;
    }
    return Math.max(o, n) / (n + o) < r;
  }
  saveImage(t) {
    const { canvas: e, filename: i, path: r = "out" } = t;
    let o = E(process.cwd(), r);
    E(o, `${this.step++}. ${i}.png`);
    let n = H(), s = e.toBuffer("image/png");
    return new Promise((c, h) => {
      n.write(s, (d) => {
        d ? h(d) : c();
      });
    });
  }
  clearOutput(t = "out") {
    E(process.cwd(), t);
  }
  drawLine(t) {
    const { ctx: e, x: i, y: r, width: o, height: n, lineWidth: s = 2, color: c = "blue" } = t;
    e.beginPath(), e.strokeStyle = c, e.lineWidth = s, e.strokeRect(i, r, o, n), e.closePath();
  }
  drawContour(t) {
    const { ctx: e, contour: i, strokeStyle: r = "red", lineWidth: o = 2 } = t;
    let n = i.data32S;
    if (!(n.length < 4)) {
      e.strokeStyle = r, e.lineWidth = o, e.beginPath(), e.moveTo(n[0], n[1]);
      for (let s = 2; s < n.length; s += 2)
        e.lineTo(n[s], n[s + 1]);
      e.closePath(), e.stroke();
    }
  }
};
m(C, "instance", null);
let O = C;
class Mt {
  constructor(t, e = {}) {
    m(this, "contours");
    let i = { ...Et(), ...e };
    if (t instanceof l.Mat) {
      let r = new l.MatVector(), o = new l.Mat();
      try {
        l.findContours(t, r, o, i.mode, i.method);
      } catch (n) {
        throw n;
      }
      o.delete(), this.contours = r;
    } else
      throw new Error("Invalid img type. Must be cv.Mat.");
  }
  getAll() {
    return this.contours;
  }
  getSize() {
    return this.contours.size();
  }
  getFromIndex(t) {
    return t < this.contours.size() ? this.contours.get(t) : new l.Mat();
  }
  getRect(t) {
    return l.boundingRect(t);
  }
  iterate(t) {
    for (let e = 0, i = this.contours.size(); e < i; e++) {
      let r = this.contours.get(e);
      t(r);
    }
    return this;
  }
  getLargestContourArea() {
    let t = 0, e = null;
    return this.iterate((i) => {
      let r = l.contourArea(i);
      r > t && (t = r, e = i);
    }), e;
  }
  getCornerPoints(t) {
    const { canvas: e, contour: i = this.getLargestContourArea() } = t;
    let r = { x0: 0, y0: 0, x1: e.width, y1: e.height };
    if (!i)
      return { points: { topLeft: { x: r.x0, y: r.y0 }, topRight: { x: r.x1, y: r.y0 }, bottomLeft: { x: r.x0, y: r.y1 }, bottomRight: { x: r.x1, y: r.y1 } }, bbox: r };
    let o = l.minAreaRect(i), n = l.RotatedRect.points(o), s = { topLeft: { x: 0, y: 0 }, topRight: { x: 0, y: 0 }, bottomRight: { x: 0, y: 0 }, bottomLeft: { x: 0, y: 0 } }, c = n.map((w) => w.x + w.y), h = n.map((w) => w.y - w.x), d = c.indexOf(Math.min(...c)), u = h.indexOf(Math.min(...h)), g = c.indexOf(Math.max(...c)), f = h.indexOf(Math.max(...h));
    if (!n[d] || !n[u] || !n[g] || !n[f])
      return { points: { topLeft: { x: r.x0, y: r.y0 }, topRight: { x: r.x1, y: r.y0 }, bottomLeft: { x: r.x0, y: r.y1 }, bottomRight: { x: r.x1, y: r.y1 } }, bbox: r };
    s.topLeft = { x: n[d].x, y: n[d].y }, s.topRight = { x: n[u].x, y: n[u].y }, s.bottomRight = { x: n[g].x, y: n[g].y }, s.bottomLeft = { x: n[f].x, y: n[f].y }, i.delete();
    let p = (w) => (w.x = Math.max(0, Math.min(e.width, w.x)), w.y = Math.max(0, Math.min(e.height, w.y)), w);
    return s.topLeft = p(s.topLeft), s.topRight = p(s.topRight), s.bottomLeft = p(s.bottomLeft), s.bottomRight = p(s.bottomRight), { points: s, bbox: r };
  }
  getApproximateRectangleContour(t) {
    const { threshold: e = 0.02, contour: i = this.getLargestContourArea() } = t ?? {};
    if (!i) return;
    let r = e * l.arcLength(i, !0), o = new l.Mat();
    return l.approxPolyDP(i, o, r, !0), i.delete(), o;
  }
  destroy() {
    try {
      this.contours.delete();
    } catch {
    }
  }
}
function Et() {
  return { mode: l.RETR_EXTERNAL, method: l.CHAIN_APPROX_SIMPLE };
}
class T {
  constructor(t) {
    m(this, "img");
    m(this, "width");
    m(this, "height");
    if (t instanceof L) {
      let i = t.getContext("2d").getImageData(0, 0, t.width, t.height);
      this.img = l.matFromImageData(i), this.width = t.width, this.height = t.height;
    } else if (t instanceof l.Mat)
      this.img = t, this.width = t.cols, this.height = t.rows;
    else
      throw new Error("Invalid source type. Must be either Canvas or cv.Mat.");
  }
  static async prepareCanvas(t) {
    if (t instanceof L) return t;
    let e = await tt(t), i = P(e.width, e.height);
    return i.getContext("2d").drawImage(e, 0, 0), i;
  }
  static async prepareBuffer(t) {
    if (t instanceof ArrayBuffer) return t;
    if (typeof t.toBuffer == "function") {
      let o = t.toBuffer("image/png"), n = new ArrayBuffer(o.byteLength);
      return new Uint8Array(n).set(new Uint8Array(o)), n;
    }
    if (typeof t.toDataURL == "function") {
      let n = t.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""), s = Buffer.from(n, "base64"), c = new ArrayBuffer(s.byteLength);
      return new Uint8Array(c).set(new Uint8Array(s)), c;
    }
    let i = t.getContext("2d").getImageData(0, 0, t.width, t.height), r = new ArrayBuffer(i.data.byteLength);
    return new Uint8Array(r).set(new Uint8Array(i.data.buffer, i.data.byteOffset, i.data.byteLength)), r;
  }
  static async initRuntime() {
    return new Promise((t) => {
      l && l.Mat ? t() : l.onRuntimeInitialized = () => {
        t();
      };
    });
  }
  execute(t, e) {
    if (!x.hasOperation(t))
      throw new Error(`Operation "${t}" not found`);
    try {
      let i = it(t, this.img, e);
      this.img = i.img, this.width = i.width, this.height = i.height;
    } catch (i) {
      throw console.error(`Error executing operation "${t}":`, i), i;
    }
    return this;
  }
  grayscale(t = {}) {
    return this.execute("grayscale", t);
  }
  invert(t = {}) {
    return this.execute("invert", t);
  }
  border(t = {}) {
    return this.execute("border", t);
  }
  blur(t = {}) {
    return this.execute("blur", t);
  }
  threshold(t = {}) {
    return this.execute("threshold", t);
  }
  adaptiveThreshold(t = {}) {
    return this.execute("adaptiveThreshold", t);
  }
  canny(t = {}) {
    return this.execute("canny", t);
  }
  morphologicalGradient(t = {}) {
    return this.execute("morphologicalGradient", t);
  }
  erode(t = {}) {
    return this.execute("erode", t);
  }
  dilate(t = {}) {
    return this.execute("dilate", t);
  }
  resize(t) {
    return this.execute("resize", t);
  }
  warp(t) {
    return this.execute("warp", t);
  }
  rotate(t) {
    return this.execute("rotate", t);
  }
  convert(t) {
    return this.execute("convert", t);
  }
  destroy() {
    this.img.delete();
  }
  toMat() {
    return this.img;
  }
  toCanvas() {
    let t = P(this.width, this.height), e = t.getContext("2d"), i = e.createImageData(this.width, this.height);
    if (this.img.channels() === 1) {
      let r = i.data, o = new Uint8Array(this.img.data);
      for (let n = 0; n < o.length; n++)
        r[n * 4] = o[n], r[n * 4 + 1] = o[n], r[n * 4 + 2] = o[n], r[n * 4 + 3] = 255;
    } else
      i.data.set(new Uint8ClampedArray(this.img.data));
    return e.putImageData(i, 0, 0), t;
  }
}
let Dt = () => {
  if (typeof import.meta < "u" && import.meta.url) {
    let a = import.meta.url;
    return S.dirname(a);
  }
  return "";
}, N = Dt();
const Lt = S.join(N, "models", "en_PP-OCRv3_det_infer.onnx"), Pt = S.join(N, "models", "en_PP-OCRv3_rec_infer.onnx"), St = S.join(N, "models", "en_dict.txt"), $t = {
  detection: Lt,
  recognition: Pt,
  charactersDictionary: St
}, U = {
  verbose: !1,
  debug: !1,
  debugFolder: "out"
}, X = {
  mean: [0.485, 0.456, 0.406],
  stdDeviation: [0.229, 0.224, 0.225],
  maxSideLength: 960,
  minimumAreaThreshold: 20,
  paddingVertical: 0.4,
  paddingHorizontal: 0.6
}, K = {
  imageHeight: 48,
  charactersDictionary: []
}, zt = {
  model: $t,
  detection: X,
  recognition: K,
  debugging: U
}, D = class D {
  constructor(t, e = {}, i = {}) {
    m(this, "options");
    m(this, "debugging");
    m(this, "session");
    this.session = t, this.options = { ...X, ...e }, this.debugging = { ...U, ...i };
  }
  log(t) {
    this.debugging.verbose && console.log(`[DetectionService] ${t}`);
  }
  async run(t) {
    this.log("Starting text detection process");
    try {
      let e = await this.preprocessDetection(t), i = await this.runInference(e.tensor, e.width, e.height);
      if (!i)
        return console.error("Text detection failed (output tensor is null)"), [];
      let r = this.postprocessDetection(i, e);
      return this.debugging.debug && (await this.debugDetectionCanvas(i, e.width, e.height), await this.debugDetectedBoxes(t, r)), this.log(`Detected ${r.length} text boxes in image`), r;
    } catch (e) {
      return console.error("Error during text detection:", e instanceof Error ? e.message : String(e)), [];
    }
  }
  async preprocessDetection(t) {
    let e = t instanceof L ? t : await T.prepareCanvas(t);
    const { width: i, height: r } = e, { width: o, height: n, ratio: s } = this.calculateResizeDimensions(i, r);
    let c = new T(e), h = c.resize({ width: o, height: n }).toCanvas();
    c.destroy();
    let d = Math.ceil(o / 32) * 32, u = Math.ceil(n / 32) * 32, g = this.createPaddedCanvas(h, o, n, d, u), f = this.imageToTensor(g, d, u);
    return this.log(`Detection preprocessed: original(${i}x${r}), model_input(${d}x${u}), resize_ratio: ${s.toFixed(4)}`), { tensor: f, width: d, height: u, resizeRatio: s, originalWidth: i, originalHeight: r };
  }
  calculateResizeDimensions(t, e) {
    let i = this.options.maxSideLength, r = t, o = e, n = 1;
    return Math.max(o, r) > i && (n = i / (o > r ? o : r), r = Math.round(r * n), o = Math.round(o * n)), { width: r, height: o, ratio: n };
  }
  createPaddedCanvas(t, e, i, r, o) {
    let n = P(r, o);
    return n.getContext("2d").drawImage(t, 0, 0, e, i), n;
  }
  imageToTensor(t, e, i) {
    let n = t.getContext("2d").getImageData(0, 0, e, i).data, s = new Float32Array(D.NUM_CHANNELS * i * e);
    const { mean: c, stdDeviation: h } = this.options;
    for (let d = 0; d < i; d++)
      for (let u = 0; u < e; u++) {
        let g = (d * e + u) * 4, f = d * e + u;
        for (let p = 0; p < D.NUM_CHANNELS; p++) {
          let R = (n[g + p] / 255 - c[p]) / h[p];
          s[p * i * e + f] = R;
        }
      }
    return s;
  }
  async runInference(t, e, i) {
    try {
      this.log("Running detection inference...");
      let o = { x: new I.Tensor("float32", t, [1, 3, i, e]) }, s = (await this.session.run(o))[this.session.outputNames[0] || "sigmoid_0.tmp_0"];
      return this.log("Detection inference complete!"), s ? s.data : (console.error(`Output tensor ${this.session.outputNames[0]} not found in detection results`), null);
    } catch (r) {
      throw console.error("Error during model inference:", r instanceof Error ? r.message : String(r)), r;
    }
  }
  tensorToCanvas(t, e, i) {
    let r = P(e, i), o = r.getContext("2d"), n = o.createImageData(e, i), s = n.data;
    for (let c = 0; c < i; c++)
      for (let h = 0; h < e; h++) {
        let d = c * e + h, u = t[d] || 0, g = Math.round(u * 255), f = (c * e + h) * 4;
        s[f] = g, s[f + 1] = g, s[f + 2] = g, s[f + 3] = 255;
      }
    return o.putImageData(n, 0, 0), r;
  }
  postprocessDetection(t, e, i = this.options.minimumAreaThreshold || 20, r = this.options.paddingVertical || 0.4, o = this.options.paddingHorizontal || 0.6) {
    this.log("Post-processing detection results...");
    const { width: n, height: s, resizeRatio: c, originalWidth: h, originalHeight: d } = e;
    let u = this.tensorToCanvas(t, n, s), g = new T(u);
    g.grayscale().convert({ rtype: l.CV_8UC1 });
    let f = new Mt(g.toMat(), { mode: l.RETR_LIST, method: l.CHAIN_APPROX_SIMPLE }), p = this.extractBoxesFromContours(f, n, s, c, h, d, i, r, o);
    return g.destroy(), f.destroy(), this.log(`Found ${p.length} potential text boxes`), p;
  }
  extractBoxesFromContours(t, e, i, r, o, n, s, c, h) {
    let d = [];
    return t.iterate((u) => {
      let g = t.getRect(u);
      if (g.width * g.height <= s)
        return;
      let f = this.applyPaddingToRect(g, e, i, c, h), p = this.convertToOriginalCoordinates(f, r, o, n);
      p.width > 5 && p.height > 5 && d.push(p);
    }), d;
  }
  applyPaddingToRect(t, e, i, r, o) {
    let n = Math.round(t.height * r), s = Math.round(t.height * o), c = t.x - s, h = t.y - n, d = t.width + 2 * s, u = t.height + 2 * n;
    c = Math.max(0, c), h = Math.max(0, h);
    let g = Math.min(e, t.x + t.width + s), f = Math.min(i, t.y + t.height + n);
    return d = g - c, u = f - h, { x: c, y: h, width: d, height: u };
  }
  convertToOriginalCoordinates(t, e, i, r) {
    let o = t.x / e, n = t.y / e, s = t.width / e, c = t.height / e, h = Math.max(0, Math.round(o)), d = Math.max(0, Math.round(n)), u = Math.min(i - h, Math.round(s)), g = Math.min(r - d, Math.round(c));
    return { x: h, y: d, width: u, height: g };
  }
  async debugDetectionCanvas(t, e, i) {
    let r = this.tensorToCanvas(t, e, i), o = this.debugging.debugFolder;
    await O.getInstance().saveImage({ canvas: r, filename: "detection-debug", path: o }), this.log(`Probability map visualized and saved to: ${o}`);
  }
  async debugDetectedBoxes(t, e) {
    let i = t instanceof L ? t : await T.prepareCanvas(t), r = i.getContext("2d"), o = O.getInstance();
    for (let s of e) {
      const { x: c, y: h, width: d, height: u } = s;
      o.drawLine({ ctx: r, x: c, y: h, width: d, height: u });
    }
    let n = this.debugging.debugFolder;
    await O.getInstance().saveImage({ canvas: i, filename: "boxes-debug", path: n }), this.log(`Boxes visualized and saved to: ${n}`);
  }
};
m(D, "NUM_CHANNELS", 3);
let z = D;
const b = class b {
  constructor(t, e = {}, i = {}) {
    m(this, "options");
    m(this, "debugging");
    m(this, "session");
    m(this, "toolkit");
    this.session = t, this.toolkit = O.getInstance(), this.options = { ...K, ...e }, this.debugging = { ...U, ...i };
  }
  log(t) {
    this.debugging.verbose && console.log(`[RecognitionService] ${t}`);
  }
  async run(t, e) {
    this.log("Starting text recognition process");
    try {
      let i = t instanceof L ? t : await T.prepareCanvas(t), r = this.filterValidBoxes(e), o = await this.processBoxesInParallel(i, r);
      return this.sortResultsByReadingOrder(o);
    } catch (i) {
      return console.error("Error during text recognition:", i instanceof Error ? i.message : String(i)), [];
    }
  }
  filterValidBoxes(t) {
    return t.map((e, i) => ({ box: e, index: i })).filter(({ box: e, index: i }) => this.isValidBox(e, i));
  }
  async processBoxesInParallel(t, e) {
    let i = this.debugging.debugFolder + "/crops";
    if (this.debugging.debug && this.toolkit.clearOutput(i), typeof window < "u") {
      const r = [];
      for (let o = 0; o < e.length; o++) {
        const { box: n, index: s } = e[o];
        await new Promise((c) => setTimeout(c, 10));
        try {
          const c = await this.processBox(t, n, s, e.length, i);
          c !== null && r.push(c);
        } catch (c) {
          console.error(`Error in sequential processBox ${s}:`, c);
        }
      }
      return r;
    } else {
      let r = e.map(({ box: n, index: s }) => this.processBox(t, n, s, e.length, i));
      return (await Promise.all(r)).filter((n) => n !== null);
    }
  }
  async processBox(t, e, i, r, o) {
    let n = Date.now();
    try {
      let s = this.cropRegion(t, e), c = await this.recognizeText(s);
      return this.debugging.debug && (await this.saveDebugCrop(s, i, o), this.logProcessingDetails(e, i, r, c, n)), { text: c, box: e };
    } catch (s) {
      return console.error(`Error processing box ${i + 1}: ${s.message}`, s.stack), null;
    }
  }
  sortResultsByReadingOrder(t) {
    return [...t].sort((e, i) => {
      let r = e.box, o = i.box;
      return Math.abs(r.y - o.y) < (r.height + o.height) / 4 ? r.x - o.x : r.y - o.y;
    });
  }
  isValidBox(t, e) {
    return t.width <= 0 || t.height <= 0 ? (console.warn(`Skipping invalid box ${e + 1}: w=${t.width}, h=${t.height}`), !1) : !0;
  }
  cropRegion(t, e) {
    return this.toolkit.crop({
      bbox: { x0: e.x, y0: e.y, x1: e.x + e.width, y1: e.y + e.height },
      canvas: t
    });
  }
  async saveDebugCrop(t, e, i) {
    await this.toolkit.saveImage({ canvas: t, filename: `crop_${String(e).padStart(3, "0")}.png`, path: i });
  }
  logProcessingDetails(t, e, i, r, o) {
    let n = Date.now() - o;
    this.log(`Box ${e + 1}/${i}: [x:${t.x}, y:${t.y}, w:${t.width}, h:${t.height}] → "${r}" (processed in ${n}ms)`);
  }
  async recognizeText(t) {
    const { imageTensor: e, tensorWidth: i, tensorHeight: r } = await this.preprocessImage(t);
    let o = new I.Tensor("float32", e, [1, 3, r, i]), n = await this.runInference(o);
    return this.decodeResults(n);
  }
  async preprocessImage(t) {
    let e = new T(t), i = this.options.imageHeight, r = e.width, o = e.height;
    if (o === 0 || r === 0)
      throw new Error(`Crop dimensions are zero: ${r}x${o}`);
    let n = r / o, s = Math.max(b.MIN_CROP_WIDTH, Math.round(i * n));
    e.resize({ width: s, height: i });
    let c = this.createImageTensor(e, s, i);
    return e.destroy(), { imageTensor: c, tensorWidth: s, tensorHeight: i };
  }
  createImageTensor(t, e, i) {
    let s = t.toCanvas().getContext("2d").getImageData(0, 0, e, i).data, c = 3, h = new Float32Array(c * i * e);
    for (let d = 0; d < i; d++)
      for (let u = 0; u < e; u++) {
        let g = (d * e + u) * 4, p = (s[g] / 255 - 0.5) / 0.5;
        for (let w = 0; w < c; w++) {
          let R = w * i * e + d * e + u;
          h[R] = p;
        }
      }
    return h;
  }
  async runInference(t) {
    let e = { x: t }, i = await this.session.run(e), r = Object.keys(i)[0], o = i[r];
    if (!o)
      throw new Error(`Recognition output tensor '${r}' not found. Available keys: ${Object.keys(i)}`);
    return o;
  }
  decodeResults(t) {
    let e = t.data, i = t.dims, r = i[1], o = i[2];
    return o !== this.options.charactersDictionary.length && console.warn(`Warning: Model output classes (${o}) does not match dictionary length (${this.options.charactersDictionary.length})`), this.ctcGreedyDecode(e, r, o, this.options.charactersDictionary);
  }
  ctcGreedyDecode(t, e, i, r) {
    let o = "", n = -1;
    for (let s = 0; s < e; s++) {
      const { index: c } = this.findMaxProbabilityClass(t, s, i);
      if (c === b.BLANK_INDEX || c === n) {
        n = c;
        continue;
      }
      this.isValidDictionaryIndex(c, r) ? this.appendCharacterToText(c, r, (h) => {
        o += h;
      }) : console.warn(`Decoded index ${c} out of bounds for charDict (length ${r.length}) at t=${s}`), n = c;
    }
    return o;
  }
  appendCharacterToText(t, e, i) {
    let r = e[t];
    if (t === e.length - 1) {
      if (r === b.UNK_TOKEN)
        return;
      i(" ");
      return;
    }
    i(r);
  }
  findMaxProbabilityClass(t, e, i) {
    let r = -1 / 0, o = 0;
    for (let n = 0; n < i; n++) {
      let s = t[e * i + n];
      s > r && (r = s, o = n);
    }
    return { value: r, index: o };
  }
  isValidDictionaryIndex(t, e) {
    return t >= 0 && t < e.length;
  }
};
m(b, "BLANK_INDEX", 0), m(b, "UNK_TOKEN", "<unk>"), m(b, "MIN_CROP_WIDTH", 8);
let A = b;
const y = class y {
  constructor(t) {
    m(this, "options");
    m(this, "detectionSession", null);
    m(this, "recognitionSession", null);
    this.options = { ...zt, ...t };
  }
  log(t) {
    var e;
    (e = this.options.debugging) != null && e.verbose && console.log(`[PaddleOcrService] ${t}`);
  }
  async initialize(t) {
    var e, i;
    try {
      let r = { ...this.options, ...t }, o = r.model.detection, n = r.model.recognition, s = r.model.charactersDictionary;
      if (typeof window < "u") {
        this.log(`Browser: Fetching dictionary from: ${s}`);
        const c = await fetch(s);
        if (!c.ok)
          throw new Error(`Failed to fetch characters dictionary: ${c.status} ${c.statusText}`);
        const d = (await c.text()).split(`
`);
        this.options.recognition.charactersDictionary = d, this.log(`Character dictionary loaded with ${d.length} entries.`), this.log(`Browser: Loading Detection model from: ${o}`);
        const g = o.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.detectionSession = await I.InferenceSession.create(o, g), this.log(`Browser: Loading Recognition model from: ${n}`);
        const p = n.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.recognitionSession = await I.InferenceSession.create(n, p);
      } else {
        let c = M(process.cwd(), o), h = M(process.cwd(), n), d = M(process.cwd(), s);
        this.log(`Node: Loading Detection ONNX model from: ${c}`);
        let u = v(c).buffer;
        const f = o.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.detectionSession = await I.InferenceSession.create(u, f), await new Promise(($) => setImmediate($)), this.log(`Node: Loading Recognition ONNX model from: ${h}`);
        let p = v(h).buffer;
        const R = n.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.recognitionSession = await I.InferenceSession.create(p, R), await new Promise(($) => setImmediate($)), this.log(`Node: Loading character dictionary from: ${d}`);
        let G = v(d, "utf-8").split(`
`);
        if (!G.length)
          throw new Error(`Character dictionary at ${d} is empty or not found.`);
        this.options.recognition.charactersDictionary = G;
      }
      this.log(`Initialization complete. Character dictionary has ${((i = (e = this.options.recognition) == null ? void 0 : e.charactersDictionary) == null ? void 0 : i.length) || 0} entries.`);
    } catch (r) {
      throw console.error("Failed to initialize PaddleOcrService:", r), r;
    }
  }
  static async getInstance(t) {
    return y.instance ? t && await y.instance.initialize(t) : (y.instance = new y(t), await y.instance.initialize()), y.instance;
  }
  isInitialized() {
    return this.detectionSession !== null && this.recognitionSession !== null;
  }
  static async changeModel(t) {
    return y.instance ? (await y.instance.destroy(), await y.instance.initialize(t)) : (y.instance = new y(t), await y.instance.initialize()), y.instance;
  }
  static async createInstance(t) {
    let e = new y(t);
    return await e.initialize(), e;
  }
  async recognize(t) {
    await T.initRuntime();
    let e = new z(this.detectionSession, this.options.detection, this.options.debugging), i = new A(this.recognitionSession, this.options.recognition, this.options.debugging), r = await e.run(t), o = await i.run(t, r);
    return this.groupResult(o);
  }
  getEncompassingBox(t) {
    if (!t || t.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    let e = 1 / 0, i = 1 / 0, r = -1 / 0, o = -1 / 0;
    for (const n of t) {
      const s = n.box;
      s && (e = Math.min(e, s.x), i = Math.min(i, s.y), r = Math.max(r, s.x + s.width), o = Math.max(o, s.y + s.height));
    }
    return {
      x: e === 1 / 0 ? 0 : e,
      y: i === 1 / 0 ? 0 : i,
      width: r === -1 / 0 ? 0 : r - e,
      height: o === -1 / 0 ? 0 : o - i
    };
  }
  groupResult(t) {
    let e = { text: "", lines: [] };
    if (!t.length)
      return e;
    let i = [t[0]], r = t[0].text, o = t[0].box.height;
    for (let n = 1; n < t.length; n++) {
      let s = t[n], c = t[n - 1], h = Math.abs(s.box.y - c.box.y), d = o * 0.5;
      if (h <= d)
        i.push(s), r += ` ${s.text}`, o = i.reduce((u, g) => u + g.box.height, 0) / i.length;
      else {
        const u = i.map((f) => f.text).join(" "), g = this.getEncompassingBox(i);
        e.lines.push({
          text: u,
          box: g,
          words: [...i]
        }), r += `
${s.text}`, i = [s], o = s.box.height;
      }
    }
    if (i.length > 0) {
      const n = i.map((c) => c.text).join(" "), s = this.getEncompassingBox(i);
      e.lines.push({
        text: n,
        box: s,
        words: [...i]
      });
    }
    return e.text = r, e;
  }
  async destroy() {
    var t, e;
    await ((t = this.detectionSession) == null ? void 0 : t.release()), await ((e = this.recognitionSession) == null ? void 0 : e.release());
  }
};
m(y, "instance", null);
let B = y;
class _ {
  /**
   * Fetches the list of available model files and dictionaries in the GitHub models repository.
   * Works in both Web Browser and Node.js environments.
   */
  static async listAvailableModelsFromGithub() {
    try {
      const t = await fetch(`https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/contents/`);
      if (!t.ok)
        throw new Error(`Failed to fetch models list from GitHub: ${t.status} ${t.statusText}`);
      return (await t.json()).filter((i) => i.type === "file" && (i.name.endsWith(".onnx") || i.name.endsWith(".ort") || i.name.endsWith(".txt"))).map((i) => ({
        name: i.name,
        size: i.size,
        downloadUrl: `https://media.githubusercontent.com/media/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main/${i.name}`
      }));
    } catch (t) {
      throw console.error("Error listing models from GitHub:", t), t;
    }
  }
  /**
   * Downloads a model asset directly from the GitHub repository and saves it to a local folder.
   * Node.js (Server-side) environment only.
   */
  static async downloadModelFromGithub(t, e) {
    if (typeof window < "u")
      throw new Error("downloadModelFromGithub is only supported on Node.js/Server-side.");
    const i = await Promise.resolve().then(() => Q), r = await Promise.resolve().then(() => Z), { Readable: o } = await import("./__vite-browser-external-l0sNRNKZ.js"), { finished: n } = await import("./__vite-browser-external-l0sNRNKZ.js"), s = `https://media.githubusercontent.com/media/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main/${t}`, c = r.join(e, t);
    i.existsSync(e) || i.mkdirSync(e, { recursive: !0 }), console.log(`[ModelManager] Downloading ${t} from GitHub LFS: ${s}`);
    const h = await fetch(s);
    if (!h.ok)
      throw new Error(`Failed to download model from GitHub: ${h.status} ${h.statusText}`);
    const d = i.createWriteStream(c);
    return await n(o.fromWeb(h.body).pipe(d)), console.log(`[ModelManager] Successfully saved model to ${c}`), c;
  }
}
m(_, "GITHUB_OWNER", "CraftThingy-Digital-Innovation"), m(_, "GITHUB_REPO", "cty-paddle-ocr-models");
class At {
  /**
   * Instantiate PaddleOCRClient
   * @param {object} options Configurations (e.g. { verbose: true, detection: { maxSideLength: 2000 } })
   */
  constructor(t = {}) {
    this.options = t, this.service = null;
  }
  /**
   * Initialize and load model assets via HTTP GET requests
   * @param {object} modelConfig Custom model paths, defaults to '/models/en_PP-OCRv3_det_infer.onnx', etc.
   */
  async init(t = {}) {
    const i = {
      ...{
        detection: "/models/en_PP-OCRv3_det_infer.onnx",
        recognition: "/models/en_PP-OCRv3_rec_infer.onnx",
        charactersDictionary: "/models/en_dict.txt"
      },
      ...t
    };
    this.service = new B({
      model: i,
      detection: {
        maxSideLength: this.options.maxSideLength || 2e3,
        ...this.options.detection
      },
      debugging: {
        verbose: this.options.verbose || !1,
        debug: !1
      }
    }), console.log("Initializing Client-Side PaddleOCR Service..."), await this.service.initialize(), console.log("Client-Side PaddleOCR Service initialized successfully.");
  }
  /**
   * Runs OCR text and layout extraction on an image canvas, URL, base64, Blob or File.
   * @param {string|HTMLCanvasElement|Blob|File|ArrayBuffer} imageInput
   */
  async recognize(t) {
    if (!this.service)
      throw new Error("PaddleOCRClient is not initialized. Please call init() first.");
    return this.service.recognize(t);
  }
}
typeof window < "u" && (window.PaddleOCRClient = At, window.ModelManager = _);
export {
  _ as ModelManager,
  At as PaddleOCRClient,
  At as default
};
