type User = {
  id: string;
  email: string;
  username: string;
  image_url: null | string;
  created_at: string;
  updated_at: string;
  role: UserRole;
};

type UserWithPages = {
  users: User[];
  total_pages: number;
};
