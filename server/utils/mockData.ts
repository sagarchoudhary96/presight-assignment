import { faker } from "@faker-js/faker";
import { User } from "../viewmodels/user.js";

// Helper to generate mock data
export const generateMockData = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => {
    const hobbiesCount = faker.number.int({ min: 1, max: 20 });

    return {
      id: i + 1,
      avatar: faker.image.avatar(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 80 }),
      nationality: faker.location.country(),
      hobbies: faker.helpers.uniqueArray(faker.word.verb, hobbiesCount),
    };
  });
};
