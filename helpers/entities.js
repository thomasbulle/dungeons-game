export const getRandomMonster = numberOfTypes => {
  return `monster${Math.floor(Math.random() * (numberOfTypes)) + 1}`;
};