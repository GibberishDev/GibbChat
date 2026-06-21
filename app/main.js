const { app, BrowserWindow, webContents, Menu, ipcMain } = require('electron')
const path = require("path")
const tmi = require('tmi.js')
const { LiveChat } = require("youtube-chat")
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

var ytClient

async function connectYoutubeChat(channelID) {
  if (ytClient) {ytClient.stop()}
  ytClient = new LiveChat({channelId:channelID})
  ytClient.on("chat",(message)=>{console.log(message)})
  let status = await ytClient.start()
  if (!status) {
    console.log("Failed to connect to youtube channel")
    ytClient.stop()
  }
}

ipcMain.on('connectTwitchChat',(_ev,data) => {
  let channels = data[0]
  connectTwitchChat(channels)
})
ipcMain.on('connectYoutubeChat',(_ev,data) => {
  let channels = data[0]
  connectYoutubeChat(channels.account)
})