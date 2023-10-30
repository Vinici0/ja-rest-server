const cards = [
  {
    id: 1,
    title: "Card 1",
    description: "Description 1",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    title: "Card 2",
    description: "Description 2",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    title: "Card 3",
    description: "Description 3",
    image: "https://picsum.photos/200/300",
  },
];

const findCardById = (id) => {
  return cards.filter((card) => card.id !== id);
};

console.log(findCardById(3));
