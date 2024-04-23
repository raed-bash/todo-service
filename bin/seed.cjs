#!/bin/node
const http = require('http');
require('dotenv').config();

const seed = http.request(
  `http://localhost:${process.env.PORT ?? 3001}/seed`,
  { timeout: 5000 },
  (res) => {
    if (res.statusCode === 200) {
      process.exit('ok');
    }
  },
);

seed.on('error', function (err) {
  console.error(err.message);
  console.error('ERROR');
});

seed.end();
