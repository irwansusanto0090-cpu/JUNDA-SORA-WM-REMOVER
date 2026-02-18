export interface SoraRequest {
  videoUrl: string;
}

export interface SoraResponse {
  code?: number;
  msg?: string;
  message?: string;
  data?: {
    url?: string;
    video?: string;
    cover?: string;
    [key: string]: any;
  } | string;
  url?: string;
  video_url?: string;
  link?: string;
  status?: string | number;
  [key: string]: any;
}

export interface ProcessedVideo {
  url: string;
  thumbnail?: string;
  originalUrl: string;
}

export interface ApiError {
  message: string;
}