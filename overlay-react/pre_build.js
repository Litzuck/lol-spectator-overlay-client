const request = require('requestretry');
const fs = require('fs');


function downlaodJson(url) {
  return new Promise((resolve, reject) => {
    request(url, {
      json: true
    }, (err, res, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  })
}

async function checkForNewChampionImages() {
  let versionResponse = await downlaodJson("https://ddragon.leagueoflegends.com/api/versions.json");
  let latestVersion = versionResponse[0];
  let championResponse = await downlaodJson(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
  let championData = championResponse.data;

  Object.values(championData).forEach(async (k) => {
    let imagePath = `./src/assets/champion/square/${k.key}.png`;
    if (!(fs.existsSync(imagePath))) {
      console.log(`Champion icon for champion with key ${k.key} missing. \n Downloading now...`);
      await download(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${k.id}.png`,
        imagePath);
      console.log(`Champion icon for champion with key ${k.key} downloaded.`);
    }
  });

  Object.values(championData).forEach(async (k) => {
    let imagePath = `./src/assets/splash-art/centered/${k.key}.jpg`;
    if (!(fs.existsSync(imagePath))) {
      console.log(`Champion splash art for champion with key ${k.key} missing. \n Downloading now...`);
      await download(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${k.id}_0.jpg`,
        imagePath);
      console.log(`Champion splash art for champion with key ${k.key} downloaded.`);
    }
  });
}


function download(url, path) {
  return new Promise((resolve, reject) => {

    let stream = request(url, { timeout: 30000, retryStrategy: request.RetryStrategies.HTTPOrNetworkError, retryDelay: 5000, maxAttempts: 5 })
      .on('error', (err) => { console.error(err); reject(err); })
      .pipe(fs.createWriteStream(path))
      .on('finish', () => { resolve() })
      .on('error', (err) => { reject(err) });

  })
}


function clearFolders() {
  //delete all files in folders splash-art/centered and champion/square
  fs.readdir('./src/assets/splash-art/centered', (err, files) => {
    files.forEach((file) => {
      fs.unlink(`./src/assets/splash-art/centered/${file}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
  fs.readdir('./src/assets/champion/square', (err, files) => {
    files.forEach((file) => {
      fs.unlink(`./src/assets/champion/square/${file}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
}


// clearFolders();
checkForNewChampionImages();