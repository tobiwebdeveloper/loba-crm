
import type { IncomingMessage, ServerResponse } from "node:http";
import sql from "../db";

export async function handleFollowUps(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const url = req.url ?? "";

  // GET /api/follow-ups
  if (req.method === "GET" && url === "/api/follow-ups") {
    try {
      const followUps = await sql`
        SELECT *
        FROM follow_ups
        ORDER BY due_date ASC
      `;

      res.writeHead(200);
      res.end(JSON.stringify(followUps));
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to fetch follow-ups" }));
    }

    return true;
  }

  // GET /api/follow-ups/:id
  if (req.method === "GET" && url.startsWith("/api/follow-ups/")) {
    const id = url.split("/")[3];

    try {
      const followUps = await sql`
        SELECT *
        FROM follow_ups
        WHERE id = ${id}
      `;

      if (followUps.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Follow-up not found" }));
        return true;
      }

      res.writeHead(200);
      res.end(JSON.stringify(followUps[0]));
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to fetch follow-up" }));
    }

    return true;
  }

  // POST /api/follow-ups
  if (req.method === "POST" && url === "/api/follow-ups") {
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const followUp = JSON.parse(body);

        const newFollowUp = await sql`
          INSERT INTO follow_ups (
            prospect_id,
            due_date,
            notes,
            completed
          )
          VALUES (
            ${Number(followUp.prospect_id)},
            ${followUp.due_date},
            ${followUp.notes},
            ${Boolean(followUp.completed)}
          )
          RETURNING *
        `;

        res.writeHead(201);
        res.end(JSON.stringify(newFollowUp[0]));
      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to create follow-up" }));
      }
    });

    return true;
  }

  // PATCH /api/follow-ups/:id
  if (req.method === "PATCH" && url.startsWith("/api/follow-ups/")) {
    const id = url.split("/")[3];
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const followUp = JSON.parse(body);

        const updatedFollowUp = await sql`
          UPDATE follow_ups
          SET
            prospect_id = ${Number(followUp.prospect_id)},
            due_date = ${followUp.due_date},
            notes = ${followUp.notes},
            completed = ${Boolean(followUp.completed)}
          WHERE id = ${id}
          RETURNING *
        `;

        if (updatedFollowUp.length === 0) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Follow-up not found" }));
          return;
        }

        res.writeHead(200);
        res.end(JSON.stringify(updatedFollowUp[0]));
      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to update follow-up" }));
      }
    });

    return true;
  }

  // DELETE /api/follow-ups/:id
  if (req.method === "DELETE" && url.startsWith("/api/follow-ups/")) {
    const id = url.split("/")[3];

    try {
      const deletedFollowUp = await sql`
        DELETE FROM follow_ups
        WHERE id = ${id}
        RETURNING *
      `;

      if (deletedFollowUp.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Follow-up not found" }));
        return true;
      }

      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to delete follow-up" }));
    }

    return true;
  }

  return false;
}

