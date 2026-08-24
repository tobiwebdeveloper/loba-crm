import type { IncomingMessage, ServerResponse } from "node:http";
import sql from "../db";

export async function handleCalls(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const url = req.url ?? "";

  if (req.method === "GET" && url === "/api/calls") {
    try {
      const calls = await sql`
        SELECT *
        FROM calls
        ORDER BY date DESC
      `;

      res.writeHead(200);
      res.end(JSON.stringify(calls));
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to fetch calls" }));
    }

    return true;
  }

  if (req.method === "GET" && url.startsWith("/api/calls/")) {
    const id = url.split("/")[3];

    try {
      const calls = await sql`
        SELECT *
        FROM calls
        WHERE id = ${id}
      `;

      if (calls.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Call not found" }));
        return true;
      }

      res.writeHead(200);
      res.end(JSON.stringify(calls[0]));
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to fetch call" }));
    }

    return true;
  }

  if (req.method === "POST" && url === "/api/calls") {
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const call = JSON.parse(body);

        const newCall = await sql`
          INSERT INTO calls (
            prospect_id,
            date,
            duration,
            outcome,
            notes
          )
          VALUES (
            ${Number(call.prospect_id)},
            ${call.date},
            ${Number(call.duration)},
            ${call.outcome},
            ${call.notes}
          )
          RETURNING *
        `;

        res.writeHead(201);
        res.end(JSON.stringify(newCall[0]));
      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to create call" }));
      }
    });

    return true;
  }

  if (req.method === "PATCH" && url.startsWith("/api/calls/")) {
    const id = url.split("/")[3];
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const call = JSON.parse(body);

        const updatedCall = await sql`
          UPDATE calls
          SET
            prospect_id = ${Number(call.prospect_id)},
            date = ${call.date},
            duration = ${Number(call.duration)},
            outcome = ${call.outcome},
            notes = ${call.notes}
          WHERE id = ${id}
          RETURNING *
        `;

        if (updatedCall.length === 0) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Call not found" }));
          return;
        }

        res.writeHead(200);
        res.end(JSON.stringify(updatedCall[0]));
      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to update call" }));
      }
    });

    return true;
  }

  if (req.method === "DELETE" && url.startsWith("/api/calls/")) {
    const id = url.split("/")[3];

    try {
      const deletedCall = await sql`
        DELETE FROM calls
        WHERE id = ${id}
        RETURNING *
      `;

      if (deletedCall.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Call not found" }));
        return true;
      }

      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to delete call" }));
    }

    return true;
  }

  return false;
}

