# Client-Side PaddleOCR Compiler & Bundler

[Bahasa Indonesia](#bahasa-indonesia) | [English](#english)

---

## Bahasa Indonesia

Proyek ini berfungsi sebagai **Vite-based compiler / bundler** yang mengubah library Node.js server-side `ppu-paddle-ocr` menjadi modul JavaScript siap pakai di sisi client (web browser).

Pustaka biner bawaan `ppu-paddle-ocr` memiliki ketergantungan native C++ (seperti OpenCV Node dan ONNX Runtime Node) yang tidak didukung oleh browser. Proyek ini memotong dan mengganti ketergantungan tersebut menggunakan teknik **Shimming** dan **Compile-Time Aliasing**.

### 1. Cara Kerja & Shimming Engine
Modul dikompilasi menggunakan bundler **Vite** dalam *Library Mode* dengan konfigurasi alias khusus pada `vite.config.js`:
1.  **Canvas Shim (`browser-canvas-shim.js`)**: Mengalihkan pemanggilan gambar `@napi-rs/canvas` ke objek browser asli (`HTMLCanvasElement`, `document.createElement('canvas')`).
2.  **Filesystem Shim (`browser-fs-shim.js`)**: Mengganti `fs.readFileSync` dengan XHR sinkron (`XMLHttpRequest`) yang dikonfigurasikan dengan `overrideMimeType('text/plain; charset=x-user-defined')` untuk mengunduh model ONNX tanpa merusak strukturnya.
3.  **URL-Aware Path Shim (`browser-path-shim.js`)**: Menjembatani parser path agar mendeteksi URL absolute (`http://` atau `https://`) tanpa merusak karakter double-slash (`//`).
4.  **WASM Sequential Engine (`main.js`)**: Meng-override method `processBoxesInParallel` milik `RecognitionService` agar berjalan secara **Sekuensial** (satu-demi-satu) dengan jeda mikro `setTimeout(resolve, 10)`. Ini mencegah runtime WebAssembly (WASM) membekukan / me-lock main thread GUI browser saat memproses puluhan kotak deteksi sekaligus.

### 2. Cara Menginstal & Membangun Bundle
```bash
# Masuk ke folder proyek
cd D:\CraftThingy\client-side-paddle-ocr-project

# Instal Dependencies
npm install

# Bangun Modul (Kompilasi)
npm run build
```
Hasil kompilasi akan ditaruh di folder `dist/` dalam format:
*   `dist/paddle-ocr-client.umd.js` (UMD untuk tag `<script>` tradisional).
*   `dist/paddle-ocr-client.es.js` (ES Modules untuk framework modern).

### 3. API Reference
*   `const ocr = new PaddleOCRClient(options)`: Membuat instansi client. Menerima `options.verbose` (log di konsol) dan `options.maxSideLength` (skala sisi maksimum deteksi, default `2000`).
*   `await ocr.init(modelConfig)`: Memuat model AI secara asinkron. Menerima path URL file model `detection`, `recognition`, dan `charactersDictionary`.
*   `const result = await ocr.recognize(imageInput)`: Mengambil gambar/canvas/blob dan mengekstrak teks beserta koordinat box geometrisnya.

---

## English

This project serves as a **Vite-based compiler / bundler** that transforms the server-side Node.js `ppu-paddle-ocr` library into a client-side JavaScript module ready for web browsers.

Since `ppu-paddle-ocr` relies on native C++ bindings (such as node-opencv and node-onnxruntime), it cannot run directly in browsers. This project replaces those dependencies using **Shimming** and **Compile-Time Aliasing**.

### 1. Architecture & Shimming Engine
The compiler bundles modules using **Vite** in *Library Mode* with custom aliases defined in `vite.config.js`:
1.  **Canvas Shim (`browser-canvas-shim.js`)**: Reroutes `@napi-rs/canvas` methods to browser-native canvas elements (`HTMLCanvasElement`, `document.createElement('canvas')`).
2.  **Filesystem Shim (`browser-fs-shim.js`)**: Replaces Node's synchronous `fs.readFileSync` with a synchronous `XMLHttpRequest` configured with `overrideMimeType('text/plain; charset=x-user-defined')` to download raw binary ONNX models without corruption.
3.  **URL-Aware Path Shim (`browser-path-shim.js`)**: Patches POSIX path helpers to handle absolute URL paths (`http://` or `https://`) and prevent double-slash (`//`) corruption.
4.  **WASM Sequential Engine (`main.js`)**: Overrides `processBoxesInParallel` inside `RecognitionService` to process bounding boxes **sequentially** instead of concurrently, yielding with `setTimeout(resolve, 10)`. This prevents concurrent WebAssembly inferences from locking up the browser's main GUI thread.

### 2. How to Install & Build
```bash
# Enter project directory
cd D:\CraftThingy\client-side-paddle-ocr-project

# Install dependencies
npm install

# Compile/Build the bundle
npm run build
```
The compiled output is created under the `dist/` directory:
*   `dist/paddle-ocr-client.umd.js` (Universal Module Definition for script tags).
*   `dist/paddle-ocr-client.es.js` (ES Modules for modern bundlers like Vite or Webpack).

### 3. API Reference
*   `const ocr = new PaddleOCRClient(options)`: Instantiates the client wrapper. Accepts `options.verbose` (logging) and `options.maxSideLength` (maximum detection side size, default `2000`).
*   `await ocr.init(modelConfig)`: Asynchronously downloads the models. Accepts custom URL paths for `detection`, `recognition`, and `charactersDictionary`.
*   `const result = await ocr.recognize(imageInput)`: Scans the input element (image, canvas, blob) and returns extracted text and bounding box layout data.
