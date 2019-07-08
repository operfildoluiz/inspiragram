const ora = require("ora");

const spinner = ora("Começando o bot").start();

const bots = {
  quote: require("./bots/quotebot"),
  image: require("./bots/imagebot"),
  text: require("./bots/textbot")
};

async function main() {
  await bots.quote(spinner);
  await bots.image(spinner);
  await bots.text(spinner);

  spinner.succeed("Tudo certo! Confira a pasta /output");
}

main();
