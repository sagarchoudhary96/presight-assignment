import { mockUsers } from "../utils/mockData";
import { User } from "../viewmodels/user";

export interface GetUsersParams {
  page?: string | number;
  limit?: string | number;
  search?: string;
  nationality?: string;
  hobby?: string;
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

export interface UsersFilterMetadata {
  nationalities: string[];
  topHobbies: { name: string; count: number }[];
}

export const getUsers = (params: GetUsersParams): GetUsersResponse => {
  let {
    page = 1,
    limit = 10,
    search = "",
    nationality = "",
    hobby = "",
    ageMin,
    ageMax,
  } = params;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  let filteredUsers = [...mockUsers];

  // Search (matches first_name, last_name)
  if (search) {
    const searchQuery = search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchQuery) ||
        user.last_name.toLowerCase().includes(searchQuery)
    );
  }

  // Nationality Filter
  if (nationality) {
    filteredUsers = filteredUsers.filter(
      (user) => user.nationality.toLowerCase() === nationality.toLowerCase()
    );
  }

  // Hobby Filter
  if (hobby) {
    filteredUsers = filteredUsers.filter((user) =>
      user.hobbies.some((h) => h.toLowerCase() === hobby.toLowerCase())
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

export const getFilterMetadata = (): UsersFilterMetadata => {
  const nationalities = [
    ...new Set(mockUsers.map((u) => u.nationality)),
  ].sort();

  const hobbyCounts: Record<string, number> = {};
  mockUsers.forEach((user) => {
    user.hobbies.forEach((hobby) => {
      hobbyCounts[hobby] = (hobbyCounts[hobby] || 0) + 1;
    });
  });

  const topHobbies = Object.entries(hobbyCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return {
    nationalities,
    topHobbies,
  };
};
