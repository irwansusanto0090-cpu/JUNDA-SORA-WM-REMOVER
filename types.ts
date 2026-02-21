export interface SoraRequest {
  videoUrl: string;
  title: string;
  duration: number;
}

export interface SnapSoraResponse {
  download_link: string;
}

export interface ProcessedVideo {
  url: string;
  downloadUrl?: string;
  thumbnail?: string;
  originalUrl: string;
  resolution?: string;
}

export interface ApiError {
  message: string;
}