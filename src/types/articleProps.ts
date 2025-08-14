export interface ArticleProps {
  id: string;
  title: string;
  content: string;
  image: string;
  categoryId: string;
  userId: string;
  category: {
    name: string;
  };
  status: boolean;
  user: {
    name: string;
    email: string;
  };
  createAt: Date;
  updatedAt: Date;
}