var options = {
  apiVersion: "v1", // default
  endpoint: "http://127.0.0.1:4000", // default
  token: "s.8pJPQI1nfGV3km58tnddK9W5", // optional client token; can be fetched after valid initialization of the server
};

// get new instance of the client
var vault = require("node-vault")(options);

// init vault server
vault
  .init({ secret_shares: 1, secret_threshold: 1 })
  .then(result => {
    var keys = result.keys;
    // set token for all following requests
    vault.token = result.root_token;
    // unseal vault server
    return vault.unseal({ secret_shares: 1, key: keys[0] });
  })
  .catch(console.error);
