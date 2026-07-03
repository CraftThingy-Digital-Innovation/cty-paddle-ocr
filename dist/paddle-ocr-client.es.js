var W = Object.defineProperty;
var G = (a, t, e) => t in a ? W(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var m = (a, t, e) => G(a, typeof t != "symbol" ? t + "" : t, e);
import * as T from "onnxruntime-node";
import l from "@techstark/opencv-js";
import "onnxruntime-web";
function A(a, t) {
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
function k() {
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
function L(...a) {
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
const P = { resolve: L, join: E, dirname: V }, M = typeof HTMLCanvasElement < "u" ? HTMLCanvasElement : class {
};
function D(a, t) {
  const e = document.createElement("canvas");
  return e.width = a, e.height = t, e;
}
function j(a) {
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
class X {
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
let y = new X();
function K(a, t, e) {
  let i = y.getOperation(a);
  if (!i)
    throw new Error(`Operation "${a}" not found in registry`);
  let r = y.getDefaultOptionsGenerator(a), n = { ...(typeof r == "function" ? r : () => ({}))(), ...e };
  return i(t, n);
}
function Y() {
  return { upper: 255, method: l.ADAPTIVE_THRESH_GAUSSIAN_C, type: l.THRESH_BINARY_INV, size: 7, constant: 2 };
}
function q(a, t) {
  let e = new l.Mat();
  return l.adaptiveThreshold(a, e, t.upper, t.method, t.type, t.size, t.constant), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("adaptiveThreshold", q, Y);
function J() {
  return { size: [5, 5], sigma: 0 };
}
function Q(a, t) {
  let e = new l.Mat();
  return l.GaussianBlur(a, e, new l.Size(t.size[0], t.size[1]), t.sigma), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("blur", Q, J);
function Z() {
  return { size: 10, borderType: l.BORDER_CONSTANT, borderColor: [255, 255, 255, 255] };
}
function tt(a, t) {
  let e = new l.Mat();
  return l.copyMakeBorder(a, e, t.size, t.size, t.size, t.size, t.borderType, t.borderColor), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("border", tt, Z);
function et() {
  return { lower: 50, upper: 150 };
}
function it(a, t) {
  let e = new l.Mat();
  return l.Canny(a, e, t.lower, t.upper), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("canny", it, et);
function rt(a, t) {
  if (t.rtype === void 0)
    throw new Error("Invalid options: rtype is required");
  let e = new l.Mat();
  return a.convertTo(e, t.rtype), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("convert", rt);
function nt() {
  return { size: [5, 5], iter: 1 };
}
function ot(a, t) {
  let e = new l.Mat(), i = l.getStructuringElement(l.MORPH_RECT, new l.Size(t.size[0], t.size[1]));
  return l.dilate(a, e, i, new l.Point(-1, -1), t.iter), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("dilate", ot, nt);
function st() {
  return { size: [5, 5], iter: 1 };
}
function at(a, t) {
  let e = new l.Mat(), i = l.getStructuringElement(l.MORPH_RECT, new l.Size(t.size[0], t.size[1]));
  return l.erode(a, e, i, new l.Point(-1, -1), t.iter), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("erode", at, st);
function lt() {
  return {};
}
function ht(a, t) {
  let e = new l.Mat();
  return l.cvtColor(a, e, l.COLOR_RGBA2GRAY), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("grayscale", ht, lt);
function ct() {
  return {};
}
function dt(a, t) {
  let e = new l.Mat();
  return l.bitwise_not(a, e), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("invert", dt, ct);
function gt() {
  return { size: [3, 3] };
}
function ut(a, t) {
  let e = new l.Mat(), i = l.getStructuringElement(l.MORPH_RECT, new l.Size(t.size[0], t.size[1]));
  return l.morphologyEx(a, e, l.MORPH_GRADIENT, i), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("morphologicalGradient", ut, gt);
function ft(a, t) {
  if (!t.width || !t.height)
    throw new Error("Invalid options: width and height are required");
  let e = new l.Mat();
  return l.resize(a, e, new l.Size(t.width, t.height)), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("resize", ft);
function pt(a, t) {
  let e = t.center || new l.Point(a.cols / 2, a.rows / 2), i = l.getRotationMatrix2D(e, t.angle, 1), r = new l.Size(a.cols, a.rows), o = new l.Mat();
  return l.warpAffine(a, o, i, r, l.INTER_LINEAR, l.BORDER_CONSTANT, new l.Scalar()), a.delete(), i.delete(), { img: o, width: o.cols, height: o.rows };
}
y.register("rotate", pt);
function mt() {
  return { lower: 0, upper: 255, type: l.THRESH_BINARY_INV + l.THRESH_OTSU };
}
function wt(a, t) {
  let e = new l.Mat();
  return l.threshold(a, e, t.lower, t.upper, t.type), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("threshold", wt, mt);
function xt(a, t) {
  if (!t.points || !t.bbox)
    throw new Error("Invalid options: points and bbox are required");
  const { points: e, bbox: i } = t;
  let r = new l.Mat(), o = i.x1 - i.x0, n = i.y1 - i.y0, s = [0, 0, o - 1, 0, o - 1, n - 1, 0, n - 1], h = [e.topLeft.x, e.topLeft.y, e.topRight.x, e.topRight.y, e.bottomRight.x, e.bottomRight.y, e.bottomLeft.x, e.bottomLeft.y], d = l.matFromArray(4, 1, l.CV_32FC2, s), c = l.matFromArray(4, 1, l.CV_32FC2, h), g = l.getPerspectiveTransform(c, d), u = new l.Size(o, n);
  return l.warpPerspective(a, r, g, u), g.delete(), c.delete(), d.delete(), a.delete(), { img: r, width: r.cols, height: r.rows };
}
y.register("warp", xt);
const C = class C {
  constructor() {
    m(this, "step", 0);
  }
  static getInstance() {
    return C.instance || (C.instance = new C()), C.instance;
  }
  crop(t) {
    const { bbox: e, canvas: i } = t;
    let r = D(e.x1 - e.x0, e.y1 - e.y0);
    return r.getContext("2d").drawImage(i, e.x0, e.y0, e.x1 - e.x0, e.y1 - e.y0, 0, 0, r.width, r.height), r;
  }
  isDirty(t) {
    const { canvas: e, threshold: i = 127.5, majorColorThreshold: r = 0.97 } = t;
    let o = 0, n = 0, s = this.crop({ bbox: { x0: e.width * 0.1, y0: e.height * 0.1, x1: e.width * 0.9, y1: e.height * 0.9 }, canvas: e }), d = s.getContext("2d").getImageData(0, 0, s.width, s.height).data;
    for (let g = 0; g < d.length; g += 4) {
      let u = d[g], f = d[g + 1], p = d[g + 2];
      u >= i && f >= i && p >= i ? o++ : n++;
    }
    return Math.max(o, n) / (n + o) < r;
  }
  saveImage(t) {
    const { canvas: e, filename: i, path: r = "out" } = t;
    let o = E(process.cwd(), r);
    E(o, `${this.step++}. ${i}.png`);
    let n = k(), s = e.toBuffer("image/png");
    return new Promise((h, d) => {
      n.write(s, (c) => {
        c ? d(c) : h();
      });
    });
  }
  clearOutput(t = "out") {
    E(process.cwd(), t);
  }
  drawLine(t) {
    const { ctx: e, x: i, y: r, width: o, height: n, lineWidth: s = 2, color: h = "blue" } = t;
    e.beginPath(), e.strokeStyle = h, e.lineWidth = s, e.strokeRect(i, r, o, n), e.closePath();
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
let R = C;
class yt {
  constructor(t, e = {}) {
    m(this, "contours");
    let i = { ...bt(), ...e };
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
    let o = l.minAreaRect(i), n = l.RotatedRect.points(o), s = { topLeft: { x: 0, y: 0 }, topRight: { x: 0, y: 0 }, bottomRight: { x: 0, y: 0 }, bottomLeft: { x: 0, y: 0 } }, h = n.map((w) => w.x + w.y), d = n.map((w) => w.y - w.x), c = h.indexOf(Math.min(...h)), g = d.indexOf(Math.min(...d)), u = h.indexOf(Math.max(...h)), f = d.indexOf(Math.max(...d));
    if (!n[c] || !n[g] || !n[u] || !n[f])
      return { points: { topLeft: { x: r.x0, y: r.y0 }, topRight: { x: r.x1, y: r.y0 }, bottomLeft: { x: r.x0, y: r.y1 }, bottomRight: { x: r.x1, y: r.y1 } }, bbox: r };
    s.topLeft = { x: n[c].x, y: n[c].y }, s.topRight = { x: n[g].x, y: n[g].y }, s.bottomRight = { x: n[u].x, y: n[u].y }, s.bottomLeft = { x: n[f].x, y: n[f].y }, i.delete();
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
function bt() {
  return { mode: l.RETR_EXTERNAL, method: l.CHAIN_APPROX_SIMPLE };
}
class I {
  constructor(t) {
    m(this, "img");
    m(this, "width");
    m(this, "height");
    if (t instanceof M) {
      let i = t.getContext("2d").getImageData(0, 0, t.width, t.height);
      this.img = l.matFromImageData(i), this.width = t.width, this.height = t.height;
    } else if (t instanceof l.Mat)
      this.img = t, this.width = t.cols, this.height = t.rows;
    else
      throw new Error("Invalid source type. Must be either Canvas or cv.Mat.");
  }
  static async prepareCanvas(t) {
    if (t instanceof M) return t;
    let e = await j(t), i = D(e.width, e.height);
    return i.getContext("2d").drawImage(e, 0, 0), i;
  }
  static async prepareBuffer(t) {
    if (t instanceof ArrayBuffer) return t;
    if (typeof t.toBuffer == "function") {
      let o = t.toBuffer("image/png"), n = new ArrayBuffer(o.byteLength);
      return new Uint8Array(n).set(new Uint8Array(o)), n;
    }
    if (typeof t.toDataURL == "function") {
      let n = t.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""), s = Buffer.from(n, "base64"), h = new ArrayBuffer(s.byteLength);
      return new Uint8Array(h).set(new Uint8Array(s)), h;
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
    if (!y.hasOperation(t))
      throw new Error(`Operation "${t}" not found`);
    try {
      let i = K(t, this.img, e);
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
    let t = D(this.width, this.height), e = t.getContext("2d"), i = e.createImageData(this.width, this.height);
    if (this.img.channels() === 1) {
      let r = i.data, o = new Uint8Array(this.img.data);
      for (let n = 0; n < o.length; n++)
        r[n * 4] = o[n], r[n * 4 + 1] = o[n], r[n * 4 + 2] = o[n], r[n * 4 + 3] = 255;
    } else
      i.data.set(new Uint8ClampedArray(this.img.data));
    return e.putImageData(i, 0, 0), t;
  }
}
let Ct = () => {
  if (typeof import.meta < "u" && import.meta.url) {
    let a = import.meta.url;
    return P.dirname(a);
  }
  return "";
}, N = Ct();
const It = P.join(N, "models", "en_PP-OCRv3_det_infer.onnx"), Tt = P.join(N, "models", "en_PP-OCRv3_rec_infer.onnx"), Rt = P.join(N, "models", "en_dict.txt"), Ot = {
  detection: It,
  recognition: Tt,
  charactersDictionary: Rt
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
}, vt = {
  model: Ot,
  detection: U,
  recognition: F,
  debugging: _
}, v = class v {
  constructor(t, e = {}, i = {}) {
    m(this, "options");
    m(this, "debugging");
    m(this, "session");
    this.session = t, this.options = { ...U, ...e }, this.debugging = { ..._, ...i };
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
    let e = t instanceof M ? t : await I.prepareCanvas(t);
    const { width: i, height: r } = e, { width: o, height: n, ratio: s } = this.calculateResizeDimensions(i, r);
    let h = new I(e), d = h.resize({ width: o, height: n }).toCanvas();
    h.destroy();
    let c = Math.ceil(o / 32) * 32, g = Math.ceil(n / 32) * 32, u = this.createPaddedCanvas(d, o, n, c, g), f = this.imageToTensor(u, c, g);
    return this.log(`Detection preprocessed: original(${i}x${r}), model_input(${c}x${g}), resize_ratio: ${s.toFixed(4)}`), { tensor: f, width: c, height: g, resizeRatio: s, originalWidth: i, originalHeight: r };
  }
  calculateResizeDimensions(t, e) {
    let i = this.options.maxSideLength, r = t, o = e, n = 1;
    return Math.max(o, r) > i && (n = i / (o > r ? o : r), r = Math.round(r * n), o = Math.round(o * n)), { width: r, height: o, ratio: n };
  }
  createPaddedCanvas(t, e, i, r, o) {
    let n = D(r, o);
    return n.getContext("2d").drawImage(t, 0, 0, e, i), n;
  }
  imageToTensor(t, e, i) {
    let n = t.getContext("2d").getImageData(0, 0, e, i).data, s = new Float32Array(v.NUM_CHANNELS * i * e);
    const { mean: h, stdDeviation: d } = this.options;
    for (let c = 0; c < i; c++)
      for (let g = 0; g < e; g++) {
        let u = (c * e + g) * 4, f = c * e + g;
        for (let p = 0; p < v.NUM_CHANNELS; p++) {
          let O = (n[u + p] / 255 - h[p]) / d[p];
          s[p * i * e + f] = O;
        }
      }
    return s;
  }
  async runInference(t, e, i) {
    try {
      this.log("Running detection inference...");
      let o = { x: new T.Tensor("float32", t, [1, 3, i, e]) }, s = (await this.session.run(o))[this.session.outputNames[0] || "sigmoid_0.tmp_0"];
      return this.log("Detection inference complete!"), s ? s.data : (console.error(`Output tensor ${this.session.outputNames[0]} not found in detection results`), null);
    } catch (r) {
      throw console.error("Error during model inference:", r instanceof Error ? r.message : String(r)), r;
    }
  }
  tensorToCanvas(t, e, i) {
    let r = D(e, i), o = r.getContext("2d"), n = o.createImageData(e, i), s = n.data;
    for (let h = 0; h < i; h++)
      for (let d = 0; d < e; d++) {
        let c = h * e + d, g = t[c] || 0, u = Math.round(g * 255), f = (h * e + d) * 4;
        s[f] = u, s[f + 1] = u, s[f + 2] = u, s[f + 3] = 255;
      }
    return o.putImageData(n, 0, 0), r;
  }
  postprocessDetection(t, e, i = this.options.minimumAreaThreshold || 20, r = this.options.paddingVertical || 0.4, o = this.options.paddingHorizontal || 0.6) {
    this.log("Post-processing detection results...");
    const { width: n, height: s, resizeRatio: h, originalWidth: d, originalHeight: c } = e;
    let g = this.tensorToCanvas(t, n, s), u = new I(g);
    u.grayscale().convert({ rtype: l.CV_8UC1 });
    let f = new yt(u.toMat(), { mode: l.RETR_LIST, method: l.CHAIN_APPROX_SIMPLE }), p = this.extractBoxesFromContours(f, n, s, h, d, c, i, r, o);
    return u.destroy(), f.destroy(), this.log(`Found ${p.length} potential text boxes`), p;
  }
  extractBoxesFromContours(t, e, i, r, o, n, s, h, d) {
    let c = [];
    return t.iterate((g) => {
      let u = t.getRect(g);
      if (u.width * u.height <= s)
        return;
      let f = this.applyPaddingToRect(u, e, i, h, d), p = this.convertToOriginalCoordinates(f, r, o, n);
      p.width > 5 && p.height > 5 && c.push(p);
    }), c;
  }
  applyPaddingToRect(t, e, i, r, o) {
    let n = Math.round(t.height * r), s = Math.round(t.height * o), h = t.x - s, d = t.y - n, c = t.width + 2 * s, g = t.height + 2 * n;
    h = Math.max(0, h), d = Math.max(0, d);
    let u = Math.min(e, t.x + t.width + s), f = Math.min(i, t.y + t.height + n);
    return c = u - h, g = f - d, { x: h, y: d, width: c, height: g };
  }
  convertToOriginalCoordinates(t, e, i, r) {
    let o = t.x / e, n = t.y / e, s = t.width / e, h = t.height / e, d = Math.max(0, Math.round(o)), c = Math.max(0, Math.round(n)), g = Math.min(i - d, Math.round(s)), u = Math.min(r - c, Math.round(h));
    return { x: d, y: c, width: g, height: u };
  }
  async debugDetectionCanvas(t, e, i) {
    let r = this.tensorToCanvas(t, e, i), o = this.debugging.debugFolder;
    await R.getInstance().saveImage({ canvas: r, filename: "detection-debug", path: o }), this.log(`Probability map visualized and saved to: ${o}`);
  }
  async debugDetectedBoxes(t, e) {
    let i = t instanceof M ? t : await I.prepareCanvas(t), r = i.getContext("2d"), o = R.getInstance();
    for (let s of e) {
      const { x: h, y: d, width: c, height: g } = s;
      o.drawLine({ ctx: r, x: h, y: d, width: c, height: g });
    }
    let n = this.debugging.debugFolder;
    await R.getInstance().saveImage({ canvas: i, filename: "boxes-debug", path: n }), this.log(`Boxes visualized and saved to: ${n}`);
  }
};
m(v, "NUM_CHANNELS", 3);
let S = v;
const b = class b {
  constructor(t, e = {}, i = {}) {
    m(this, "options");
    m(this, "debugging");
    m(this, "session");
    m(this, "toolkit");
    this.session = t, this.toolkit = R.getInstance(), this.options = { ...F, ...e }, this.debugging = { ..._, ...i };
  }
  log(t) {
    this.debugging.verbose && console.log(`[RecognitionService] ${t}`);
  }
  async run(t, e) {
    this.log("Starting text recognition process");
    try {
      let i = t instanceof M ? t : await I.prepareCanvas(t), r = this.filterValidBoxes(e), o = await this.processBoxesInParallel(i, r);
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
        await new Promise((h) => setTimeout(h, 10));
        try {
          const h = await this.processBox(t, n, s, e.length, i);
          h !== null && r.push(h);
        } catch (h) {
          console.error(`Error in sequential processBox ${s}:`, h);
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
      let s = this.cropRegion(t, e), h = await this.recognizeText(s);
      return this.debugging.debug && (await this.saveDebugCrop(s, i, o), this.logProcessingDetails(e, i, r, h, n)), { text: h, box: e };
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
    let o = new T.Tensor("float32", e, [1, 3, r, i]), n = await this.runInference(o);
    return this.decodeResults(n);
  }
  async preprocessImage(t) {
    let e = new I(t), i = this.options.imageHeight, r = e.width, o = e.height;
    if (o === 0 || r === 0)
      throw new Error(`Crop dimensions are zero: ${r}x${o}`);
    let n = r / o, s = Math.max(b.MIN_CROP_WIDTH, Math.round(i * n));
    e.resize({ width: s, height: i });
    let h = this.createImageTensor(e, s, i);
    return e.destroy(), { imageTensor: h, tensorWidth: s, tensorHeight: i };
  }
  createImageTensor(t, e, i) {
    let s = t.toCanvas().getContext("2d").getImageData(0, 0, e, i).data, h = 3, d = new Float32Array(h * i * e);
    for (let c = 0; c < i; c++)
      for (let g = 0; g < e; g++) {
        let u = (c * e + g) * 4, p = (s[u] / 255 - 0.5) / 0.5;
        for (let w = 0; w < h; w++) {
          let O = w * i * e + c * e + g;
          d[O] = p;
        }
      }
    return d;
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
      const { index: h } = this.findMaxProbabilityClass(t, s, i);
      if (h === b.BLANK_INDEX || h === n) {
        n = h;
        continue;
      }
      this.isValidDictionaryIndex(h, r) ? this.appendCharacterToText(h, r, (d) => {
        o += d;
      }) : console.warn(`Decoded index ${h} out of bounds for charDict (length ${r.length}) at t=${s}`), n = h;
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
let $ = b;
const x = class x {
  constructor(t) {
    m(this, "options");
    m(this, "detectionSession", null);
    m(this, "recognitionSession", null);
    this.options = { ...vt, ...t };
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
        const h = await fetch(s);
        if (!h.ok)
          throw new Error(`Failed to fetch characters dictionary: ${h.status} ${h.statusText}`);
        const c = (await h.text()).split(`
`);
        this.options.recognition.charactersDictionary = c, this.log(`Character dictionary loaded with ${c.length} entries.`), this.log(`Browser: Loading Detection model from: ${o}`);
        const u = o.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.detectionSession = await T.InferenceSession.create(o, u), this.log(`Browser: Loading Recognition model from: ${n}`);
        const p = n.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.recognitionSession = await T.InferenceSession.create(n, p);
      } else {
        let h = L(process.cwd(), o), d = L(process.cwd(), n), c = L(process.cwd(), s);
        this.log(`Node: Loading Detection ONNX model from: ${h}`);
        let g = A(h).buffer;
        const f = o.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.detectionSession = await T.InferenceSession.create(g, f), await new Promise((z) => setImmediate(z)), this.log(`Node: Loading Recognition ONNX model from: ${d}`);
        let p = A(d).buffer;
        const O = n.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {};
        this.recognitionSession = await T.InferenceSession.create(p, O), await new Promise((z) => setImmediate(z)), this.log(`Node: Loading character dictionary from: ${c}`);
        let H = A(c, "utf-8").split(`
`);
        if (!H.length)
          throw new Error(`Character dictionary at ${c} is empty or not found.`);
        this.options.recognition.charactersDictionary = H;
      }
      this.log(`Initialization complete. Character dictionary has ${((i = (e = this.options.recognition) == null ? void 0 : e.charactersDictionary) == null ? void 0 : i.length) || 0} entries.`);
    } catch (r) {
      throw console.error("Failed to initialize PaddleOcrService:", r), r;
    }
  }
  static async getInstance(t) {
    return x.instance ? t && await x.instance.initialize(t) : (x.instance = new x(t), await x.instance.initialize()), x.instance;
  }
  isInitialized() {
    return this.detectionSession !== null && this.recognitionSession !== null;
  }
  static async changeModel(t) {
    return x.instance ? (await x.instance.destroy(), await x.instance.initialize(t)) : (x.instance = new x(t), await x.instance.initialize()), x.instance;
  }
  static async createInstance(t) {
    let e = new x(t);
    return await e.initialize(), e;
  }
  async recognize(t) {
    await I.initRuntime();
    let e = new S(this.detectionSession, this.options.detection, this.options.debugging), i = new $(this.recognitionSession, this.options.recognition, this.options.debugging), r = await e.run(t), o = await i.run(t, r);
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
      let s = t[n], h = t[n - 1], d = Math.abs(s.box.y - h.box.y), c = o * 0.5;
      if (d <= c)
        i.push(s), r += ` ${s.text}`, o = i.reduce((g, u) => g + u.box.height, 0) / i.length;
      else {
        const g = i.map((f) => f.text).join(" "), u = this.getEncompassingBox(i);
        e.lines.push({
          text: g,
          box: u,
          words: [...i]
        }), r += `
${s.text}`, i = [s], o = s.box.height;
      }
    }
    if (i.length > 0) {
      const n = i.map((h) => h.text).join(" "), s = this.getEncompassingBox(i);
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
m(x, "instance", null);
let B = x;
class Mt {
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
typeof window < "u" && (window.PaddleOCRClient = Mt);
export {
  Mt as PaddleOCRClient,
  Mt as default
};
