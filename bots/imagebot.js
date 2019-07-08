const imageDownloader = require("image-downloader"),
  Jimp = require("jimp"),
  fs = require("fs");

const stateManager = require("../stateManager.js");

async function robot(spinner) {
  let temporaryFiles = [];
  let state = stateManager.load();

  state.image = {};
  state.image.original = await getUnplashPhoto();
  state.image.ready = await addTextIntoImage(state);

  await deleteTemporaryFiles(temporaryFiles);

  stateManager.save(state);

  async function getUnplashPhoto() {
    spinner.info("Baixando a imagem de fundo");

    const url = "https://picsum.photos/720?blur";
    const dest = __dirname + "/../output/background.png";

    temporaryFiles.push(dest);

    try {
      await imageDownloader.image({
        url,
        dest
      });

      return dest;
    } catch (err) {
      return err;
    }
  }

  async function addTextIntoImage(state) {
    spinner.info("Adicionando texto na imagem");

    let background = state.image.original;
    let destination = __dirname + "/../output/ready.png";

    const fonts = await loadFonts();

    return new Promise((resolve, reject) => {
      Jimp.read(background)
        .then(image => {
          image
            .brightness(-0.5)
            .print(
              fonts.quote,
              10,
              10,
              {
                text: `"${state.quote.translatedText}"`,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
              },
              700,
              700
            )
            .print(
              fonts.author,
              0,
              -50,
              {
                text: ` - ${state.quote.author || "Autor desconhecido"} `,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
              },
              720,
              720
            )
            .write(destination);

          resolve(destination);
        })
        .catch(err => reject(err));
    });
  }

  async function loadFonts() {
    spinner.info("Carregando fontes");
    return new Promise(async (resolve, reject) => {
      try {
        let quote = await Jimp.loadFont(__dirname + "/../fonts/proxima48.fnt");
        let author = await Jimp.loadFont(__dirname + "/../fonts/proxima24.fnt");

        resolve({ quote, author });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function deleteTemporaryFiles(files) {
    spinner.info("Removendo arquivos temporários");
    return files.map(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
  }
}

module.exports = robot;
