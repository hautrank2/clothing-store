import { Product } from "~/models/product";

export const hanldeProduct = (data: Product) => {
  return {
    ...data,
    colors: data.colors.map((color) => ({
      ...color,
      imgUrls: color.imgUrls.map(
        (imgUrl) => `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/${imgUrl}`
      ),
    })),
  };
};
