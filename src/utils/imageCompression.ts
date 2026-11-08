const MAX_DIMENSION = 1600;

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));

const loadImage = async (file: File): Promise<HTMLImageElement> => {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = objectUrl;
    await img.decode();
    return img;
  } catch {
    throw new Error('el formato no es compatible; prueba con JPG o PNG');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

/** Reduce la foto a un máximo de 1600 px y la convierte a WebP (o JPEG si el navegador no puede). */
export const compressImage = async (file: File): Promise<Blob> => {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('el navegador no pudo procesar la imagen');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Safari no codifica WebP: entrega PNG sin avisar, por eso se revisa el tipo resultante.
  const webp = await canvasToBlob(canvas, 'image/webp', 0.82);
  if (webp?.type === 'image/webp') return webp;

  const jpeg = await canvasToBlob(canvas, 'image/jpeg', 0.85);
  if (!jpeg) throw new Error('el navegador no pudo comprimir la imagen');
  return jpeg;
};
