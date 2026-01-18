const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

class StreamService {
  private baseUrl;

  constructor() {
    this.baseUrl = `${BASE_API_URL}/api/stream`;
  }

  async streamText(): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(this.baseUrl);
    if (!response.ok || !response.body) {
      throw new Error("Error fetching stream");
    }
    return response.body;
  }
}

export const streamService = new StreamService();
