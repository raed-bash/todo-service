#!/bin/node
const http = require('http');
require('dotenv').config();

const healthCheck = http.request(
  `http://localhost:${process.env.PORT ?? 3001}/healthcheck`,
  { timeout: 5000 },
  (res) => {
    if (res.statusCode === 200) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  },
);

healthCheck.on('error', function () {
  console.error('ERROR');
  process.exit(1);
});

healthCheck.end();
