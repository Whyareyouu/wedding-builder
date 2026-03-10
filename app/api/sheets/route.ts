import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import * as process from "node:process";

const getRangeLetter = (n: number) => {
  if (n <= 0 || n > 26) {
    throw new Error("Количество колонок должно быть от 1 до 26");
  }

  const lastLetter = String.fromCharCode(64 + n);
  return `A:${lastLetter}`;
};

const SPREAD_SHEET_ID = process.env.SPREAD_SHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

const auth = new GoogleAuth({
  credentials: {
    type: process.env.TYPE,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function POST(req: Request): Promise<Response> {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const body: Record<string, unknown> = await req.json();

    if (!body || !Object.keys(body).length) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Тело запроса пустое. Передайте данные.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const range = getRangeLetter(Object.keys(body).length);

    const sanitize = (value: unknown): string => {
      const str = Array.isArray(value) ? value.join(", ") : String(value ?? "");
      return /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
    };

    const data = Object.keys(body).map((key) => sanitize(body[key]));

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREAD_SHEET_ID,
      range: `${SHEET_NAME}!${range}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [data],
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Данные успешно добавлен в таблицу.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Google Sheets error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Не удалось записать данные в таблицу. Попробуйте позже.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
