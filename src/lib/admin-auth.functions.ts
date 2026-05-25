import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ password: z.string().min(1).max(200) });

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    return { ok: data.password === process.env.ADMIN_LIVE_PASSWORD };
  });
