import type {
  UsersResponse,
  UsersFilterMetadata,
  GetUsersParams,
} from "@/types/user";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

class UserService {
  private baseUrl;

  constructor() {
    this.baseUrl = `${BASE_API_URL}/api/users`;
  }

  async getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
    const { page = 1, limit = 10, search, nationality, hobby } = params;
    const url = new URL(this.baseUrl);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (search) url.searchParams.append("search", search);
    if (nationality) url.searchParams.append("nationality", nationality);
    if (hobby) url.searchParams.append("hobby", hobby);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Error fetching users");
    }
    return response.json();
  }

  async getFilters(): Promise<UsersFilterMetadata> {
    const response = await fetch(`${this.baseUrl}/filters`);
    if (!response.ok) {
      throw new Error("Error fetching filters");
    }
    return response.json();
  }
}

export const userService = new UserService();
