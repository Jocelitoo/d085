export interface CurrentUserProps {
  id: string;
  name: string;
  email: string;
}

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  category: string;
  variations: string[];
  price: number;
  createdAt: Date;
  images: {
    id: string;
    url: string;
  }[];
}

export interface CartProductProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variation?: string;
  imageUrl: string;
}
