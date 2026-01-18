import { faker } from "@faker-js/faker";

export const generateStreamText = () => {
  return faker.lorem.paragraphs(32);
};
