# IMPORTANT NOTICE
This tool will probably receive no further updates, if you have any issues and need a tool like this, look at the other alternatives available for this.

# Lol Spectator Overlay

This is a tool that produces a custom League of Legends Champion Select Overlay that is inspired by the one used in the LEC and LCS between 2015-2017.


## Usage

Just download the latest release for your platform and you are nearly ready to go. 
First run the `lol-esports-spectate-client.exe` and after that you just have to join a custom lobby AS A SPECTATOR and press the button `Start Overlay`. 
If there is some weird behavior you can restart the Overlay by using `Stop Overlay` and `Start Overlay`, which should fix most errors.
Furthermore you can customize the colors of the overlay with the different color pickers.   

## Preview Image

![alt text](example.png "Logo Title Text 1")


## Development

### Electron Development

To start the Electron application use `npm start`. You have to restart the Electron application everytime you make some changes to the Electron.
For more information look at Electrons documentation [here](https://www.electronjs.org/docs).

To build the application you can either run `npm run build`, whichs builds the Electron application using `electron-forge` and outputs it to the `out` folder.

### React Development

To develop the React Overlay, you can use `npm start` in the `overlay-react` folder to start the development server. For more information about React have a look at the React documentation [here](https://reactjs.org/docs/getting-started.html).
After you made your changes you can use `npm run build` to create a production build, which will be output to the `build` folder in the main directory and will be packaged into your Electron application, when you build it.
## Creating custom overlays

The Electron application opens a websocket server on port 8080, and outputs to every connected websocket each relevant event for the champion selection as well as the configs, which are set in the config.json or the web form.
For more detailed information have a look at the complete [customization guide](./Customize.md)

# Legal disclaimer

Lol Spectator Overlay isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
