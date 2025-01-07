/**
 * Forces the download of a file using a temporary anchor element
 * @param blobUrl - The URL of the blob to download
 * @param filename - The name to save the file as
 * @returns void
 */
const forceDownload = (blobUrl: string, filename: string): void => {
  const anchor: HTMLAnchorElement = document.createElement("a");
  anchor.download = filename;
  anchor.href = blobUrl;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

/**
 * Downloads a photo from a URL and saves it with the specified filename
 * @param url - The URL of the photo to download
 * @param filename - Optional filename to save as, defaults to URL filename
 * @returns Promise<void>
 */
const downloadPhoto = async (url: string, filename?: string): Promise<void> => {
  const finalFilename = filename || url.split("\\").pop()?.split("/").pop() || "download";
  
  try {
    const response = await fetch(url, {
      headers: new Headers({
        Origin: location.origin,
      }),
      mode: "cors",
    });
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    forceDownload(blobUrl, finalFilename);
  } catch (error: unknown) {
    console.error("Error downloading photo:", error);
  }
};

export default downloadPhoto;
