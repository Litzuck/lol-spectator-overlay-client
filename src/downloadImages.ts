import * as requestretry from 'requestretry';
import * as fs from 'fs';
import * as request from 'request';
import {app} from 'electron';
import * as fastq from "fastq";

type Task = {
  url: string,
  path: string
  func: (urL: string, path: string) => Promise<void>
}


const q = fastq.promise(asyncWorker, 10);

async function asyncWorker(task: Task) {
  try {
    await task.func(task.url, task.path);
  } catch (e) {
    console.error(e);
    q.push(task);
  }
}
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

  deleteCorruptFiles();
  let versionResponse = await downlaodJson("https://ddragon.leagueoflegends.com/api/versions.json");
  let latestVersion = versionResponse[0];
  console.log("latest version: " + latestVersion);
  let championResponse = await downlaodJson(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
  let championData = championResponse.data;

  let basePath = app.getPath('userData') + '/images/champions/';

  createDir(basePath+'square/');
  createDir(basePath+'splash-art/');
  Object.values(championData).forEach(async (k: {key: any, id: any}) => {
    let imagePath = basePath + `square/${k.key}.png`;
    if (!(fs.existsSync(imagePath))) {
      console.log(`Champion icon for champion with key ${k.key} missing. \n Downloading now...`);
      q.push({url: `http://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${k.id}.png`, path: imagePath, func: downloadAndSave});
      console.log(`Champion icon for champion with key ${k.key} downloaded.`);
    }
  });

  Object.values(championData).forEach(async (k: {key: any, id: any}) => {
    let imagePath = basePath + `splash-art/${k.key}.png`;
    if (!(fs.existsSync(imagePath))) {
      console.log(`Champion splash art for champion with key ${k.key} missing. \n Downloading now...`);
      q.push({url: `https://cdn.communitydragon.org/latest/champion/${k.id}/splash-art/centered`, path: imagePath, func: downloadAndSave});
      console.log(`Champion splash art for champion with key ${k.key} downloaded.`);
    }
  });
}

function downloadAndSave(url, path) {
  return new Promise<void>((resolve, reject) => {

    requestretry.default(url, { timeout: 30000, retryStrategy: requestretry.RetryStrategies.HTTPOrNetworkError, retryDelay: 5000, maxAttempts: 5 })
      .on('error', (err) => { console.error(err); reject(err); })
      .pipe(fs.createWriteStream(path))
      .on('finish', () => { resolve() })
      .on('error', (err) => { fs.unlink(path, ()=> console.log("Download with path "+ path+ " failed"));reject(err) });

  })
}


export function clearFolders() {

  let basePath = app.getPath('userData') + '/images/champions/';
  // delete all files in folders splash-art/centered and champion/square
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

function deleteCorruptFiles(){

  let basePath = app.getPath('userData') + '/images/champions/';
  // delete all corrupt files in folders splash-art/centered and champion/square
  fs.readdir(basePath+'splash-art', (err, files) => {
    if (err) {
      console.log(err);
      return;
    }

    files.forEach((file) => {
      if(fs.existsSync(basePath+`splash-art/${file}`) && fs.lstatSync(basePath+`splash-art/${file}`).size === 0){
        fs.unlink(basePath+`splash-art/${file}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });

  fs.readdir(basePath+'/square', (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    files.forEach((file) => {
      if(fs.existsSync(basePath+`/square/${file}`) && fs.lstatSync(basePath+`/square/${file}`).size === 0){
        fs.unlink(basePath+`/square/${file}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });
}