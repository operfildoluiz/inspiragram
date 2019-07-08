const getRandomQuote = require("get-random-quote"),
  translateApi = require("@vitalets/google-translate-api");

const stateManager = require("../stateManager.js");

async function robot(spinner) {
  let state = stateManager.load();

  state.quote = await extractRandomQuote();
  state.quote.translatedText = await translateQuoteText(state);

  async function extractRandomQuote() {
    spinner.info("Extraindo a frase em inglês");
    return new Promise((resolve, reject) => {
      getRandomQuote()
        .then(quote => resolve(quote))
        .catch(err => reject(err));
    });
  }

  async function translateQuoteText(state) {
    spinner.info("Traduzindo a frase para português");
    return new Promise((resolve, reject) => {
      translateApi(state.quote.text, { from: "en", to: "pt", raw: true })
        .then(res => resolve(res.text))
        .catch(err => reject(err));
    });
  }

  stateManager.save(state);
}

module.exports = robot;
