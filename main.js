import { PaddleOcrService } from './src/index.js';
import * as ort from 'onnxruntime-web';

class PaddleOCRClient {
  /**
   * Instantiate PaddleOCRClient
   * @param {object} options Configurations (e.g. { verbose: true, detection: { maxSideLength: 2000 } })
   */
  constructor(options = {}) {
    this.options = options;
    this.service = null;
  }

  /**
   * Initialize and load model assets via HTTP GET requests
   * @param {object} modelConfig Custom model paths, defaults to '/models/en_PP-OCRv3_det_infer.onnx', etc.
   */
  async init(modelConfig = {}) {
    const defaultModel = {
      detection: '/models/en_PP-OCRv3_det_infer.onnx',
      recognition: '/models/en_PP-OCRv3_rec_infer.onnx',
      charactersDictionary: '/models/en_dict.txt'
    };

    const finalModelConfig = {
      ...defaultModel,
      ...modelConfig
    };

    // Instantiate native service using our options and model endpoints
    this.service = new PaddleOcrService({
      model: finalModelConfig,
      detection: {
        maxSideLength: this.options.maxSideLength || 2000,
        ...this.options.detection
      },
      debugging: {
        verbose: this.options.verbose || false,
        debug: false
      }
    });

    console.log('Initializing Client-Side PaddleOCR Service...');
    await this.service.initialize();
    console.log('Client-Side PaddleOCR Service initialized successfully.');
  }

  /**
   * Runs OCR text and layout extraction on an image canvas, URL, base64, Blob or File.
   * @param {string|HTMLCanvasElement|Blob|File|ArrayBuffer} imageInput
   */
  async recognize(imageInput) {
    if (!this.service) {
      throw new Error('PaddleOCRClient is not initialized. Please call init() first.');
    }
    return this.service.recognize(imageInput);
  }
}

export default PaddleOCRClient;
export { PaddleOCRClient };
if (typeof window !== 'undefined') {
  window.PaddleOCRClient = PaddleOCRClient;
}
