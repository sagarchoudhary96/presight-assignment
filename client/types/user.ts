export interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UsersFilterMetadata {
  nationalities: string[];
  topHobbies: { name: string; count: number }[];
}
export interface UserFilterParams {
  search?: string;
  nationality?: string;
  hobby?: string;
}

export interface GetUsersParams extends UserFilterParams {
  page?: number;
  limit?: number;
}
