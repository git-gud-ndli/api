const express = require("express");
const redis = require("redis");
const server = express();

const prom = require("prom-client");

let connection = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST,
);

const register = prom.register;

const pain = new prom.Gauge({
  name: "pain",
  help: "pain_help",
  labelNames: ["user"],
});
pain.set({ user: "jean" }, 10);

const farine = new prom.Gauge({
  name: "farine",
  help: "farine_help",
  labelNames: ["user"],
});
farine.set({ user: "jean" }, 15);

server.get("/metrics", (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(register.metrics());
});

server.get("/metrics/counter", (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(register.getSingleMetricAsString("test_counter"));
});

//Enable collection of default metrics
prom.collectDefaultMetrics();

console.log("Server listening to 3000, metrics exposed on /metrics endpoint");
server.listen(80);
