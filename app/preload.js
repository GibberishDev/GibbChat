const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("tmi",{
	connectTwitchChat: (channels) => {
		ipcRenderer.send('connectTwitchChat',[channels])
	},
	twitchChatMessage: (message) => ipcRenderer.on('twitchChatMessage',message)
})