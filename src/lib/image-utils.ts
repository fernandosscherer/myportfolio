"use client";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_PIXELS = 40_000_000;

export function resizeImage(file: File, maxDimension = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Select a valid image file"));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("Image must be smaller than 10 MB"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.onload = () => {
        if (image.width * image.height > MAX_PIXELS) {
          reject(new Error("Image dimensions are too large"));
          return;
        }
        const scale = Math.min(
          1,
          maxDimension / Math.max(image.width, image.height),
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      image.onerror = () => reject(new Error("Invalid image"));
      image.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
