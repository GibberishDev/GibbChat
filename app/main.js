const { app, BrowserWindow, webContents, Menu, ipcMain } = require('electron')
const path = require("path")
const tmi = require('tmi.js')
const emotes = require("./scripts/emotes")

var win

function createWindow() {
  win = new BrowserWindow({
    width: 1088,
    height: 612,
	icon: path.join(__dirname,"icon.ico"),
	webPreferences: {
		menuBarVisible: false,
		title: "GibbChat",
    preload: path.join(__dirname, 'preload.js')
	}
  })

  win.loadFile('app/index.html')
  win.webContents.openDevTools()
  win.setMenu(null)
  return win
}

app.whenReady().then(() => {
  win = createWindow()
  emotes.fetchEmotes(["gibbdev"])
  setTimeout(()=>{console.log(emotes.getEmoteImageUrl("GibbExplode"))},10000)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

var twitchClient

function connectTwitchChat(channels) {
  if (twitchClient) {twitchClient.disconnect()}
  twitchClient = new tmi.Client({channels: channels})
  twitchClient.connect()
  twitchClient.on('message', (channel, userstate, message, self) => {
    win.webContents.send("twitchChatMessage", {"channel":channel,"message":message,"userstate":userstate,"self":self})
  })
} 

ipcMain.on('connectTwitchChat',(_ev,data) => {
  let channels = data[0]
  connectTwitchChat(channels)
})