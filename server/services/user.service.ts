import { generateMockData } from "@/utils/mockData";
import { User } from "@/viewmodels/user";

export interface GetUsersParams {
  page?: string | number;
  limit?: string | number;
  search?: string;
  nationality?: string;
  ageMin?: string | number;
  ageMax?: string | number;
}

export interface GetUsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getUsers = (params: GetUsersParams): GetUsersResponse => {
  let {
    page = 1,
    limit = 10,
    search = "",
    nationality = "",
    ageMin,
    ageMax,
  } = params;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  let filteredUsers = generateMockData(100);

  // Search (matches first_name, last_name, or nationality)
  if (search) {
    const searchQuery = search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchQuery) ||
        user.last_name.toLowerCase().includes(searchQuery) ||
        user.nationality.toLowerCase().includes(searchQuery)
    );
  }

  // Nationality Filter
  if (nationality) {
    filteredUsers = filteredUsers.filter(
      (user) => user.nationality.toLowerCase() === nationality.toLowerCase()
    );
  }

  // Age Filters
  if (ageMin) {
    filteredUsers = filteredUsers.filter(
      (user) => user.age >= parseInt(ageMin as string)
    );
  }
  if (ageMax) {
    filteredUsers = filteredUsers.filter(
      (user) => user.age <= parseInt(ageMax as string)
    );
  }

  // Pagination
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limitNum);

  return {
    users: paginatedUsers,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    },
  };
};
