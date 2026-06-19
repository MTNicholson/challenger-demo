export type Brand = {
  id: string;
  name: string;
  category: string;
  description: string;
  city: string;
  district: string;
  locationsCount: number;
  followers: number;
  logo: string;
  cover: string;
  repeatVisitsPercent: number;
  rewardActivations: number;
};

export const brands: Brand[] = [
  {
    id: "coffee-place",
    name: "Coffee Place",
    category: "Кофейня",
    description:
      "Городская сеть кофеен с авторскими напитками, маршрутами по точкам и бонусами за регулярные визиты.",
    city: "Санкт-Петербург",
    district: "Петроградская",
    locationsCount: 7,
    followers: 4560,
    logo: "☕",
    cover: "coffee",
    repeatVisitsPercent: 31,
    rewardActivations: 1208,
  },
  {
    id: "fitpro",
    name: "FitPro",
    category: "Фитнес",
    description:
      "Фитнес-студия с челленджами на шаги, утренние тренировки и бонусами за регулярность.",
    city: "Санкт-Петербург",
    district: "Петроградская",
    locationsCount: 3,
    followers: 2810,
    logo: "💪",
    cover: "fitness",
    repeatVisitsPercent: 28,
    rewardActivations: 734,
  },
  {
    id: "beauty-store",
    name: "Beauty Store",
    category: "Beauty",
    description:
      "Beauty-пространство с наградами за визиты, покупки и рекомендации новых продуктов.",
    city: "Санкт-Петербург",
    district: "Центральная",
    locationsCount: 4,
    followers: 3190,
    logo: "✨",
    cover: "beauty",
    repeatVisitsPercent: 26,
    rewardActivations: 842,
  },
  {
    id: "sweetly-desserts",
    name: "Sweetly Desserts",
    category: "Десерты",
    description:
      "Кондитерская с сезонными десертами, вечерними заданиями и сладкими наградами за визиты.",
    city: "Санкт-Петербург",
    district: "Адмиралтейская",
    locationsCount: 5,
    followers: 2380,
    logo: "🍰",
    cover: "desserts",
    repeatVisitsPercent: 34,
    rewardActivations: 691,
  },
  {
    id: "book-space",
    name: "Book Space",
    category: "Книги",
    description:
      "Книжное пространство с клубными встречами, заданиями на чтение и бонусами за обзоры.",
    city: "Санкт-Петербург",
    district: "Василеостровская",
    locationsCount: 2,
    followers: 1670,
    logo: "📚",
    cover: "books",
    repeatVisitsPercent: 22,
    rewardActivations: 319,
  },
  {
    id: "pet-care",
    name: "Pet Care",
    category: "Питомцы",
    description:
      "Сервис для владельцев питомцев с прогулочными заданиями, фото-миссиями и полезными бонусами.",
    city: "Санкт-Петербург",
    district: "Московская",
    locationsCount: 3,
    followers: 1450,
    logo: "🐾",
    cover: "pets",
    repeatVisitsPercent: 25,
    rewardActivations: 284,
  },
];

export const companyBrand = brands[0];

export function getBrandById(id: string) {
  return brands.find((brand) => brand.id === id);
}
