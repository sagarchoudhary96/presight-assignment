import type { UsersResponse } from "@/types/user";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
class UserService {
  private baseUrl;

  constructor() {
    this.baseUrl = `${BASE_API_URL}/api/users`;
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Error fetching users");
    }
    return response.json();
  }
}

export const userService = new UserService();
