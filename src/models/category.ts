export interface Category {
  _id: string;
  code: string;
  title: string;
  imgUrl: string;
  parentId?: string | null;
}

export interface CategoryPopulate {
  _id: string;
  code: string;
  title: string;
  imgUrl: string;
  parentId?: Category | null;
}
