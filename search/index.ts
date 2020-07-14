import * as express from "express";
import * as elasticsearch from "@elastic/elasticsearch";

console.log("connect to node", process.env.elasticsearch_node);

const client = new elasticsearch.Client({
  node: process.env.elasticsearch_node,
});
const index = "test-index";

const server = express();

server.get("/insert/:input", async (req, res, next) => {
  try {
    const { input } = req.params;
    console.log("index ", input);
    await client.index({
      index,
      body: { name: input, insertedAt: new Date().toISOString() },
    });
    res.send(`${input} has been indexed by elasticsearch`);
  } catch (err) {
    next(err);
  }
});

server.get("/search/:input", async (req, res, next) => {
  try {
    const { input } = req.params;
    console.log("search for ", input);
    const { body } = await client.search({
      index,
      body: {
        query: {
          match: {
            name: {
              query: input,
              operator: "and",
              fuzziness: "auto",
            },
          },
        },
      },
    });

    res.json(body.hits.hits);
  } catch (err) {
    next(err);
  }
});

server.get("/index", async (req, res, next) => {
  try {
    const { body } = await client.search({ index });
    res.json(body);
  } catch (err) {
    next(err);
  }
});

server.get("/health", async (req, res, next) => {
  try {
    const result = await client.cluster.health();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

server.get("**", (_req, res) =>
  res.send("only routes '/insert/:input' and '/search/:input' are available")
);

server.use((err: Error, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).send("Something broke: " + err.message);
});

server.listen(3333);
