export type Location = {
  id: string;
  brandId: string;
  title: string;
  address: string;
  district: string;
  distance: string;
  visited?: boolean;
  visitTime?: string;
};

export const locations: Location[] = [
  {
    id: "coffee-nevsky",
    brandId: "coffee-place",
    title: "Coffee Place, Невский 24",
    address: "Невский проспект, 24",
    district: "Центральная",
    distance: "450 м от вас",
    visited: true,
    visitTime: "Сегодня, 10:20",
  },
  {
    id: "coffee-gorohovaya",
    brandId: "coffee-place",
    title: "Coffee Place, Гороховая 12",
    address: "Гороховая, 12",
    district: "Адмиралтейская",
    distance: "800 м от вас",
    visited: true,
    visitTime: "Вчера, 18:05",
  },
  {
    id: "coffee-bolshoy",
    brandId: "coffee-place",
    title: "Coffee Place, Большой пр. 8",
    address: "Большой проспект П.С., 8",
    district: "Петроградская",
    distance: "1,1 км от вас",
    visited: true,
    visitTime: "15 июня, 12:40",
  },
  {
    id: "coffee-liteyny",
    brandId: "coffee-place",
    title: "Coffee Place, Литейный 40",
    address: "Литейный проспект, 40",
    district: "Центральная",
    distance: "1,6 км от вас",
    visited: false,
    visitTime: "Ожидает визит",
  },
  {
    id: "coffee-morskaya",
    brandId: "coffee-place",
    title: "Coffee Place, Малая Морская 5",
    address: "Малая Морская, 5",
    district: "Адмиралтейская",
    distance: "1,9 км от вас",
    visited: false,
    visitTime: "Ожидает визит",
  },
  {
    id: "fitpro-petro",
    brandId: "fitpro",
    title: "FitPro, Петроградская",
    address: "Каменноостровский проспект, 32",
    district: "Петроградская",
    distance: "1,4 км от вас",
  },
  {
    id: "beauty-center",
    brandId: "beauty-store",
    title: "Beauty Store, Центр",
    address: "Итальянская, 17",
    district: "Центральная",
    distance: "2,1 км от вас",
  },
];

export function getBrandLocations(brandId: string) {
  return locations.filter((location) => location.brandId === brandId);
}
