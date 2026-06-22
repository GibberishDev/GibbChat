const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("tmi",{
	connectTwitchChat: (channels) => {ipcRenderer.send('connectTwitchChat',[channels])},
	connectYoutubeChat: (channelID) => {ipcRenderer.send('connectYoutubeChat',[channelID])},
	twitchChatMessage: (message) => ipcRenderer.on('twitchChatMessage',message),
	youtubeChatMessage: (message) => ipcRenderer.on('youtubeChatMessage',message)
})