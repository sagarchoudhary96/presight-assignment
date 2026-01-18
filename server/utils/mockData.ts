import { faker } from "@faker-js/faker";
import { User } from "@/viewmodels/user";

const hobbiesList = [
  "Reading",
  "Hiking",
  "Cooking",
  "Photography",
  "Gardening",
  "Painting",
  "Traveling",
  "Gaming",
  "Swimming",
  "Yoga",
  "Running",
  "Cycling",
  "Fishing",
  "Knitting",
  "Dancing",
  "Singing",
  "Writing",
  "Chess",
  "Pottery",
  "Surfing",
  "Skiing",
  "Board Games",
  "Mountain Biking",
  "Baking",
  "Coding",
];
// Generate 200 users once
export const mockUsers: User[] = Array.from({ length: 500 }, (_, i) => {
  const hobbiesCount = faker.number.int({ min: 1, max: 20 });
  const hobbies = faker.helpers.uniqueArray(hobbiesList, hobbiesCount);

  return {
    id: i + 1,
    avatar: faker.image.avatar(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 80 }),
    nationality: faker.location.country(),
    hobbies: hobbies,
  };
});
