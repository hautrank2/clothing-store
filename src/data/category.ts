import { Category } from "~/models/category";

export const FAKE_CATEGORIES: Category[] = [
  {
    _id: "1",
    code: "pants",
    title: "Pants",
    imgUrl: "/img/category/pants.jpg",
    parentId: null,
  },
  {
    _id: "2",
    code: "shirts",
    title: "Shirts",
    imgUrl: "/img/category/shirts.jpg",
    parentId: null,
  },
  {
    _id: "3",
    code: "shoes",
    title: "Shoes",
    imgUrl: "/img/category/shoes.jpg",
    parentId: null,
  },
  {
    _id: "4",
    code: "accessories",
    title: "Accessories",
    imgUrl: "/img/category/accessories.jpg",
    parentId: null,
  },
  {
    _id: "5",
    code: "long_pants",
    title: "Long Pants",
    imgUrl: "/img/category/long_pants.jpg",
    parentId: "1",
  },
  {
    _id: "6",
    code: "shorts",
    title: "Shorts",
    imgUrl: "/img/category/shorts.jpg",
    parentId: "1",
  },
  {
    _id: "7",
    code: "jeans",
    title: "Jeans",
    imgUrl: "/img/category/jeans.jpg",
    parentId: "1",
  },

  {
    _id: "8",
    code: "dress_shirts",
    title: "Dress Shirts",
    imgUrl: "/img/category/dress_shirts.jpg",
    parentId: "2",
  },
  {
    _id: "9",
    code: "tshirts",
    title: "T-Shirts",
    imgUrl: "/img/category/tshirts.jpg",
    parentId: "2",
  },
  {
    _id: "10",
    code: "jackets",
    title: "Jackets",
    imgUrl: "/img/category/jackets.jpg",
    parentId: "2",
  },

  {
    _id: "11",
    code: "dress_shoes",
    title: "Dress Shoes",
    imgUrl: "/img/category/dress_shoes.jpg",
    parentId: "3",
  },
  {
    _id: "12",
    code: "sneakers",
    title: "Sneakers",
    imgUrl: "/img/category/sneakers.jpg",
    parentId: "3",
  },

  {
    _id: "13",
    code: "wallets",
    title: "Wallets",
    imgUrl: "/img/category/wallets.jpg",
    parentId: "4",
  },
  {
    _id: "14",
    code: "belts",
    title: "Belts",
    imgUrl: "/img/category/belts.jpg",
    parentId: "4",
  },
  {
    _id: "15",
    code: "hats",
    title: "Hats",
    imgUrl: "/img/category/hats.jpg",
    parentId: "4",
  },
];
