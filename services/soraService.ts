import { ProcessedVideo, SnapSoraResponse } from '../types';

export const removeWatermark = async (videoUrl: string, onProgress?: (msg: string) => void): Promise<ProcessedVideo> => {
  if (onProgress) onProgress("Connecting to Texa Engine...");

  try {
    const response = await fetch(`/api/process-video?url=${encodeURIComponent(videoUrl)}`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data: SnapSoraResponse = await response.json();

    if (!data.download_link) {
      throw new Error("Failed to retrieve download link from Texa Engine.");
    }

    if (onProgress) onProgress("Processing complete!");

    return {
      url: data.download_link,
      downloadUrl: data.download_link,
      originalUrl: videoUrl,
    };
  } catch (error: any) {
    console.error("Error processing video:", error);
    throw new Error(error.message || "Failed to process video");
  }
};
