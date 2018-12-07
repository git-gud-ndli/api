const express = require("express");
const redis = require("redis");
const server = express();

const prom = require("prom-client");

let connection = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST,
);

function set(key, value) {
  connection.set(key, JSON.stringify(value), (...args) =>
    console.log("done set", ...args),
  );
}

function get(e) {
  console.log(e, connection.get(e));
  return new Promise((resolve, reject) => {
    connection.get(e, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  }).then(JSON.parse);
}

const init = () =>
  set("jean", [{ name: "pain", amount: 15 }, { name: "farine", amount: 30 }]);

get("jean").then(d => {
  if (!d) init();
}, init);

const register = prom.register;

async function update() {
  prom.register.clear();
  let jean = await get("jean");
  console.log(jean);
  for (let i in jean) {
    let cur = new prom.Gauge({
      name: jean[i].name,
      help: "no",
      labelNames: ["user"],
    });
    cur.set({ user: "jean" }, Number(jean[i].amount));
  }
}

update();

server.get("/add", async (req, res) => {
  let jean = await get("jean");
  for (let i in jean) {
    if (jean[i].name == req.query.name) {
      jean[i].amount = req.query.amount;
      set("jean", jean);
      update();
      break;
    }
  }
  res.end("job done");
});

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
