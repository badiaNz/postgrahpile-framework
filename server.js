// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { postgraphile } = require("postgraphile");
const pg = require("pg");
const { graphql, getIntrospectionQuery, printSchema } = require("graphql");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");

const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

// JWT Middleware
function jwtMiddleware(req, res, next) {
  const token =
    req.headers.authorization?.split(" ")[1] || req.query.jwt;

  if (!token) {
    return res.status(401).json({ error: "JWT token required" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// Ambil semua schema kecuali pg_catalog & information_schema
async function getSchemas() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  const res = await client.query(`
    SELECT schema_name FROM information_schema.schemata
    WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
  `);
  await client.end();
  return res.rows.map((r) => r.schema_name);
}

// Main setup
(async () => {
  const schemas = await getSchemas();
  console.log("Loaded schemas:", schemas);

  const postgraphileMiddleware = postgraphile(DATABASE_URL, schemas, {
    appendPlugins: [ConnectionFilterPlugin],
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    jwtSecret: JWT_SECRET,
    jwtPgTypeIdentifier: "public.jwt_token", // Ubah sesuai tipe JWT-mu
    graphqlRoute: "/graphql",
    graphiqlRoute: "/graphiql",
    showErrorStack: true,
  });

  // Middleware untuk semua route yang butuh JWT
  app.use("/graphiql", jwtMiddleware);
  app.use("/graphql", jwtMiddleware);
  app.use("/schema-introspection", jwtMiddleware);

  // Mount PostGraphile middleware
  app.use(postgraphileMiddleware);

  // Endpoint introspeksi schema manual
  app.get("/schema-introspection", async (req, res) => {
    const { getGraphQLSchema } = postgraphileMiddleware;
    const schema = await getGraphQLSchema();

    if (req.query.format === "graphql") {
      const sdl = printSchema(schema);
      res.setHeader("Content-Type", "text/plain");
      return res.send(sdl);
    }

    const result = await graphql({ schema, source: getIntrospectionQuery() });
    res.json(result);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`🔍 GraphiQL: http://localhost:${PORT}/graphiql?jwt=...`);
    console.log(`📡 GraphQL: http://localhost:${PORT}/graphql?jwt=...`);
    console.log(`🧠 Introspection: http://localhost:${PORT}/schema-introspection?jwt=...`);
  });
})();
