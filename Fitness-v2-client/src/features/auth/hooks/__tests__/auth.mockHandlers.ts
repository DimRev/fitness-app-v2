import { http, HttpResponse } from "msw";

export const authHandlers = [
  http.post("*/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    if (email === "test@test.com" && password === "test") {
      const validUser: AuthUser = {
        email: "test@test.com",
        username: "test",
        image_url: null,
        role: "user",
        session_token: "test",
      };

      return HttpResponse.json(validUser, { status: 200 });
    }

    return HttpResponse.json(
      { message: "Failed to login, wrong email or password" },
      { status: 401 },
    );
  }),
];
