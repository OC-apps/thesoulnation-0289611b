import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PayloadSchema = z.object({
  area: z.string().min(1).max(200),
  nombre_nickname: z.string().min(1).max(200),
  link_rc: z.string().max(500).optional().nullable(),
  sobre_ti: z.string().min(1).max(4000),
  red_tiktok: z.string().max(300).optional().nullable(),
  red_youtube: z.string().max(300).optional().nullable(),
  red_twitch: z.string().max(300).optional().nullable(),
  red_facebook: z.string().max(300).optional().nullable(),
  red_instagram: z.string().max(300).optional().nullable(),
  email: z.string().max(200).optional().nullable(),
});

function divisionColor(area: string): number {
  const a = area.toLowerCase();
  if (a.includes("legends")) return 0xff6a00; // flame orange
  if (a.includes("waves")) return 0x2dd4ff; // cyan
  if (a.includes("crew")) return 0x01039e;
  return 0x9333ea;
}

function divisionEmoji(area: string): string {
  const a = area.toLowerCase();
  if (a.includes("legends")) return "🎬";
  if (a.includes("waves")) return "📡";
  if (a.includes("crew")) return "🔥";
  return "🔥";
}

export const sendDiscordRecruitment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PayloadSchema.parse(input))
  .handler(async ({ data }) => {
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) throw new Error("DISCORD_WEBHOOK_URL is not configured");

    const emoji = divisionEmoji(data.area);
    const color = divisionColor(data.area);

    const socials: string[] = [];
    if (data.red_tiktok) socials.push(`<:tiktok:0> **TikTok** — ${data.red_tiktok}`);
    if (data.red_youtube) socials.push(`▶️ **YouTube** — ${data.red_youtube}`);
    if (data.red_twitch) socials.push(`🟣 **Twitch** — ${data.red_twitch}`);
    if (data.red_facebook) socials.push(`📘 **Facebook** — ${data.red_facebook}`);
    if (data.red_instagram) socials.push(`📸 **Instagram** — ${data.red_instagram}`);

    const fields: Array<{ name: string; value: string; inline?: boolean }> = [
      { name: "🎮 Gamertag / Nickname", value: data.nombre_nickname, inline: true },
      { name: "🏷️ División", value: data.area, inline: true },
    ];

    if (data.link_rc) {
      fields.push({ name: "🎥 YouTube RC / Clip", value: data.link_rc, inline: false });
    }

    fields.push({
      name: "📝 Experiencia / Sobre el aspirante",
      value: data.sobre_ti.slice(0, 1024),
      inline: false,
    });

    if (socials.length) {
      fields.push({ name: "🌐 Redes sociales", value: socials.join("\n"), inline: false });
    }

    if (data.email) {
      fields.push({ name: "✉️ Correo de contacto", value: data.email, inline: false });
    }

    const embed = {
      title: `${emoji} NUEVA POSTULACIÓN — THE SOUL NATION`,
      description: `Un nuevo aspirante ha enviado su RC para la división **${data.area}**.`,
      color,
      fields,
      footer: { text: "The Soul Nation · Sistema de Reclutamiento" },
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Soul Recruitment",
        embeds: [embed],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Discord webhook failed [${res.status}]: ${body}`);
    }

    return { ok: true };
  });
