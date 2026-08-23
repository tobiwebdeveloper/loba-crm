import http from "node:http";
import sql from "./db";

const server = http.createServer(async (req, res) => {

  res.setHeader("Content-Type", "application/json");
  const url = req.url ?? "";
  if (req.method === "GET" && req.url?.startsWith("/api/prospects/")) {

    const id = req.url.split("/")[3];

    try {

      const prospects = await sql`
        SELECT *
        FROM prospects
        WHERE id = ${id}
      `;

      res.writeHead(200);
      res.end(JSON.stringify(prospects[0]));

    } catch (error) {

      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to fetch prospect" }));

    }

    return;
  }
 if (req.method === "POST" && url === "/api/prospects") {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const prospect = JSON.parse(body);

      console.log("CREATE PROSPECT BODY:", prospect);

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

  return;
}
if (req.method === "PATCH" && url.startsWith("/api/prospects/")) {

  const id = url.split("/")[3];

  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", async () => {

    try {
      const prospect = JSON.parse(body);

      const updatedProspect = await sql`
        UPDATE prospects
        SET
          business_name = ${prospect.business_name},
          contact_name = ${prospect.contact_name},
          email = ${prospect.email},
          phone = ${prospect.phone},
          website = ${prospect.website},
          status = ${prospect.status},
          value = ${prospect.value},
          notes = ${prospect.notes}
        WHERE id = ${id}
        RETURNING *
      `;

      res.writeHead(200);
      res.end(JSON.stringify(updatedProspect[0]));

    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to update prospect" }));
    }

  });

  return;
}
if (req.method === "DELETE" && url.startsWith("/api/prospects/")) {

  const id = url.split("/")[3];

  try {

    await sql`
      DELETE FROM prospects
      WHERE id = ${id}
    `;

    res.writeHead(204);
    res.end();

  } catch (error) {

    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Failed to delete prospect" }));
  }

  return;
}

  if (req.method === "GET" && req.url === "/api/prospects") {

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

    return;
  }
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

  return;
}
if (req.method === "GET" && url.startsWith("/api/calls/")) {

  const id = url.split("/")[3];

  try {

    const calls = await sql`
      SELECT *
      FROM calls
      WHERE id = ${id}
    `;

    res.writeHead(200);
    res.end(JSON.stringify(calls[0]));

  } catch (error) {

    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Failed to fetch call" }));

  }

  return;
}
if (req.method === "POST" && url === "/api/calls") {

  let body = "";

  req.on("data", chunk => {
    body += chunk;
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
          ${call.prospect_id},
          ${call.date},
          ${call.duration},
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

  return;
}
if (req.method === "PATCH" && url.startsWith("/api/calls/")) {

  const id = url.split("/")[3];

  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", async () => {

    try {

      const call = JSON.parse(body);

      const updatedCall = await sql`
        UPDATE calls
        SET
          prospect_id = ${call.prospect_id},
          date = ${call.date},
          duration = ${call.duration},
          outcome = ${call.outcome},
          notes = ${call.notes}
        WHERE id = ${id}
        RETURNING *
      `;

      res.writeHead(200);
      res.end(JSON.stringify(updatedCall[0]));

    } catch (error) {

      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to update call" }));

    }

  });

  return;
}
if (req.method === "DELETE" && url.startsWith("/api/calls/")) {

  const id = url.split("/")[3];

  try {

    await sql`
      DELETE FROM calls
      WHERE id = ${id}
    `;

    res.writeHead(204);
    res.end();

  } catch (error) {

    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Failed to delete call" }));

  }

  return;
}
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

  return;
}
if (req.method === "GET" && url.startsWith("/api/follow-ups/")) {
  const id = url.split("/")[3];

  try {
    const followUps = await sql`
      SELECT *
      FROM follow_ups
      WHERE id = ${id}
    `;

    res.writeHead(200);
    res.end(JSON.stringify(followUps[0]));
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Failed to fetch follow-up" }));
  }

  return;
}
if (req.method === "POST" && url === "/api/follow-ups") {
  let body = "";

  req.on("data", chunk => {
    body += chunk;
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
          ${followUp.prospect_id},
          ${followUp.due_date},
          ${followUp.notes},
          ${followUp.completed}
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

  return;
}
if (req.method === "PATCH" && url.startsWith("/api/follow-ups/")) {
  const id = url.split("/")[3];

  let body = "";

  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const followUp = JSON.parse(body);

      const updatedFollowUp = await sql`
        UPDATE follow_ups
        SET
          prospect_id = ${followUp.prospect_id},
          due_date = ${followUp.due_date},
          notes = ${followUp.notes},
          completed = ${followUp.completed}
        WHERE id = ${id}
        RETURNING *
      `;

      res.writeHead(200);
      res.end(JSON.stringify(updatedFollowUp[0]));
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Failed to update follow-up" }));
    }
  });

  return;
}
if (req.method === "DELETE" && url.startsWith("/api/follow-ups/")) {
  const id = url.split("/")[3];

  try {
    await sql`
      DELETE FROM follow_ups
      WHERE id = ${id}
    `;

    res.writeHead(204);
    res.end();
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Failed to delete follow-up" }));
  }

  return;
}
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));

});

server.listen(3001, () => {
  console.log("API running at http://localhost:3001");
});