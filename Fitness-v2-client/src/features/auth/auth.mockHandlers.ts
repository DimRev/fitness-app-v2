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

  http.post("*/auth/loginFromCookie", async ({ cookies }) => {
    if (cookies.jwt === "test") {
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
      { message: "missing or invalid jwt" },
      { status: 401 },
    );
  }),

  http.post("*/auth/loginFromSession", async ({ request }) => {
    const { session_token } = (await request.json()) as {
      session_token: string;
    };

    if (session_token === "test_token") {
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
      { message: "Failed to login, invalid session token" },
      { status: 401 },
    );
  }),

  http.post("*/auth/logout", async () => {
    return HttpResponse.json({ message: "Logged out" }, { status: 200 });
  }),

  http.post("*/auth/register", async ({ request }) => {
    const { email, password, username } = (await request.json()) as {
      email: string;
      password: string;
      username: string;
    };

    if (!email || !password || !username) {
      return HttpResponse.json(
        { message: "Failed to register, malformed request" },
        { status: 400 },
      );
    }

    if (
      email === "test@test.com" &&
      password === "test" &&
      username === "test"
    ) {
      const validUser: AuthUser = {
        email: "test@test.com",
        username: "test",
        image_url: null,
        role: "user",
        session_token: "test",
      };

      return HttpResponse.json(validUser, { status: 200 });
    }

    if (email === "test_existing@test.com") {
      return HttpResponse.json(
        { message: "Failed to register, email already exists" },
        { status: 409 },
      );
    }
  }),
];
