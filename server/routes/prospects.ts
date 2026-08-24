
import type { IncomingMessage, ServerResponse } from "node:http";
import sql from "../db";

export async function handleProspects(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const url = req.url ?? "";

  // GET /api/prospects
  if (req.method === "GET" && url === "/api/prospects") {
    try {
      const prospects = await sql`
        SELECT *
        FROM prospects
        ORDER BY created_at DESC
      `;

      res.writeHead(200);
      res.end(JSON.stringify(prospects));
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to fetch prospects" }));
    }

    return true;
  }

  // GET /api/prospects/:id
  if (req.method === "GET" && url.startsWith("/api/prospects/")) {
    const id = url.split("/")[3];

    try {
      const prospects = await sql`
        SELECT *
        FROM prospects
        WHERE id = ${id}
      `;

      if (prospects.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Prospect not found" }));
        return true;
      }

      res.writeHead(200);
      res.end(JSON.stringify(prospects[0]));
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to fetch prospect" }));
    }

    return true;
  }

  // POST /api/prospects
  if (req.method === "POST" && url === "/api/prospects") {
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const prospect = JSON.parse(body);

        const value =
          prospect.value === "" || prospect.value == null
            ? 0
            : Number(prospect.value);

        const newProspect = await sql`
          INSERT INTO prospects (
            business_name,
            contact_name,
            email,
            phone,
            website,
            status,
            value,
            notes
          )
          VALUES (
            ${prospect.business_name},
            ${prospect.contact_name},
            ${prospect.email},
            ${prospect.phone},
            ${prospect.website},
            ${prospect.status},
            ${value},
            ${prospect.notes}
          )
          RETURNING *
        `;

        res.writeHead(201);
        res.end(JSON.stringify(newProspect[0]));
      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to create prospect" }));
      }
    });

    return true;
  }

  // PATCH /api/prospects/:id
  if (req.method === "PATCH" && url.startsWith("/api/prospects/")) {
    const id = url.split("/")[3];
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const prospect = JSON.parse(body);

        const value =
          prospect.value === "" || prospect.value == null
            ? 0
            : Number(prospect.value);

        const updatedProspect = await sql`
          UPDATE prospects
          SET
            business_name = ${prospect.business_name},
            contact_name = ${prospect.contact_name},
            email = ${prospect.email},
            phone = ${prospect.phone},
            website = ${prospect.website},
            status = ${prospect.status},
            value = ${value},
            notes = ${prospect.notes}
          WHERE id = ${id}
          RETURNING *
        `;

        if (updatedProspect.length === 0) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Prospect not found" }));
          return;
        }

        res.writeHead(200);
        res.end(JSON.stringify(updatedProspect[0]));
      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to update prospect" }));
      }
    });

    return true;
  }

  // DELETE /api/prospects/:id
  if (req.method === "DELETE" && url.startsWith("/api/prospects/")) {
    const id = url.split("/")[3];

    try {
      const deletedProspect = await sql`
        DELETE FROM prospects
        WHERE id = ${id}
        RETURNING *
      `;

      if (deletedProspect.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Prospect not found" }));
        return true;
      }

      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to delete prospect" }));
    }

    return true;
  }

  return false;
}
