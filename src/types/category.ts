export interface Category {
  _id: string;
  code: string;
  title: string;
  imgUrl: string;
  parentId?: string | null;
  parent?: Category | null;
}
