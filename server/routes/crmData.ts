import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";

import sql from "../db";

function sendJson(
  res: ServerResponse,
  status: number,
  data: unknown,
): void {
  res.writeHead(status);
  res.end(JSON.stringify(data));
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) {
    return "";
  }

  const columns = Object.keys(rows[0]);

  const header = columns
    .map(escapeCsv)
    .join(",");

  const data = rows.map((row) =>
    columns
      .map((column) => escapeCsv(row[column]))
      .join(","),
  );

  return [header, ...data].join("\n");
}

export async function handleCrmData(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const url = req.url ?? "";

  // GET /api/crm/export?format=json|csv
  if (
    req.method === "GET" &&
    url.startsWith("/api/crm/export")
  ) {
    const format =
      new URL(
        url,
        "http://localhost",
      ).searchParams.get("format") ?? "json";

    if (format !== "json" && format !== "csv") {
      sendJson(res, 400, {
        error: "Unsupported export format.",
      });

      return true;
    }

    try {
      const [prospects, calls, followUps] =
        await sql.transaction([
          sql`
            SELECT *
            FROM prospects
            ORDER BY created_at DESC
          `,
          sql`
            SELECT *
            FROM calls
            ORDER BY date DESC
          `,
          sql`
            SELECT *
            FROM follow_ups
            ORDER BY due_date ASC
          `,
        ]);

      if (format === "json") {
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Disposition":
            'attachment; filename="loba-crm-export.json"',
        });

        res.end(
          JSON.stringify({
            exported_at: new Date().toISOString(),
            prospects,
            calls,
            follow_ups: followUps,
          }),
        );

        return true;
      }

      const sections = [
        "PROSPECTS",
        rowsToCsv(
          prospects as Record<string, unknown>[],
        ),
        "",
        "CALLS",
        rowsToCsv(
          calls as Record<string, unknown>[],
        ),
        "",
        "FOLLOW-UPS",
        rowsToCsv(
          followUps as Record<string, unknown>[],
        ),
      ];

      res.writeHead(200, {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="loba-crm-export.csv"',
      });

      res.end(sections.join("\n"));

      return true;
    } catch (error) {
      console.error(error);

      sendJson(res, 500, {
        error: "Failed to export CRM data.",
      });

      return true;
    }
  }

  // DELETE /api/crm/data
  if (
    req.method === "DELETE" &&
    url === "/api/crm/data"
  ) {
    try {
      await sql.transaction([
        sql`
          DELETE FROM follow_ups
        `,
        sql`
          DELETE FROM calls
        `,
        sql`
          DELETE FROM prospects
        `,
      ]);

      res.writeHead(204);
      res.end();

      return true;
    } catch (error) {
      console.error(error);

      sendJson(res, 500, {
        error: "Failed to delete CRM data.",
      });

      return true;
    }
  }

  return false;
}