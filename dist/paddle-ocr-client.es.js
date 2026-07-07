var Y = Object.defineProperty;
var q = (a, t, e) => t in a ? Y(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var m = (a, t, e) => q(a, typeof t != "symbol" ? t + "" : t, e);
import * as I from "onnxruntime-node";
import l from "@techstark/opencv-js";
import "onnxruntime-web";
function O(a, t) {
  const e = typeof t == "string" && t.toLowerCase().includes("utf-8") || typeof t == "object" && t.encoding && t.encoding.toLowerCase().includes("utf-8"), i = new XMLHttpRequest();
  if (i.open("GET", a, !1), e) {
    if (i.send(), i.status !== 200 && i.status !== 0)
      throw new Error(`Failed to read text file at ${a}: HTTP ${i.status}`);
    return i.responseText;
  } else {
    if (i.overrideMimeType("text/plain; charset=x-user-defined"), i.send(), i.status !== 200 && i.status !== 0)
      throw new Error(`Failed to read binary file at ${a}: HTTP ${i.status}`);
    const r = i.responseText, n = r.length, o = new Uint8Array(n);
    for (let s = 0; s < n; s++)
      o[s] = r.charCodeAt(s) & 255;
    return {
      buffer: o.buffer,
      byteLength: o.byteLength
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
function N() {
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
  readFileSync: O,
  existsSync: W,
  mkdirSync: F,
  readdirSync: k,
  unlinkSync: j,
  createWriteStream: N
}, Q = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createWriteStream: N,
  default: J,
  existsSync: W,
  mkdirSync: F,
  readFileSync: O,
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
const $ = { resolve: M, join: E, dirname: V }, Z = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $,
  dirname: V,
  join: E,
  resolve: M
}, Symbol.toStringTag, { value: "Module" })), D = typeof HTMLCanvasElement < "u" ? HTMLCanvasElement : class {
};
function L(a, t) {
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
let y = new et();
function it(a, t, e) {
  let i = y.getOperation(a);
  if (!i)
    throw new Error(`Operation "${a}" not found in registry`);
  let r = y.getDefaultOptionsGenerator(a), o = { ...(typeof r == "function" ? r : () => ({}))(), ...e };
  return i(t, o);
}
function rt() {
  return { upper: 255, method: l.ADAPTIVE_THRESH_GAUSSIAN_C, type: l.THRESH_BINARY_INV, size: 7, constant: 2 };
}
function nt(a, t) {
  let e = new l.Mat();
  return l.adaptiveThreshold(a, e, t.upper, t.method, t.type, t.size, t.constant), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("adaptiveThreshold", nt, rt);
function ot() {
  return { size: [5, 5], sigma: 0 };
}
function st(a, t) {
  let e = new l.Mat();
  return l.GaussianBlur(a, e, new l.Size(t.size[0], t.size[1]), t.sigma), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("blur", st, ot);
function at() {
  return { size: 10, borderType: l.BORDER_CONSTANT, borderColor: [255, 255, 255, 255] };
}
function lt(a, t) {
  let e = new l.Mat();
  return l.copyMakeBorder(a, e, t.size, t.size, t.size, t.size, t.borderType, t.borderColor), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("border", lt, at);
function ct() {
  return { lower: 50, upper: 150 };
}
function ht(a, t) {
  let e = new l.Mat();
  return l.Canny(a, e, t.lower, t.upper), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("canny", ht, ct);
function dt(a, t) {
  if (t.rtype === void 0)
    throw new Error("Invalid options: rtype is required");
  let e = new l.Mat();
  return a.convertTo(e, t.rtype), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("convert", dt);
function ut() {
  return { size: [5, 5], iter: 1 };
}
function gt(a, t) {
  let e = new l.Mat(), i = l.getStructuringElement(l.MORPH_RECT, new l.Size(t.size[0], t.size[1]));
  return l.dilate(a, e, i, new l.Point(-1, -1), t.iter), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("dilate", gt, ut);
function ft() {
  return { size: [5, 5], iter: 1 };
}
function pt(a, t) {
  let e = new l.Mat(), i = l.getStructuringElement(l.MORPH_RECT, new l.Size(t.size[0], t.size[1]));
  return l.erode(a, e, i, new l.Point(-1, -1), t.iter), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("erode", pt, ft);
function mt() {
  return {};
}
function wt(a, t) {
  let e = new l.Mat();
  return l.cvtColor(a, e, l.COLOR_RGBA2GRAY), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("grayscale", wt, mt);
function xt() {
  return {};
}
function yt(a, t) {
  let e = new l.Mat();
  return l.bitwise_not(a, e), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("invert", yt, xt);
function bt() {
  return { size: [3, 3] };
}
function vt(a, t) {
  let e = new l.Mat(), i = l.getStructuringElement(l.MORPH_RECT, new l.Size(t.size[0], t.size[1]));
  return l.morphologyEx(a, e, l.MORPH_GRADIENT, i), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("morphologicalGradient", vt, bt);
function Tt(a, t) {
  if (!t.width || !t.height)
    throw new Error("Invalid options: width and height are required");
  let e = new l.Mat();
  return l.resize(a, e, new l.Size(t.width, t.height)), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("resize", Tt);
function Ct(a, t) {
  let e = t.center || new l.Point(a.cols / 2, a.rows / 2), i = l.getRotationMatrix2D(e, t.angle, 1), r = new l.Size(a.cols, a.rows), n = new l.Mat();
  return l.warpAffine(a, n, i, r, l.INTER_LINEAR, l.BORDER_CONSTANT, new l.Scalar()), a.delete(), i.delete(), { img: n, width: n.cols, height: n.rows };
}
y.register("rotate", Ct);
function It() {
  return { lower: 0, upper: 255, type: l.THRESH_BINARY_INV + l.THRESH_OTSU };
}
function Rt(a, t) {
  let e = new l.Mat();
  return l.threshold(a, e, t.lower, t.upper, t.type), a.delete(), { img: e, width: e.cols, height: e.rows };
}
y.register("threshold", Rt, It);
function Ot(a, t) {
  if (!t.points || !t.bbox)
    throw new Error("Invalid options: points and bbox are required");
  const { points: e, bbox: i } = t;
  let r = new l.Mat(), n = i.x1 - i.x0, o = i.y1 - i.y0, s = [0, 0, n - 1, 0, n - 1, o - 1, 0, o - 1], c = [e.topLeft.x, e.topLeft.y, e.topRight.x, e.topRight.y, e.bottomRight.x, e.bottomRight.y, e.bottomLeft.x, e.bottomLeft.y], u = l.matFromArray(4, 1, l.CV_32FC2, s), h = l.matFromArray(4, 1, l.CV_32FC2, c), d = l.getPerspectiveTransform(h, u), g = new l.Size(n, o);
  return l.warpPerspective(a, r, d, g), d.delete(), h.delete(), u.delete(), a.delete(), { img: r, width: r.cols, height: r.rows };
}
y.register("warp", Ot);
const T = class T {
  constructor() {
    m(this, "step", 0);
  }
  static getInstance() {
    return T.instance || (T.instance = new T()), T.instance;
  }
  crop(t) {
    const { bbox: e, canvas: i } = t;
    let r = L(e.x1 - e.x0, e.y1 - e.y0);
    return r.getContext("2d").drawImage(i, e.x0, e.y0, e.x1 - e.x0, e.y1 - e.y0, 0, 0, r.width, r.height), r;
  }
  isDirty(t) {
    const { canvas: e, threshold: i = 127.5, majorColorThreshold: r = 0.97 } = t;
    let n = 0, o = 0, s = this.crop({ bbox: { x0: e.width * 0.1, y0: e.height * 0.1, x1: e.width * 0.9, y1: e.height * 0.9 }, canvas: e }), u = s.getContext("2d").getImageData(0, 0, s.width, s.height).data;
    for (let d = 0; d < u.length; d += 4) {
      let g = u[d], f = u[d + 1], p = u[d + 2];
      g >= i && f >= i && p >= i ? n++ : o++;
    }
    return Math.max(n, o) / (o + n) < r;
  }
  saveImage(t) {
    const { canvas: e, filename: i, path: r = "out" } = t;
    let n = E(process.cwd(), r);
    E(n, `${this.step++}. ${i}.png`);
    let o = N(), s = e.toBuffer("image/png");
    return new Promise((c, u) => {
      o.write(s, (h) => {
        h ? u(h) : c();
      });
    });
  }
  clearOutput(t = "out") {
    E(process.cwd(), t);
  }
  drawLine(t) {
    const { ctx: e, x: i, y: r, width: n, height: o, lineWidth: s = 2, color: c = "blue" } = t;
    e.beginPath(), e.strokeStyle = c, e.lineWidth = s, e.strokeRect(i, r, n, o), e.closePath();
  }
  drawContour(t) {
    const { ctx: e, contour: i, strokeStyle: r = "red", lineWidth: n = 2 } = t;
    let o = i.data32S;
    if (!(o.length < 4)) {
      e.strokeStyle = r, e.lineWidth = n, e.beginPath(), e.moveTo(o[0], o[1]);
      for (let s = 2; s < o.length; s += 2)
        e.lineTo(o[s], o[s + 1]);
      e.closePath(), e.stroke();
    }
  }
};
m(T, "instance", null);
let R = T;
class Mt {
  constructor(t, e = {}) {
    m(this, "contours");
    let i = { ...Et(), ...e };
    if (t instanceof l.Mat) {
      let r = new l.MatVector(), n = new l.Mat();
      try {
        l.findContours(t, r, n, i.mode, i.method);
      } catch (o) {
        throw o;
      }
      n.delete(), this.contours = r;
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
    let n = l.minAreaRect(i), o = l.RotatedRect.points(n), s = { topLeft: { x: 0, y: 0 }, topRight: { x: 0, y: 0 }, bottomRight: { x: 0, y: 0 }, bottomLeft: { x: 0, y: 0 } }, c = o.map((w) => w.x + w.y), u = o.map((w) => w.y - w.x), h = c.indexOf(Math.min(...c)), d = u.indexOf(Math.min(...u)), g = c.indexOf(Math.max(...c)), f = u.indexOf(Math.max(...u));
    if (!o[h] || !o[d] || !o[g] || !o[f])
      return { points: { topLeft: { x: r.x0, y: r.y0 }, topRight: { x: r.x1, y: r.y0 }, bottomLeft: { x: r.x0, y: r.y1 }, bottomRight: { x: r.x1, y: r.y1 } }, bbox: r };
    s.topLeft = { x: o[h].x, y: o[h].y }, s.topRight = { x: o[d].x, y: o[d].y }, s.bottomRight = { x: o[g].x, y: o[g].y }, s.bottomLeft = { x: o[f].x, y: o[f].y }, i.delete();
    let p = (w) => (w.x = Math.max(0, Math.min(e.width, w.x)), w.y = Math.max(0, Math.min(e.height, w.y)), w);
    return s.topLeft = p(s.topLeft), s.topRight = p(s.topRight), s.bottomLeft = p(s.bottomLeft), s.bottomRight = p(s.bottomRight), { points: s, bbox: r };
  }
  getApproximateRectangleContour(t) {
    const { threshold: e = 0.02, contour: i = this.getLargestContourArea() } = t ?? {};
    if (!i) return;
    let r = e * l.arcLength(i, !0), n = new l.Mat();
    return l.approxPolyDP(i, n, r, !0), i.delete(), n;
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
class C {
  constructor(t) {
    m(this, "img");
    m(this, "width");
    m(this, "height");
    if (t instanceof D) {
      let i = t.getContext("2d").getImageData(0, 0, t.width, t.height);
      this.img = l.matFromImageData(i), this.width = t.width, this.height = t.height;
    } else if (t instanceof l.Mat)
      this.img = t, this.width = t.cols, this.height = t.rows;
    else
      throw new Error("Invalid source type. Must be either Canvas or cv.Mat.");
  }
  static async prepareCanvas(t) {
    if (t instanceof D) return t;
    let e = await tt(t), i = L(e.width, e.height);
    return i.getContext("2d").drawImage(e, 0, 0), i;
  }
  static async prepareBuffer(t) {
    if (t instanceof ArrayBuffer) return t;
    if (typeof t.toBuffer == "function") {
      let n = t.toBuffer("image/png"), o = new ArrayBuffer(n.byteLength);
      return new Uint8Array(o).set(new Uint8Array(n)), o;
    }
    if (typeof t.toDataURL == "function") {
      let o = t.toDataURL("image/png").replace(/^data:image\/png;base64,/, ""), s = Buffer.from(o, "base64"), c = new ArrayBuffer(s.byteLength);
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
    if (!y.hasOperation(t))
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
    let t = L(this.width, this.height), e = t.getContext("2d"), i = e.createImageData(this.width, this.height);
    if (this.img.channels() === 1) {
      let r = i.data, n = new Uint8Array(this.img.data);
      for (let o = 0; o < n.length; o++)
        r[o * 4] = n[o], r[o * 4 + 1] = n[o], r[o * 4 + 2] = n[o], r[o * 4 + 3] = 255;
    } else
      i.data.set(new Uint8ClampedArray(this.img.data));
    return e.putImageData(i, 0, 0), t;
  }
}
let Pt = () => {
  if (typeof import.meta < "u" && import.meta.url) {
    let a = import.meta.url;
    return $.dirname(a);
  }
  return "";
}, U = Pt();
const Dt = $.join(U, "models", "en_PP-OCRv3_det_infer.onnx"), Lt = $.join(U, "models", "en_PP-OCRv3_rec_infer.onnx"), $t = $.join(U, "models", "en_dict.txt"), St = {
  detection: Dt,
  recognition: Lt,
  charactersDictionary: $t
}, G = {
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
  model: St,
  detection: X,
  recognition: K,
  debugging: G
}, P = class P {
  constructor(t, e = {}, i = {}) {
    m(this, "options");
    m(this, "debugging");
    m(this, "session");
    this.session = t, this.options = { ...X, ...e }, this.debugging = { ...G, ...i };
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
    let e = t instanceof D ? t : await C.prepareCanvas(t);
    const { width: i, height: r } = e, { width: n, height: o, ratio: s } = this.calculateResizeDimensions(i, r);
    let c = new C(e), u = c.resize({ width: n, height: o }).toCanvas();
    c.destroy();
    let h = Math.ceil(n / 32) * 32, d = Math.ceil(o / 32) * 32, g = this.createPaddedCanvas(u, n, o, h, d), f = this.imageToTensor(g, h, d);
    return this.log(`Detection preprocessed: original(${i}x${r}), model_input(${h}x${d}), resize_ratio: ${s.toFixed(4)}`), { tensor: f, width: h, height: d, resizeRatio: s, originalWidth: i, originalHeight: r };
  }
  calculateResizeDimensions(t, e) {
    let i = this.options.maxSideLength, r = t, n = e, o = 1;
    return Math.max(n, r) > i && (o = i / (n > r ? n : r), r = Math.round(r * o), n = Math.round(n * o)), { width: r, height: n, ratio: o };
  }
  createPaddedCanvas(t, e, i, r, n) {
    let o = L(r, n);
    return o.getContext("2d").drawImage(t, 0, 0, e, i), o;
  }
  imageToTensor(t, e, i) {
    let o = t.getContext("2d").getImageData(0, 0, e, i).data, s = new Float32Array(P.NUM_CHANNELS * i * e);
    const { mean: c, stdDeviation: u } = this.options;
    for (let h = 0; h < i; h++)
      for (let d = 0; d < e; d++) {
        let g = (h * e + d) * 4, f = h * e + d;
        for (let p = 0; p < P.NUM_CHANNELS; p++) {
          let b = (o[g + p] / 255 - c[p]) / u[p];
          s[p * i * e + f] = b;
        }
      }
    return s;
  }
  async runInference(t, e, i) {
    try {
      this.log("Running detection inference...");
      let n = { x: new I.Tensor("float32", t, [1, 3, i, e]) }, s = (await this.session.run(n))[this.session.outputNames[0] || "sigmoid_0.tmp_0"];
      return this.log("Detection inference complete!"), s ? s.data : (console.error(`Output tensor ${this.session.outputNames[0]} not found in detection results`), null);
    } catch (r) {
      throw console.error("Error during model inference:", r instanceof Error ? r.message : String(r)), r;
    }
  }
  tensorToCanvas(t, e, i) {
    let r = L(e, i), n = r.getContext("2d"), o = n.createImageData(e, i), s = o.data;
    for (let c = 0; c < i; c++)
      for (let u = 0; u < e; u++) {
        let h = c * e + u, d = t[h] || 0, g = Math.round(d * 255), f = (c * e + u) * 4;
        s[f] = g, s[f + 1] = g, s[f + 2] = g, s[f + 3] = 255;
      }
    return n.putImageData(o, 0, 0), r;
  }
  postprocessDetection(t, e, i = this.options.minimumAreaThreshold || 20, r = this.options.paddingVertical || 0.4, n = this.options.paddingHorizontal || 0.6) {
    this.log("Post-processing detection results...");
    const { width: o, height: s, resizeRatio: c, originalWidth: u, originalHeight: h } = e;
    let d = this.tensorToCanvas(t, o, s), g = new C(d);
    g.grayscale().convert({ rtype: l.CV_8UC1 });
    let f = new Mt(g.toMat(), { mode: l.RETR_LIST, method: l.CHAIN_APPROX_SIMPLE }), p = this.extractBoxesFromContours(f, o, s, c, u, h, i, r, n);
    return g.destroy(), f.destroy(), this.log(`Found ${p.length} potential text boxes`), p;
  }
  extractBoxesFromContours(t, e, i, r, n, o, s, c, u) {
    let h = [];
    return t.iterate((d) => {
      let g = t.getRect(d);
      if (g.width * g.height <= s)
        return;
      let f = this.applyPaddingToRect(g, e, i, c, u), p = this.convertToOriginalCoordinates(f, r, n, o);
      p.width > 5 && p.height > 5 && h.push(p);
    }), h;
  }
  applyPaddingToRect(t, e, i, r, n) {
    let o = Math.round(t.height * r), s = Math.round(t.height * n), c = t.x - s, u = t.y - o, h = t.width + 2 * s, d = t.height + 2 * o;
    c = Math.max(0, c), u = Math.max(0, u);
    let g = Math.min(e, t.x + t.width + s), f = Math.min(i, t.y + t.height + o);
    return h = g - c, d = f - u, { x: c, y: u, width: h, height: d };
  }
  convertToOriginalCoordinates(t, e, i, r) {
    let n = t.x / e, o = t.y / e, s = t.width / e, c = t.height / e, u = Math.max(0, Math.round(n)), h = Math.max(0, Math.round(o)), d = Math.min(i - u, Math.round(s)), g = Math.min(r - h, Math.round(c));
    return { x: u, y: h, width: d, height: g };
  }
  async debugDetectionCanvas(t, e, i) {
    let r = this.tensorToCanvas(t, e, i), n = this.debugging.debugFolder;
    await R.getInstance().saveImage({ canvas: r, filename: "detection-debug", path: n }), this.log(`Probability map visualized and saved to: ${n}`);
  }
  async debugDetectedBoxes(t, e) {
    let i = t instanceof D ? t : await C.prepareCanvas(t), r = i.getContext("2d"), n = R.getInstance();
    for (let s of e) {
      const { x: c, y: u, width: h, height: d } = s;
      n.drawLine({ ctx: r, x: c, y: u, width: h, height: d });
    }
    let o = this.debugging.debugFolder;
    await R.getInstance().saveImage({ canvas: i, filename: "boxes-debug", path: o }), this.log(`Boxes visualized and saved to: ${o}`);
  }
};
m(P, "NUM_CHANNELS", 3);
let A = P;
const v = class v {
  constructor(t, e = {}, i = {}) {
    m(this, "options");
    m(this, "debugging");
    m(this, "session");
    m(this, "toolkit");
    this.session = t, this.toolkit = R.getInstance(), this.options = { ...K, ...e }, this.debugging = { ...G, ...i };
  }
  log(t) {
    this.debugging.verbose && console.log(`[RecognitionService] ${t}`);
  }
  async run(t, e) {
    this.log("Starting text recognition process");
    try {
      let i = t instanceof D ? t : await C.prepareCanvas(t), r = this.filterValidBoxes(e), n = await this.processBoxesInParallel(i, r);
      return this.sortResultsByReadingOrder(n);
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
      for (let n = 0; n < e.length; n++) {
        const { box: o, index: s } = e[n];
        await new Promise((c) => setTimeout(c, 10));
        try {
          const c = await this.processBox(t, o, s, e.length, i);
          c !== null && r.push(c);
        } catch (c) {
          console.error(`Error in sequential processBox ${s}:`, c);
        }
      }
      return r;
    } else {
      let r = e.map(({ box: o, index: s }) => this.processBox(t, o, s, e.length, i));
      return (await Promise.all(r)).filter((o) => o !== null);
    }
  }
  async processBox(t, e, i, r, n) {
    let o = Date.now();
    try {
      let s = this.cropRegion(t, e), c = await this.recognizeText(s);
      return this.debugging.debug && (await this.saveDebugCrop(s, i, n), this.logProcessingDetails(e, i, r, c, o)), { text: c, box: e };
    } catch (s) {
      return console.error(`Error processing box ${i + 1}: ${s.message}`, s.stack), null;
    }
  }
  sortResultsByReadingOrder(t) {
    return [...t].sort((e, i) => {
      let r = e.box, n = i.box;
      return Math.abs(r.y - n.y) < (r.height + n.height) / 4 ? r.x - n.x : r.y - n.y;
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
  logProcessingDetails(t, e, i, r, n) {
    let o = Date.now() - n;
    this.log(`Box ${e + 1}/${i}: [x:${t.x}, y:${t.y}, w:${t.width}, h:${t.height}] → "${r}" (processed in ${o}ms)`);
  }
  async recognizeText(t) {
    const { imageTensor: e, tensorWidth: i, tensorHeight: r } = await this.preprocessImage(t);
    let n = new I.Tensor("float32", e, [1, 3, r, i]), o = await this.runInference(n);
    return this.decodeResults(o);
  }
  async preprocessImage(t) {
    let e = new C(t), i = this.options.imageHeight, r = e.width, n = e.height;
    if (n === 0 || r === 0)
      throw new Error(`Crop dimensions are zero: ${r}x${n}`);
    let o = r / n, s = Math.max(v.MIN_CROP_WIDTH, Math.round(i * o));
    e.resize({ width: s, height: i });
    let c = this.createImageTensor(e, s, i);
    return e.destroy(), { imageTensor: c, tensorWidth: s, tensorHeight: i };
  }
  createImageTensor(t, e, i) {
    let s = t.toCanvas().getContext("2d").getImageData(0, 0, e, i).data, c = 3, u = new Float32Array(c * i * e);
    for (let h = 0; h < i; h++)
      for (let d = 0; d < e; d++) {
        let g = (h * e + d) * 4, p = (s[g] / 255 - 0.5) / 0.5;
        for (let w = 0; w < c; w++) {
          let b = w * i * e + h * e + d;
          u[b] = p;
        }
      }
    return u;
  }
  async runInference(t) {
    let e = { x: t }, i = await this.session.run(e), r = Object.keys(i)[0], n = i[r];
    if (!n)
      throw new Error(`Recognition output tensor '${r}' not found. Available keys: ${Object.keys(i)}`);
    return n;
  }
  decodeResults(t) {
    let e = t.data, i = t.dims, r = i[1], n = i[2];
    return n !== this.options.charactersDictionary.length && console.warn(`Warning: Model output classes (${n}) does not match dictionary length (${this.options.charactersDictionary.length})`), this.ctcGreedyDecode(e, r, n, this.options.charactersDictionary);
  }
  ctcGreedyDecode(t, e, i, r) {
    let n = "", o = -1;
    for (let s = 0; s < e; s++) {
      const { index: c } = this.findMaxProbabilityClass(t, s, i);
      if (c === v.BLANK_INDEX || c === o) {
        o = c;
        continue;
      }
      this.isValidDictionaryIndex(c, r) ? this.appendCharacterToText(c, r, (u) => {
        n += u;
      }) : console.warn(`Decoded index ${c} out of bounds for charDict (length ${r.length}) at t=${s}`), o = c;
    }
    return n;
  }
  appendCharacterToText(t, e, i) {
    let r = e[t];
    if (t === e.length - 1) {
      if (r === v.UNK_TOKEN)
        return;
      i(" ");
      return;
    }
    i(r);
  }
  findMaxProbabilityClass(t, e, i) {
    let r = -1 / 0, n = 0;
    for (let o = 0; o < i; o++) {
      let s = t[e * i + o];
      s > r && (r = s, n = o);
    }
    return { value: r, index: n };
  }
  isValidDictionaryIndex(t, e) {
    return t >= 0 && t < e.length;
  }
};
m(v, "BLANK_INDEX", 0), m(v, "UNK_TOKEN", "<unk>"), m(v, "MIN_CROP_WIDTH", 8);
let B = v;
const x = class x {
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
      let r = { ...this.options, ...t }, n = r.model.detection, o = r.model.recognition, s = r.model.charactersDictionary;
      if (typeof window < "u") {
        this.log(`Browser: Fetching dictionary from: ${s}`);
        const c = await fetch(s);
        if (!c.ok)
          throw new Error(`Failed to fetch characters dictionary: ${c.status} ${c.statusText}`);
        const h = (await c.text()).split(`
`);
        this.options.recognition.charactersDictionary = h, this.log(`Character dictionary loaded with ${h.length} entries.`), this.log(`Browser: Loading Detection model from: ${n}`);
        const g = {
          ...n.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {},
          ...r.executionProviders ? { executionProviders: r.executionProviders } : {}
        };
        this.detectionSession = await I.InferenceSession.create(n, g), this.log(`Browser: Loading Recognition model from: ${o}`);
        const p = {
          ...o.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {},
          ...r.executionProviders ? { executionProviders: r.executionProviders } : {}
        };
        this.recognitionSession = await I.InferenceSession.create(o, p);
      } else {
        let c = M(process.cwd(), n), u = M(process.cwd(), o), h = M(process.cwd(), s);
        this.log(`Node: Loading Detection ONNX model from: ${c}`);
        let d = O(c).buffer;
        const f = {
          ...n.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {},
          ...r.executionProviders ? { executionProviders: r.executionProviders } : {}
        };
        this.detectionSession = await I.InferenceSession.create(d, f), await new Promise((z) => setImmediate(z)), this.log(`Node: Loading Recognition ONNX model from: ${u}`);
        let p = O(u).buffer;
        const b = {
          ...o.toLowerCase().endsWith(".ort") ? { graphOptimizationLevel: "disabled" } : {},
          ...r.executionProviders ? { executionProviders: r.executionProviders } : {}
        };
        this.recognitionSession = await I.InferenceSession.create(p, b), await new Promise((z) => setImmediate(z)), this.log(`Node: Loading character dictionary from: ${h}`);
        let S = O(h, "utf-8").split(`
`);
        if (!S.length)
          throw new Error(`Character dictionary at ${h} is empty or not found.`);
        this.options.recognition.charactersDictionary = S;
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
    await C.initRuntime();
    let e = new A(this.detectionSession, this.options.detection, this.options.debugging), i = new B(this.recognitionSession, this.options.recognition, this.options.debugging), r = await e.run(t), n = await i.run(t, r);
    return this.groupResult(n);
  }
  getEncompassingBox(t) {
    if (!t || t.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    let e = 1 / 0, i = 1 / 0, r = -1 / 0, n = -1 / 0;
    for (const o of t) {
      const s = o.box;
      s && (e = Math.min(e, s.x), i = Math.min(i, s.y), r = Math.max(r, s.x + s.width), n = Math.max(n, s.y + s.height));
    }
    return {
      x: e === 1 / 0 ? 0 : e,
      y: i === 1 / 0 ? 0 : i,
      width: r === -1 / 0 ? 0 : r - e,
      height: n === -1 / 0 ? 0 : n - i
    };
  }
  groupResult(t) {
    let e = { text: "", lines: [] };
    if (!t.length)
      return e;
    let i = [t[0]], r = t[0].text, n = t[0].box.height;
    for (let o = 1; o < t.length; o++) {
      let s = t[o], c = t[o - 1], u = Math.abs(s.box.y - c.box.y), h = n * 0.5;
      if (u <= h)
        i.push(s), r += ` ${s.text}`, n = i.reduce((d, g) => d + g.box.height, 0) / i.length;
      else {
        const d = i.map((f) => f.text).join(" "), g = this.getEncompassingBox(i);
        e.lines.push({
          text: d,
          box: g,
          words: [...i]
        }), r += `
${s.text}`, i = [s], n = s.box.height;
      }
    }
    if (i.length > 0) {
      const o = i.map((c) => c.text).join(" "), s = this.getEncompassingBox(i);
      e.lines.push({
        text: o,
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
let _ = x;
class H {
  /**
   * Fetches the list of all available model files and dictionaries in the GitHub models repository recursively.
   * Works in both Web Browser and Node.js environments.
   */
  static async listAvailableModelsFromGithub() {
    try {
      const t = await fetch(`https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/git/trees/main?recursive=1`);
      if (!t.ok)
        throw new Error(`Failed to fetch models tree from GitHub: ${t.status} ${t.statusText}`);
      const e = await t.json();
      return e.tree ? e.tree.filter((i) => i.type === "blob" && (i.path.endsWith(".onnx") || i.path.endsWith(".ort") || i.path.endsWith(".txt"))).map((i) => {
        const n = i.path.endsWith(".txt") ? `https://raw.githubusercontent.com/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main` : `https://media.githubusercontent.com/media/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main`;
        return {
          path: i.path,
          name: i.path.split("/").pop(),
          size: i.size,
          downloadUrl: `${n}/${i.path}`
        };
      }) : [];
    } catch (t) {
      throw console.error("Error listing models from GitHub recursively:", t), t;
    }
  }
  /**
   * Downloads a model asset directly from the GitHub repository and saves it to a local folder.
   * Node.js (Server-side) environment only.
   */
  static async downloadModelFromGithub(t, e) {
    if (typeof window < "u")
      throw new Error("downloadModelFromGithub is only supported on Node.js/Server-side.");
    const i = await Promise.resolve().then(() => Q), r = await Promise.resolve().then(() => Z), { Readable: n } = await import("./__vite-browser-external-l0sNRNKZ.js"), { finished: o } = await import("./__vite-browser-external-l0sNRNKZ.js");
    let s = t;
    const c = t.split("/").pop();
    if (!t.includes("/")) {
      const b = (await this.listAvailableModelsFromGithub()).find((S) => S.name === t);
      if (!b)
        throw new Error(`Model file "${t}" not found in GitHub repository.`);
      s = b.path;
    }
    const d = `${s.endsWith(".txt") ? `https://raw.githubusercontent.com/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main` : `https://media.githubusercontent.com/media/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main`}/${s}`, g = r.join(e, c);
    i.existsSync(e) || i.mkdirSync(e, { recursive: !0 }), console.log(`[ModelManager] Downloading ${s} from GitHub: ${d}`);
    const f = await fetch(d);
    if (!f.ok)
      throw new Error(`Failed to download model from GitHub: ${f.status} ${f.statusText}`);
    const p = i.createWriteStream(g);
    return await o(n.fromWeb(f.body).pipe(p)), console.log(`[ModelManager] Successfully saved model to ${g}`), g;
  }
}
m(H, "GITHUB_OWNER", "CraftThingy-Digital-Innovation"), m(H, "GITHUB_REPO", "cty-paddle-ocr-models");
class At {
  /**
   * Instantiate PaddleOCRClient
   * @param {object} options Configurations (e.g. { verbose: true, detection: { maxSideLength: 2000 } })
   */
  constructor(t = {}) {
    this.options = {
      executionProviders: ["webgpu", "wasm"],
      ...t
    }, this.service = null;
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
    this.service = new _({
      model: i,
      executionProviders: this.options.executionProviders,
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
typeof window < "u" && (window.PaddleOCRClient = At, window.ModelManager = H);
export {
  H as ModelManager,
  At as PaddleOCRClient,
  At as default
};
