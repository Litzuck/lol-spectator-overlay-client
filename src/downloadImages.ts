import * as requestretry from 'requestretry';
import * as fs from 'fs';
import * as request from 'request';
import {app} from 'electron';

function downlaodJson(url) {
  return new Promise<any>((resolve, reject) => {
      request.default(url, {
      json: true
    }, (err, res, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  })
}

function createDir(dir) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
}

export async function checkForNewChampionImages() {

  let versionResponse = await downlaodJson("https://ddragon.leagueoflegends.com/api/versions.json");
  let latestVersion = versionResponse[0];
  console.log("latest version: " + latestVersion);
  let championResponse = await downlaodJson(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
  let championData = championResponse.data;

  let basePath = app.getPath('userData') + '/images/champions/';

  createDir(basePath+'square/');
  createDir(basePath+'splash-art/');
  Object.values(championData).forEach(async (k: {key: any, id: any}) => {
    // let imagePath = `./src/assets/champion/square/${k.key}.png`;
    let imagePath = basePath + `square/${k.key}.png`;
    if (!(fs.existsSync(imagePath))) {
      console.log(`Champion icon for champion with key ${k.key} missing. \n Downloading now...`);
      await downloadAndSave(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${k.id}.png`,
        imagePath);
      console.log(`Champion icon for champion with key ${k.key} downloaded.`);
    }
  });

  Object.values(championData).forEach(async (k: {key: any, id: any}) => {
    // let imagePath = `./src/assets/splash-art/centered/${k.key}.jpg`;
    let imagePath = basePath + `splash-art/${k.key}.png`;
    if (!(fs.existsSync(imagePath))) {
      console.log(`Champion splash art for champion with key ${k.key} missing. \n Downloading now...`);
      // await downloadAndSave(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${k.id}_0.jpg`,
      //   imagePath);
      await downloadAndSave(`https://cdn.communitydragon.org/latest/champion/${k.id}/splash-art/centered`,
        imagePath);
      console.log(`Champion splash art for champion with key ${k.key} downloaded.`);
    }
  });
}

// https://cdn.communitydragon.org/latest/champion/2/splash-art/centered

function downloadAndSave(url, path) {
  return new Promise<void>((resolve, reject) => {

    let stream = requestretry.default(url, { timeout: 30000, retryStrategy: requestretry.RetryStrategies.HTTPOrNetworkError, retryDelay: 5000, maxAttempts: 5 })
      .on('error', (err) => { console.error(err); reject(err); })
      .pipe(fs.createWriteStream(path))
      .on('finish', () => { resolve() })
      .on('error', (err) => { fs.unlink(path, ()=> console.log("Download with path "+ path+ " failed"));reject(err) });

  })
}


export function clearFolders() {

  let basePath = app.getPath('userData') + '/images/champions/';
  //delete all files in folders splash-art/centered and champion/square
  fs.readdir(basePath+'splash-art', (err, files) => {
    files.forEach((file) => {
      fs.unlink(basePath+`splash-art/${file}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
  fs.readdir(basePath+'/square', (err, files) => {
    files.forEach((file) => {
      fs.unlink(basePath+`/square/${file}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
}