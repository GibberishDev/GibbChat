const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("tmi",{
	connectTwitchChat: (channels) => {
		ipcRenderer.send('connectTwitchChat',[channels])
	},
	connectYoutubeChat: (channels) => {
		ipcRenderer.send('connectYoutubeChat',[channels])
	},
	twitchChatMessage: (message) => ipcRenderer.on('twitchChatMessage',message)
})