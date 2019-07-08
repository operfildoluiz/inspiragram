const slugify = require("slugify"),
  fs = require("fs");

const stateManager = require("../stateManager.js");

async function robot(spinner) {
  let state = stateManager.load();

  state.caption = await createCaption(state);
  await saveCaptionFile(state);
  stateManager.save(state);

  async function createCaption(state) {
    spinner.info("Criando o texto da legenda");
    return new Promise((resolve, reject) => {
      const emojiOptions = ["🚀", "✌🏽", "👋", "👨🏻‍🚀"];

      let text =
        `${getRandomElement(emojiOptions)} "${
          state.quote.translatedText
        }" - ${state.quote.author || "Autor desconhecido"}\n` +
        `\n\n🔥 Marque alguém que precisa ler isso` +
        `\n.\n.\n.\n.\n.\n.` +
        `\n#inspiracao #motivacional #quotes ` +
        `#${convertAuthorIntoHashtag(
          state.quote.author || "Autor desconhecido"
        )}`;
      resolve(text);
    });
  }

  async function saveCaptionFile(state) {
    let path = __dirname + "/../output/caption.txt";

    return fs.writeFileSync(path, state.caption);
  }

  function getRandomElement(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function convertAuthorIntoHashtag(author) {
    return slugify(author, {
      remove: /[*+~.()'"!:@]/g,
      lower: true
    }).replace(/-/g, "");
  }
}

module.exports = robot;

/**

🚀 "The cause is hidden. The effect is visible to all." - Ovid

🔥 Marque alguém que precisa ler isso


#inspiracao #motivacional #quotes


*/
