export class ModelManager {
  static GITHUB_OWNER = 'CraftThingy-Digital-Innovation';
  static GITHUB_REPO = 'cty-paddle-ocr-models';

  /**
   * Fetches the list of all available model files and dictionaries in the GitHub models repository recursively.
   * Works in both Web Browser and Node.js environments.
   */
  static async listAvailableModelsFromGithub() {
    try {
      // Use the Git Trees API with recursive=1 to get all files in all subfolders in a single call
      const response = await fetch(`https://api.github.com/repos/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/git/trees/main?recursive=1`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models tree from GitHub: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.tree) return [];

      return data.tree
        .filter(f => f.type === 'blob' && (f.path.endsWith('.onnx') || f.path.endsWith('.ort') || f.path.endsWith('.txt')))
        .map(f => {
          const isTxt = f.path.endsWith('.txt');
          const baseUrl = isTxt 
            ? `https://raw.githubusercontent.com/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main`
            : `https://media.githubusercontent.com/media/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main`;

          return {
            path: f.path,
            name: f.path.split('/').pop(),
            size: f.size,
            downloadUrl: `${baseUrl}/${f.path}`
          };
        });
    } catch (error) {
      console.error("Error listing models from GitHub recursively:", error);
      throw error;
    }
  }

  /**
   * Downloads a model asset directly from the GitHub repository and saves it to a local folder.
   * Node.js (Server-side) environment only.
   */
  static async downloadModelFromGithub(filePathOrName, destFolder) {
    if (typeof window !== 'undefined') {
      throw new Error("downloadModelFromGithub is only supported on Node.js/Server-side.");
    }
    
    // Dynamically import Node.js native core libraries to avoid bundling them for browsers
    const fs = await import('fs');
    const path = await import('path');
    const { Readable } = await import('stream');
    const { finished } = await import('stream/promises');

    let remotePath = filePathOrName;
    const fileName = filePathOrName.split('/').pop();

    // If only filename is provided, look up the full remote path recursively from GitHub first
    if (!filePathOrName.includes('/')) {
      const models = await this.listAvailableModelsFromGithub();
      const match = models.find(m => m.name === filePathOrName);
      if (!match) {
        throw new Error(`Model file "${filePathOrName}" not found in GitHub repository.`);
      }
      remotePath = match.path;
    }

    const isTxt = remotePath.endsWith('.txt');
    const baseUrl = isTxt 
      ? `https://raw.githubusercontent.com/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main`
      : `https://media.githubusercontent.com/media/${this.GITHUB_OWNER}/${this.GITHUB_REPO}/main`;

    const downloadUrl = `${baseUrl}/${remotePath}`;
    const targetPath = path.join(destFolder, fileName);

    // Create target directory if missing
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    console.log(`[ModelManager] Downloading ${remotePath} from GitHub: ${downloadUrl}`);
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to download model from GitHub: ${response.status} ${response.statusText}`);
    }

    const fileStream = fs.createWriteStream(targetPath);
    // Node.js Web Streams integration
    await finished(Readable.fromWeb(response.body).pipe(fileStream));
    console.log(`[ModelManager] Successfully saved model to ${targetPath}`);
    return targetPath;
  }
}
