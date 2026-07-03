var W = Object.defineProperty;
var G = (s, e, t) => e in s ? W(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var m = (s, e, t) => G(s, typeof e != "symbol" ? e + "" : e, t);
import * as T from "onnxruntime-node";
import l from "@techstark/opencv-js";
import "onnxruntime-web";
function A(s, e) {
  const t = typeof e == "string" && e.toLowerCase().includes("utf-8") || typeof e == "object" && e.encoding && e.encoding.toLowerCase().includes("utf-8"), r = new XMLHttpRequest();
  if (r.open("GET", s, !1), t) {
    if (r.send(), r.status !== 200 && r.status !== 0)
      throw new Error(`Failed to read text file at ${s}: HTTP ${r.status}`);
    return r.responseText;
  } else {
    if (r.overrideMimeType("text/plain; charset=x-user-defined"), r.send(), r.status !== 200 && r.status !== 0)
      throw new Error(`Failed to read binary file at ${s}: HTTP ${r.status}`);
    const i = r.responseText, o = i.length, n = new Uint8Array(o);
    for (let a = 0; a < o; a++)
      n[a] = i.charCodeAt(a) & 255;
    return {
      buffer: n.buffer,
      byteLength: n.byteLength
    };
  }
}
function k() {
  return {
    write(s, e) {
      return typeof e == "function" && e(), !0;
    },
    end() {
    },
    on() {
    }
  };
}
function L(...s) {
  const e = s[s.length - 1];
  return typeof e == "string" && (e.startsWith("http://") || e.startsWith("https://") || e.startsWith("/")), e;
}
function E(...s) {
  return s.some((e) => typeof e == "string" && (e.startsWith("http://") || e.startsWith("https://"))) ? s.join("/") : s.join("/").replace(/\/+/g, "/");
}
function V(s) {
  if (typeof s == "string" && (s.startsWith("http://") || s.startsWith("https://")))
    try {
      const e = new URL(s), t = e.pathname, r = t.substring(0, t.lastIndexOf("/"));
      return e.origin + (r || "/");
    } catch {
      return s.substring(0, s.lastIndexOf("/")) || ".";
    }
  return s.substring(0, s.lastIndexOf("/")) || ".";
}
const P = { resolve: L, join: E, dirname: V }, M = typeof HTMLCanvasElement < "u" ? HTMLCanvasElement : class {
};
function D(s, e) {
  const t = document.createElement("canvas");
  return t.width = s, t.height = e, t;
}
function j(s) {
  return typeof HTMLImageElement < "u" && s instanceof HTMLImageElement ? s.complete ? Promise.resolve(s) : new Promise((e, t) => {
    s.onload = () => e(s), s.onerror = (r) => t(new Error("Failed to load image element: " + r.message));
  }) : typeof HTMLCanvasElement < "u" && s instanceof HTMLCanvasElement ? Promise.resolve(s) : new Promise((e, t) => {
    const r = new Image();
    if (r.crossOrigin = "anonymous", r.onload = () => {
      typeof s == "object" && r.src.startsWith("blob:") && URL.revokeObjectURL(r.src), e(r);
    }, r.onerror = (i) => t(new Error("Failed to load image source: " + i.message)), s instanceof Blob || s instanceof File)
      r.src = URL.createObjectURL(s);
    else if (s instanceof ArrayBuffer || ArrayBuffer.isView(s)) {
      const i = new Blob([s]);
      r.src = URL.createObjectURL(i);
    } else
      r.src = s;
  });
}
class X {
  constructor() {
    m(this, "operations", /* @__PURE__ */ new Map());
    m(this, "defaultOptions", /* @__PURE__ */ new Map());
  }
  register(e, t, r) {
    this.operations.set(e, t), r && this.defaultOptions.set(e, r);
  }
  getOperation(e) {
    return this.operations.get(e);
  }
  getDefaultOptionsGenerator(e) {
    return this.defaultOptions.get(e) || {};
  }
  hasOperation(e) {
    return this.operations.has(e);
  }
  getOperationNames() {
    return Array.from(this.operations.keys());
  }
}
let x = new X();
function K(s, e, t) {
  let r = x.getOperation(s);
  if (!r)
    throw new Error(`Operation "${s}" not found in registry`);
  let i = x.getDefaultOptionsGenerator(s), n = { ...(typeof i == "function" ? i : () => ({}))(), ...t };
  return r(e, n);
}
function q() {
  return { upper: 255, method: l.ADAPTIVE_THRESH_GAUSSIAN_C, type: l.THRESH_BINARY_INV, size: 7, constant: 2 };
}
function Y(s, e) {
  let t = new l.Mat();
  return l.adaptiveThreshold(s, t, e.upper, e.method, e.type, e.size, e.constant), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("adaptiveThreshold", Y, q);
function J() {
  return { size: [5, 5], sigma: 0 };
}
function Q(s, e) {
  let t = new l.Mat();
  return l.GaussianBlur(s, t, new l.Size(e.size[0], e.size[1]), e.sigma), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("blur", Q, J);
function Z() {
  return { size: 10, borderType: l.BORDER_CONSTANT, borderColor: [255, 255, 255, 255] };
}
function ee(s, e) {
  let t = new l.Mat();
  return l.copyMakeBorder(s, t, e.size, e.size, e.size, e.size, e.borderType, e.borderColor), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("border", ee, Z);
function te() {
  return { lower: 50, upper: 150 };
}
function re(s, e) {
  let t = new l.Mat();
  return l.Canny(s, t, e.lower, e.upper), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("canny", re, te);
function ie(s, e) {
  if (e.rtype === void 0)
    throw new Error("Invalid options: rtype is required");
  let t = new l.Mat();
  return s.convertTo(t, e.rtype), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("convert", ie);
function ne() {
  return { size: [5, 5], iter: 1 };
}
function oe(s, e) {
  let t = new l.Mat(), r = l.getStructuringElement(l.MORPH_RECT, new l.Size(e.size[0], e.size[1]));
  return l.dilate(s, t, r, new l.Point(-1, -1), e.iter), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("dilate", oe, ne);
function se() {
  return { size: [5, 5], iter: 1 };
}
function ae(s, e) {
  let t = new l.Mat(), r = l.getStructuringElement(l.MORPH_RECT, new l.Size(e.size[0], e.size[1]));
  return l.erode(s, t, r, new l.Point(-1, -1), e.iter), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("erode", ae, se);
function le() {
  return {};
}
function ce(s, e) {
  let t = new l.Mat();
  return l.cvtColor(s, t, l.COLOR_RGBA2GRAY), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("grayscale", ce, le);
function he() {
  return {};
}
function de(s, e) {
  let t = new l.Mat();
  return l.bitwise_not(s, t), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("invert", de, he);
function ge() {
  return { size: [3, 3] };
}
function ue(s, e) {
  let t = new l.Mat(), r = l.getStructuringElement(l.MORPH_RECT, new l.Size(e.size[0], e.size[1]));
  return l.morphologyEx(s, t, l.MORPH_GRADIENT, r), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("morphologicalGradient", ue, ge);
function fe(s, e) {
  if (!e.width || !e.height)
    throw new Error("Invalid options: width and height are required");
  let t = new l.Mat();
  return l.resize(s, t, new l.Size(e.width, e.height)), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("resize", fe);
function pe(s, e) {
  let t = e.center || new l.Point(s.cols / 2, s.rows / 2), r = l.getRotationMatrix2D(t, e.angle, 1), i = new l.Size(s.cols, s.rows), o = new l.Mat();
  return l.warpAffine(s, o, r, i, l.INTER_LINEAR, l.BORDER_CONSTANT, new l.Scalar()), s.delete(), r.delete(), { img: o, width: o.cols, height: o.rows };
}
x.register("rotate", pe);
function me() {
  return { lower: 0, upper: 255, type: l.THRESH_BINARY_INV + l.THRESH_OTSU };
}
function we(s, e) {
  let t = new l.Mat();
  return l.threshold(s, t, e.lower, e.upper, e.type), s.delete(), { img: t, width: t.cols, height: t.rows };
}
x.register("threshold", we, me);
function ye(s, e) {
  if (!e.points || !e.bbox)
    throw new Error("Invalid options: points and bbox are required");
  const { points: t, bbox: r } = e;
  let i = new l.Mat(), o = r.x1 - r.x0, n = r.y1 - r.y0, a = [0, 0, o - 1, 0, o - 1, n - 1, 0, n - 1], c = [t.topLeft.x, t.topLeft.y, t.topRight.x, t.topRight.y, t.bottomRight.x, t.bottomRight.y, t.bottomLeft.x, t.bottomLeft.y], d = l.matFromArray(4, 1, l.CV_32FC2, a), h = l.matFromArray(4, 1, l.CV_32FC2, c), g = l.getPerspectiveTransform(h, d), u = new l.Size(o, n);
  return l.warpPerspective(s, i, g, u), g.delete(), h.delete(), d.delete(), s.delete(), { img: i, width: i.cols, height: i.rows };
}
x.register("warp", ye);
const C = class C {
  constructor() {
    m(this, "step", 0);
  }
  static getInstance() {
    return C.instance || (C.instance = new C()), C.instance;
  }
  crop(e) {
    const { bbox: t, canvas: r } = e;
    let i = D(t.x1 - t.x0, t.y1 - t.y0);
    return i.getContext("2d").drawImage(r, t.x0, t.y0, t.x1 - t.x0, t.y1 - t.y0, 0, 0, i.width, i.height), i;
  }
  isDirty(e) {
    const { canvas: t, threshold: r = 127.5, majorColorThreshold: i = 0.97 } = e;
    let o = 0, n = 0, a = this.crop({ bbox: { x0: t.width * 0.1, y0: t.height * 0.1, x1: t.width * 0.9, y1: t.height * 0.9 }, canvas: t }), d = a.getContext("2d").getImageData(0, 0, a.width, a.height).data;
    for (let g = 0; g < d.length; g += 4) {
      let u = d[g], p = d[g + 1], f = d[g + 2];
      u >= r && p >= r && f >= r ? o++ : n++;
    }
    return Math.max(o, n) / (n + o) < i;
  }
  saveImage(e) {
    const { canvas: t, filename: r, path: i = "out" } = e;
    let o = E(process.cwd(), i);
    E(o, `${this.step++}. ${r}.png`);
    let n = k(), a = t.toBuffer("image/png");
    return new Promise((c, d) => {
      n.write(a, (h) => {
        h ? d(h) : c();
      });
    });
  }
  clearOutput(e = "out") {
    E(process.cwd(), e);
  }
  drawLine(e) {
    const { ctx: t, x: r, y: i, width: o, height: n, lineWidth: a = 2, color: c = "blue" } = e;
    t.beginPath(), t.strokeStyle = c, t.lineWidth = a, t.strokeRect(r, i, o, n), t.closePath();
  }
  drawContour(e) {
    const { ctx: t, contour: r, strokeStyle: i = "red", lineWidth: o = 2 } = e;
    let n = r.data32S;
    if (!(n.length < 4)) {
      t.strokeStyle = i, t.lineWidth = o, t.beginPath(), t.moveTo(n[0], n[1]);
      for (let a = 2; a < n.length; a += 2)
        t.lineTo(n[a], n[a + 1]);
      t.closePath(), t.stroke();
    }
  }
};
m(C, "instance", null);
let O = C;
class xe {
  constructor(e, t = {}) {
    m(this, "contours");
    let r = { ...be(), ...t };
    if (e instanceof l.Mat) {
      let i = new l.MatVector(), o = new l.Mat();
      try {
        l.findContours(e, i, o, r.mode, r.method);
      } catch (n) {
        throw n;
      }
      o.delete(), this.contours = i;
    } else
      throw new Error("Invalid img type. Must be cv.Mat.");
  }
  getAll() {
    return this.contours;
  }
  getSize() {
    return this.contours.size();
  }
  getFromIndex(e) {
    return e < this.contours.size() ? this.contours.get(e) : new l.Mat();
  }
  getRect(e) {
    return l.boundingRect(e);
  }
  iterate(e) {
    for (let t = 0, r = this.contours.size(); t < r; t++) {
      let i = this.contours.get(t);
      e(i);
    }
    return this;
  }
  getLargestContourArea() {
    let e = 0, t = null;
    return this.iterate((r) => {
      let i = l.contourArea(r);
      i > e && (e = i, t = r);
    }), t;
  }
  getCornerPoints(e) {
    const { canvas: t, contour: r = this.getLargestContourArea() } = e;
    let i = { x0: 0, y0: 0, x1: t.width, y1: t.height };
    if (!r)
      return { points: { topLeft: { x: i.x0, y: i.y0 }, topRight: { x: i.x1, y: i.y0 }, bottomLeft: { x: i.x0, y: i.y1 }, bottomRight: { x: i.x1, y: i.y1 } }, bbox: i };
    let o = l.minAreaRect(r), n = l.RotatedRect.points(o), a = { topLeft: { x: 0, y: 0 }, topRight: { x: 0, y: 0 }, bottomRight: { x: 0, y: 0 }, bottomLeft: { x: 0, y: 0 } }, c = n.map((w) => w.x + w.y), d = n.map((w) => w.y - w.x), h = c.indexOf(Math.min(...c)), g = d.indexOf(Math.min(...d)), u = c.indexOf(Math.max(...c)), p = d.indexOf(Math.max(...d));
    if (!n[h] || !n[g] || !n[u] || !n[p])
      return { points: { topLeft: { x: i.x0, y: i.y0 }, topRight: { x: i.x1, y: i.y0 }, bottomLeft: { x: i.x0, y: i.y1 }, bottomRight: { x: i.x1, y: i.y1 } }, bbox: i };
    a.topLeft = { x: n[h].x, y: n[h].y }, a.topRight = { x: n[g].x, y: n[g].y }, a.bottomRight = { x: n[u].x, y: n[u].y }, a.bottomLeft = { x: n[p].x, y: n[p].y }, r.delete();
    let f = (w) => (w.x = Math.max(0, Math.min(t.width, w.x)), w.y = Math.max(0, Math.min(t.height, w.y)), w);
    return a.topLeft = f(a.topLeft), a.topRight = f(a.topRight), a.bottomLeft = f(a.bottomLeft), a.bottomRight = f(a.bottomRight), { points: a, bbox: i };
  }
  getApproximateRectangleContour(e) {
    const { threshold: t = 0.02, contour: r = this.getLargestContourArea() } = e ?? {};
    if (!r) return;
    let i = t * l.arcLength(r, !0), o = new l.Mat();
    return l.approxPolyDP(r, o, i, !0), r.delete(), o;
  }
  destroy() {
    try {
      this.contours.delete();
    } catch {
    }
  }
}
function be() {
  return { mode: l.RETR_EXTERNAL, method: l.CHAIN_APPROX_SIMPLE };
}
class R {
  constructor(e) {
    m(this, "img");
    m(this, "width");
    m(this, "height");
    if (e instanceof M) {
      let r = e.getContext("2d").getImageData(0, 0, e.width, e.height);
      this.img = l.matFromImageData(r), this.width = e.width, this.height = e.height;
    } else if (e instanceof l.Mat)
      this.img = e, this.width = e.cols, this.height = e.rows;
    else
      throw new Error("Invalid source type. Must be either Canvas or cv.Mat.");
  }
  static async prepareCanvas(e) {
    if (e instanceof M) return e;
    let t = await j(e), r = D(t.width, t.height);
    return r.getContext("2d").drawImage(t, 0, 0), r;
  }
  static async prepareBuffer(e) {
    if (e instanceof ArrayBuffer) return e;
    if (typeof e.toBuffer == "function") {
      let o = e.toBuffer("image/png"), n = new ArrayBuffer(o.byteLength);
      return new Uint8Array(n).set(new Uint8Array(o)), n;
    }
    if (typeof e.toDataURL == "function") {
      let n = e.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""), a = Buffer.from(n, "base64"), c = new ArrayBuffer(a.byteLength);
      return new Uint8Array(c).set(new Uint8Array(a)), c;
    }
    let r = e.getContext("2d").getImageData(0, 0, e.width, e.height), i = new ArrayBuffer(r.data.byteLength);
    return new Uint8Array(i).set(new Uint8Array(r.data.buffer, r.data.byteOffset, r.data.byteLength)), i;
  }
  static async initRuntime() {
    return new Promise((e) => {
      l && l.Mat ? e() : l.onRuntimeInitialized = () => {
        e();
      };
    });
  }
  execute(e, t) {
    if (!x.hasOperation(e))
      throw new Error(`Operation "${e}" not found`);
    try {
      let r = K(e, this.img, t);
      this.img = r.img, this.width = r.width, this.height = r.height;
    } catch (r) {
      throw console.error(`Error executing operation "${e}":`, r), r;
    }
    return this;
  }
  grayscale(e = {}) {
    return this.execute("grayscale", e);
  }
  invert(e = {}) {
    return this.execute("invert", e);
  }
  border(e = {}) {
    return this.execute("border", e);
  }
  blur(e = {}) {
    return this.execute("blur", e);
  }
  threshold(e = {}) {
    return this.execute("threshold", e);
  }
  adaptiveThreshold(e = {}) {
    return this.execute("adaptiveThreshold", e);
  }
  canny(e = {}) {
    return this.execute("canny", e);
  }
  morphologicalGradient(e = {}) {
    return this.execute("morphologicalGradient", e);
  }
  erode(e = {}) {
    return this.execute("erode", e);
  }
  dilate(e = {}) {
    return this.execute("dilate", e);
  }
  resize(e) {
    return this.execute("resize", e);
  }
  warp(e) {
    return this.execute("warp", e);
  }
  rotate(e) {
    return this.execute("rotate", e);
  }
  convert(e) {
    return this.execute("convert", e);
  }
  destroy() {
    this.img.delete();
  }
  toMat() {
    return this.img;
  }
  toCanvas() {
    let e = D(this.width, this.height), t = e.getContext("2d"), r = t.createImageData(this.width, this.height);
    if (this.img.channels() === 1) {
      let i = r.data, o = new Uint8Array(this.img.data);
      for (let n = 0; n < o.length; n++)
        i[n * 4] = o[n], i[n * 4 + 1] = o[n], i[n * 4 + 2] = o[n], i[n * 4 + 3] = 255;
    } else
      r.data.set(new Uint8ClampedArray(this.img.data));
    return t.putImageData(r, 0, 0), e;
  }
}
let Ce = () => {
  if (typeof import.meta < "u" && import.meta.url) {
    let s = import.meta.url;
    return P.dirname(s);
  }
  return "";
}, N = Ce();
const Re = P.join(N, "models", "en_PP-OCRv3_det_infer.onnx"), Te = P.join(N, "models", "en_PP-OCRv3_rec_infer.onnx"), Oe = P.join(N, "models", "en_dict.txt"), ve = {
  detection: Re,
  recognition: Te,
  charactersDictionary: Oe
}, _ = {
  verbose: !1,
  debug: !1,
  debugFolder: "out"
}, U = {
  mean: [0.485, 0.456, 0.406],
  stdDeviation: [0.229, 0.224, 0.225],
  maxSideLength: 960,
  minimumAreaThreshold: 20,
  paddingVertical: 0.4,
  paddingHorizontal: 0.6
}, F = {
  imageHeight: 48,
  charactersDictionary: []
}, Ie = {
  model: ve,
  detection: U,
  recognition: F,
  debugging: _
}, I = class I {
  constructor(e, t = {}, r = {}) {
    m(this, "options");
    m(this, "debugging");
    m(this, "session");
    this.session = e, this.options = { ...U, ...t }, this.debugging = { ..._, ...r };
  }
  log(e) {
    this.debugging.verbose && console.log(`[DetectionService] ${e}`);
  }
  async run(e) {
    this.log("Starting text detection process");
    try {
      let t = await this.preprocessDetection(e), r = await this.runInference(t.tensor, t.width, t.height);
      if (!r)
        return console.error("Text detection failed (output tensor is null)"), [];
      let i = this.postprocessDetection(r, t);
      return this.debugging.debug && (await this.debugDetectionCanvas(r, t.width, t.height), await this.debugDetectedBoxes(e, i)), this.log(`Detected ${i.length} text boxes in image`), i;
    } catch (t) {
      return console.error("Error during text detection:", t instanceof Error ? t.message : String(t)), [];
    }
  }
  async preprocessDetection(e) {
    let t = e instanceof M ? e : await R.prepareCanvas(e);
    const { width: r, height: i } = t, { width: o, height: n, ratio: a } = this.calculateResizeDimensions(r, i);
    let c = new R(t), d = c.resize({ width: o, height: n }).toCanvas();
    c.destroy();
    let h = Math.ceil(o / 32) * 32, g = Math.ceil(n / 32) * 32, u = this.createPaddedCanvas(d, o, n, h, g), p = this.imageToTensor(u, h, g);
    return this.log(`Detection preprocessed: original(${r}x${i}), model_input(${h}x${g}), resize_ratio: ${a.toFixed(4)}`), { tensor: p, width: h, height: g, resizeRatio: a, originalWidth: r, originalHeight: i };
  }
  calculateResizeDimensions(e, t) {
    let r = this.options.maxSideLength, i = e, o = t, n = 1;
    return Math.max(o, i) > r && (n = r / (o > i ? o : i), i = Math.round(i * n), o = Math.round(o * n)), { width: i, height: o, ratio: n };
  }
  createPaddedCanvas(e, t, r, i, o) {
    let n = D(i, o);
    return n.getContext("2d").drawImage(e, 0, 0, t, r), n;
  }
  imageToTensor(e, t, r) {
    let n = e.getContext("2d").getImageData(0, 0, t, r).data, a = new Float32Array(I.NUM_CHANNELS * r * t);
    const { mean: c, stdDeviation: d } = this.options;
    for (let h = 0; h < r; h++)
      for (let g = 0; g < t; g++) {
        let u = (h * t + g) * 4, p = h * t + g;
        for (let f = 0; f < I.NUM_CHANNELS; f++) {
          let v = (n[u + f] / 255 - c[f]) / d[f];
          a[f * r * t + p] = v;
        }
      }
    return a;
  }
  async runInference(e, t, r) {
    try {
      this.log("Running detection inference...");
      let o = { x: new T.Tensor("float32", e, [1, 3, r, t]) }, a = (await this.session.run(o))[this.session.outputNames[0] || "sigmoid_0.tmp_0"];
      return this.log("Detection inference complete!"), a ? a.data : (console.error(`Output tensor ${this.session.outputNames[0]} not found in detection results`), null);
    } catch (i) {
      throw console.error("Error during model inference:", i instanceof Error ? i.message : String(i)), i;
    }
  }
  tensorToCanvas(e, t, r) {
    let i = D(t, r), o = i.getContext("2d"), n = o.createImageData(t, r), a = n.data;
    for (let c = 0; c < r; c++)
      for (let d = 0; d < t; d++) {
        let h = c * t + d, g = e[h] || 0, u = Math.round(g * 255), p = (c * t + d) * 4;
        a[p] = u, a[p + 1] = u, a[p + 2] = u, a[p + 3] = 255;
      }
    return o.putImageData(n, 0, 0), i;
  }
  postprocessDetection(e, t, r = this.options.minimumAreaThreshold || 20, i = this.options.paddingVertical || 0.4, o = this.options.paddingHorizontal || 0.6) {
    this.log("Post-processing detection results...");
    const { width: n, height: a, resizeRatio: c, originalWidth: d, originalHeight: h } = t;
    let g = this.tensorToCanvas(e, n, a), u = new R(g);
    u.grayscale().convert({ rtype: l.CV_8UC1 });
    let p = new xe(u.toMat(), { mode: l.RETR_LIST, method: l.CHAIN_APPROX_SIMPLE }), f = this.extractBoxesFromContours(p, n, a, c, d, h, r, i, o);
    return u.destroy(), p.destroy(), this.log(`Found ${f.length} potential text boxes`), f;
  }
  extractBoxesFromContours(e, t, r, i, o, n, a, c, d) {
    let h = [];
    return e.iterate((g) => {
      let u = e.getRect(g);
      if (u.width * u.height <= a)
        return;
      let p = this.applyPaddingToRect(u, t, r, c, d), f = this.convertToOriginalCoordinates(p, i, o, n);
      f.width > 5 && f.height > 5 && h.push(f);
    }), h;
  }
  applyPaddingToRect(e, t, r, i, o) {
    let n = Math.round(e.height * i), a = Math.round(e.height * o), c = e.x - a, d = e.y - n, h = e.width + 2 * a, g = e.height + 2 * n;
    c = Math.max(0, c), d = Math.max(0, d);
    let u = Math.min(t, e.x + e.width + a), p = Math.min(r, e.y + e.height + n);
    return h = u - c, g = p - d, { x: c, y: d, width: h, height: g };
  }
  convertToOriginalCoordinates(e, t, r, i) {
    let o = e.x / t, n = e.y / t, a = e.width / t, c = e.height / t, d = Math.max(0, Math.round(o)), h = Math.max(0, Math.round(n)), g = Math.min(r - d, Math.round(a)), u = Math.min(i - h, Math.round(c));
    return { x: d, y: h, width: g, height: u };
  }
  async debugDetectionCanvas(e, t, r) {
    let i = this.tensorToCanvas(e, t, r), o = this.debugging.debugFolder;
    await O.getInstance().saveImage({ canvas: i, filename: "detection-debug", path: o }), this.log(`Probability map visualized and saved to: ${o}`);
  }
  async debugDetectedBoxes(e, t) {
    let r = e instanceof M ? e : await R.prepareCanvas(e), i = r.getContext("2d"), o = O.getInstance();
    for (let a of t) {
      const { x: c, y: d, width: h, height: g } = a;
      o.drawLine({ ctx: i, x: c, y: d, width: h, height: g });
    }
    let n = this.debugging.debugFolder;
    await O.getInstance().saveImage({ canvas: r, filename: "boxes-debug", path: n }), this.log(`Boxes visualized and saved to: ${n}`);
  }
};
m(I, "NUM_CHANNELS", 3);
let S = I;
const b = class b {
  constructor(e, t = {}, r = {}) {
    m(this, "options");
    m(this, "debugging");
    m(this, "session");
    m(this, "toolkit");
    this.session = e, this.toolkit = O.getInstance(), this.options = { ...F, ...t }, this.debugging = { ..._, ...r };
  }
  log(e) {
    this.debugging.verbose && console.log(`[RecognitionService] ${e}`);
  }
  async run(e, t) {
    this.log("Starting text recognition process");
    try {
      let r = e instanceof M ? e : await R.prepareCanvas(e), i = this.filterValidBoxes(t), o = await this.processBoxesInParallel(r, i);
      return this.sortResultsByReadingOrder(o);
    } catch (r) {
      return console.error("Error during text recognition:", r instanceof Error ? r.message : String(r)), [];
    }
  }
  filterValidBoxes(e) {
    return e.map((t, r) => ({ box: t, index: r })).filter(({ box: t, index: r }) => this.isValidBox(t, r));
  }
  async processBoxesInParallel(e, t) {
    let r = this.debugging.debugFolder + "/crops";
    if (this.debugging.debug && this.toolkit.clearOutput(r), typeof window < "u") {
      const i = [];
      for (let o = 0; o < t.length; o++) {
        const { box: n, index: a } = t[o];
        await new Promise((c) => setTimeout(c, 10));
        try {
          const c = await this.processBox(e, n, a, t.length, r);
          c !== null && i.push(c);
        } catch (c) {
          console.error(`Error in sequential processBox ${a}:`, c);
        }
      }
      return i;
    } else {
      let i = t.map(({ box: n, index: a }) => this.processBox(e, n, a, t.length, r));
      return (await Promise.all(i)).filter((n) => n !== null);
    }
  }
  async processBox(e, t, r, i, o) {
    let n = Date.now();
    try {
      let a = this.cropRegion(e, t), c = await this.recognizeText(a);
      return this.debugging.debug && (await this.saveDebugCrop(a, r, o), this.logProcessingDetails(t, r, i, c, n)), { text: c, box: t };
    } catch (a) {
      return console.error(`Error processing box ${r + 1}: ${a.message}`, a.stack), null;
    }
  }
  sortResultsByReadingOrder(e) {
    return [...e].sort((t, r) => {
      let i = t.box, o = r.box;
      return Math.abs(i.y - o.y) < (i.height + o.height) / 4 ? i.x - o.x : i.y - o.y;
    });
  }
  isValidBox(e, t) {
    return e.width <= 0 || e.height <= 0 ? (console.warn(`Skipping invalid box ${t + 1}: w=${e.width}, h=${e.height}`), !1) : !0;
  }
  cropRegion(e, t) {
    return this.toolkit.crop({
      bbox: { x0: t.x, y0: t.y, x1: t.x + t.width, y1: t.y + t.height },
      canvas: e
    });
  }
  async saveDebugCrop(e, t, r) {
    await this.toolkit.saveImage({ canvas: e, filename: `crop_${String(t).padStart(3, "0")}.png`, path: r });
  }
  logProcessingDetails(e, t, r, i, o) {
    let n = Date.now() - o;
    this.log(`Box ${t + 1}/${r}: [x:${e.x}, y:${e.y}, w:${e.width}, h:${e.height}] → "${i}" (processed in ${n}ms)`);
  }
  async recognizeText(e) {
    const { imageTensor: t, tensorWidth: r, tensorHeight: i } = await this.preprocessImage(e);
    let o = new T.Tensor("float32", t, [1, 3, i, r]), n = await this.runInference(o);
    return this.decodeResults(n);
  }
  async preprocessImage(e) {
    let t = new R(e), r = this.options.imageHeight, i = t.width, o = t.height;
    if (o === 0 || i === 0)
      throw new Error(`Crop dimensions are zero: ${i}x${o}`);
    let n = i / o, a = Math.max(b.MIN_CROP_WIDTH, Math.round(r * n));
    t.resize({ width: a, height: r });
    let c = this.createImageTensor(t, a, r);
    return t.destroy(), { imageTensor: c, tensorWidth: a, tensorHeight: r };
  }
  createImageTensor(e, t, r) {
    let a = e.toCanvas().getContext("2d").getImageData(0, 0, t, r).data, c = 3, d = new Float32Array(c * r * t);
    for (let h = 0; h < r; h++)
      for (let g = 0; g < t; g++) {
        let u = (h * t + g) * 4, f = (a[u] / 255 - 0.5) / 0.5;
        for (let w = 0; w < c; w++) {
          let v = w * r * t + h * t + g;
          d[v] = f;
        }
      }
    return d;
  }
  async runInference(e) {
    let t = { x: e }, r = await this.session.run(t), i = Object.keys(r)[0], o = r[i];
    if (!o)
      throw new Error(`Recognition output tensor '${i}' not found. Available keys: ${Object.keys(r)}`);
    return o;
  }
  decodeResults(e) {
    let t = e.data, r = e.dims, i = r[1], o = r[2];
    return o !== this.options.charactersDictionary.length && console.warn(`Warning: Model output classes (${o}) does not match dictionary length (${this.options.charactersDictionary.length})`), this.ctcGreedyDecode(t, i, o, this.options.charactersDictionary);
  }
  ctcGreedyDecode(e, t, r, i) {
    let o = "", n = -1;
    for (let a = 0; a < t; a++) {
      const { index: c } = this.findMaxProbabilityClass(e, a, r);
      if (c === b.BLANK_INDEX || c === n) {
        n = c;
        continue;
      }
      this.isValidDictionaryIndex(c, i) ? this.appendCharacterToText(c, i, (d) => {
        o += d;
      }) : console.warn(`Decoded index ${c} out of bounds for charDict (length ${i.length}) at t=${a}`), n = c;
    }
    return o;
  }
  appendCharacterToText(e, t, r) {
    let i = t[e];
    if (e === t.length - 1) {
      if (i === b.UNK_TOKEN)
        return;
      r(" ");
      return;
    }
    r(i);
  }
  findMaxProbabilityClass(e, t, r) {
    let i = -1 / 0, o = 0;
    for (let n = 0; n < r; n++) {
      let a = e[t * r + n];
      a > i && (i = a, o = n);
    }
    return { value: i, index: o };
  }
  isValidDictionaryIndex(e, t) {
    return e >= 0 && e < t.length;
  }
};
m(b, "BLANK_INDEX", 0), m(b, "UNK_TOKEN", "<unk>"), m(b, "MIN_CROP_WIDTH", 8);
let $ = b;
const y = class y {
  constructor(e) {
    m(this, "options");
    m(this, "detectionSession", null);
    m(this, "recognitionSession", null);
    this.options = { ...Ie, ...e };
  }
  log(e) {
    var t;
    (t = this.options.debugging) != null && t.verbose && console.log(`[PaddleOcrService] ${e}`);
  }
  async initialize(e) {
    var t, r;
    try {
      let i = { ...this.options, ...e }, o = i.model.detection, n = i.model.recognition, a = i.model.charactersDictionary;
      if (typeof window < "u") {
        this.log(`Browser: Fetching dictionary from: ${a}`);
        const c = await fetch(a);
        if (!c.ok)
          throw new Error(`Failed to fetch characters dictionary: ${c.status} ${c.statusText}`);
        const h = (await c.text()).split(`
`);
        this.options.recognition.charactersDictionary = h, this.log(`Character dictionary loaded with ${h.length} entries.`), this.log(`Browser: Loading Detection model from: ${o}`);
        const u = o.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.detectionSession = await T.InferenceSession.create(o, u), this.log(`Browser: Loading Recognition model from: ${n}`);
        const f = n.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.recognitionSession = await T.InferenceSession.create(n, f);
      } else {
        let c = L(process.cwd(), o), d = L(process.cwd(), n), h = L(process.cwd(), a);
        this.log(`Node: Loading Detection ONNX model from: ${c}`);
        let g = A(c).buffer;
        const p = o.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.detectionSession = await T.InferenceSession.create(g, p), await new Promise((z) => setImmediate(z)), this.log(`Node: Loading Recognition ONNX model from: ${d}`);
        let f = A(d).buffer;
        const v = n.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.recognitionSession = await T.InferenceSession.create(f, v), await new Promise((z) => setImmediate(z)), this.log(`Node: Loading character dictionary from: ${h}`);
        let H = A(h, "utf-8").split(`
`);
        if (!H.length)
          throw new Error(`Character dictionary at ${h} is empty or not found.`);
        this.options.recognition.charactersDictionary = H;
      }
      this.log(`Initialization complete. Character dictionary has ${((r = (t = this.options.recognition) == null ? void 0 : t.charactersDictionary) == null ? void 0 : r.length) || 0} entries.`);
    } catch (i) {
      throw console.error("Failed to initialize PaddleOcrService:", i), i;
    }
  }
  static async getInstance(e) {
    return y.instance ? e && await y.instance.initialize(e) : (y.instance = new y(e), await y.instance.initialize()), y.instance;
  }
  isInitialized() {
    return this.detectionSession !== null && this.recognitionSession !== null;
  }
  static async changeModel(e) {
    return y.instance ? (await y.instance.destroy(), await y.instance.initialize(e)) : (y.instance = new y(e), await y.instance.initialize()), y.instance;
  }
  static async createInstance(e) {
    let t = new y(e);
    return await t.initialize(), t;
  }
  async recognize(e) {
    await R.initRuntime();
    let t = new S(this.detectionSession, this.options.detection, this.options.debugging), r = new $(this.recognitionSession, this.options.recognition, this.options.debugging), i = await t.run(e), o = await r.run(e, i);
    return this.groupResult(o);
  }
  groupResult(e) {
    let t = { text: "", lines: [] };
    if (!e.length)
      return t;
    let r = [e[0]], i = e[0].text, o = e[0].box.height;
    for (let n = 1; n < e.length; n++) {
      let a = e[n], c = e[n - 1], d = Math.abs(a.box.y - c.box.y), h = o * 0.5;
      d <= h ? (r.push(a), i += ` ${a.text}`, o = r.reduce((g, u) => g + u.box.height, 0) / r.length) : (t.lines.push([...r]), i += `
${a.text}`, r = [a], o = a.box.height);
    }
    return r.length > 0 && t.lines.push([...r]), t.text = i, t;
  }
  async destroy() {
    var e, t;
    await ((e = this.detectionSession) == null ? void 0 : e.release()), await ((t = this.recognitionSession) == null ? void 0 : t.release());
  }
};
m(y, "instance", null);
let B = y;
class Me {
  /**
   * Instantiate PaddleOCRClient
   * @param {object} options Configurations (e.g. { verbose: true, detection: { maxSideLength: 2000 } })
   */
  constructor(e = {}) {
    this.options = e, this.service = null;
  }
  /**
   * Initialize and load model assets via HTTP GET requests
   * @param {object} modelConfig Custom model paths, defaults to '/models/en_PP-OCRv3_det_infer.onnx', etc.
   */
  async init(e = {}) {
    const r = {
      ...{
        detection: "/models/en_PP-OCRv3_det_infer.onnx",
        recognition: "/models/en_PP-OCRv3_rec_infer.onnx",
        charactersDictionary: "/models/en_dict.txt"
      },
      ...e
    };
    this.service = new B({
      model: r,
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
  async recognize(e) {
    if (!this.service)
      throw new Error("PaddleOCRClient is not initialized. Please call init() first.");
    return this.service.recognize(e);
  }
}
typeof window < "u" && (window.PaddleOCRClient = Me);
export {
  Me as PaddleOCRClient,
  Me as default
};
