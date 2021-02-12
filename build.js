const packager = require('electron-packager')

async function bundleElectronApp(options) {
    const appPaths = await packager(options)
    console.log(`Electron app bundles created:\n${appPaths.join("\n")}`)
}


let opts = { platform: "win32", arch: "x64", dir: './', }
opts["overwrite"] = true
opts["ignore"] = ["fonts", "client-win", "build.js"]

packager(opts).catch()
// bundleElectronApp(opts)
