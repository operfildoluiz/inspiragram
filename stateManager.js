const fs = require("fs");

const FILENAME = "./content.json";

function load() {
  return JSON.parse(fs.readFileSync(FILENAME));
}

function save(content) {
  fs.writeFileSync(FILENAME, JSON.stringify(content, null, 4));

  return content;
}

module.exports = {
  load,
  save
};
