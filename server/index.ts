
import http from "node:http";
import { handleProspects } from "./routes/prospects";
import { handleCalls } from "./routes/calls";
import { handleFollowUps } from "./routes/followUps";
import { handleCrmData } from "./routes/crmData";

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const handled =
   (await handleCrmData(req, res)) ||
    (await handleProspects(req, res)) ||
    (await handleCalls(req, res)) ||
    (await handleFollowUps(req, res));

  if (!handled) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(3001, () => {
  console.log("API running at http://localhost:3001");
});

