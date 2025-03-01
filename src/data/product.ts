import { Product } from "~/models/product";

export const FAKE_PRODUCTS: Product[] = [
  {
    _id: "1",
    code: "slim_fit_dress_shirt",
    title: "Slim Fit Dress Shirt",
    price: 45.99,
    categoryId: "8", // Dress Shirts
    description: "Elegant slim fit dress shirt for formal occasions.",
    variants: [
      {
        color: "white",
        hexCode: "#FFFFFF",
        size: "S",
        stock: 10,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
      {
        color: "white",
        hexCode: "#FFFFFF",
        size: "M",
        stock: 15,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
      {
        color: "blue",
        hexCode: "#0000FF",
        size: "M",
        stock: 20,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
      {
        color: "blue",
        hexCode: "#0000FF",
        size: "L",
        stock: 5,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    code: "casual_tshirt",
    title: "Casual T-Shirt",
    price: 19.99,
    categoryId: "9", // T-Shirts
    description: "Soft and comfortable casual t-shirt.",
    variants: [
      {
        color: "black",
        hexCode: "#000000",
        size: "S",
        stock: 8,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
      {
        color: "black",
        hexCode: "#000000",
        size: "L",
        stock: 12,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
      {
        color: "red",
        hexCode: "#FF0000",
        size: "M",
        stock: 10,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    code: "running_sneakers",
    title: "Running Sneakers",
    price: 69.99,
    categoryId: "12", // Sneakers
    description: "High-performance running sneakers for everyday comfort.",
    variants: [
      {
        color: "blue",
        hexCode: "#0000FF",
        size: 40,
        stock: 15,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
      {
        color: "gray",
        hexCode: "#808080",
        size: 42,
        stock: 8,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "4",
    code: "leather_wallet",
    title: "Leather Wallet",
    price: 29.99,
    categoryId: "13", // Wallets
    description: "Premium leather wallet with multiple compartments.",
    variants: [
      {
        color: "black",
        hexCode: "#000000",
        size: "L",
        stock: 50,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
      {
        color: "brown",
        hexCode: "#8B4513",
        size: "L",
        stock: 30,
        images: [
          "/img/product/white-tshirt.jpg",
          "/img/product/white-t_shirt.jpg",
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
