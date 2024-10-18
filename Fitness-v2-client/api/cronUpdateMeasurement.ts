import { type NextApiRequest, type NextApiResponse } from "next";
import { fetchWithTimeout } from "./utils";
import CustomApiError from "./CustomApiError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end("Unauthorized");
  }

  const API_URL = process.env.VITE_API_URL;
  const API_KEY = process.env.CRON_API_KEY;

  if (!API_URL || !API_KEY) {
    return res.status(500).json({
      message: `Failed to execute cron job, missing ${
        !API_KEY && !API_URL
          ? "API KEY and URL"
          : !API_URL
            ? "API URL"
            : "API KEY"
      }`,
    });
  }

  try {
    const apiRes = await fetchWithTimeout(
      `${API_URL}/v1/cron/update_measurements`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    if (!apiRes.ok) {
      const data = (await apiRes.json()) as { message: string };
      throw new CustomApiError(apiRes.status, data.message);
    }

    const data = (await apiRes.json()) as { message: string };
    res.status(200).json({ message: data.message });
  } catch (err) {
    if (err instanceof CustomApiError) {
      res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof Error && err.message === "Request timed out") {
      res.status(504).json({ message: "Request timed out" });
    } else {
      console.error("Unexpected error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
