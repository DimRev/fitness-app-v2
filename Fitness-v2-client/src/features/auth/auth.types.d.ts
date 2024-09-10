type UserRole = "admin" | "user";

type AuthUser = {
  email: string;
  username: string;
  image_url: null | string;
  role: UserRole;
  session_token: string;
};
