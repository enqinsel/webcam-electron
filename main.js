const { app, BrowserWindow, Menu, shell, ipcMain,globalShortcut } = require("electron");
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    fullscreen: true, 
    backgroundColor: "#00aaff",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  
  // win.webContents.openDevTools()
  ipcMain.on("set-image", (event, data) => {
    win.webContents.send("get-image", data)
  })

  globalShortcut.register('F5', () => {
    win.reload()
  })
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

});

app.on("window-all-closed", () => {
  if (process.platform !== "win32") app.quit();
});


const createCamera = () => {
  const camera = new BrowserWindow({
    height: 600,
    with: 600,
    show: false,
    backgroundColor: "#00aaff",
    fullscreen: false,
    webPreferences: {
      preload: path.join(__dirname, "cameraPreload.js"),
    },
  })

  // camera.webContents.openDevTools()
  camera.loadFile("camera.html");

  camera.once("ready-to-show", () => camera.show())

  globalShortcut.register('F5', () => {
    camera.reload()
  })

  ipcMain.on("close-window-2", ()=>{
    camera.close();
  })
}

ipcMain.on("open-camera", ()=> {
  createCamera();
})

const menuItems = [
  {
    label: "Help",
    submenu: [
      {
        label: "Learn More",
        click : async () => {
          await shell.openExternal('https://electronjs.org')
        }
      },
      // {
      //   label: "Open Camera",
      //   click : async () => {
      //     const win2 = new BrowserWindow({
      //       height: 800,
      //       with: 600,
      //       show: false,
      //       // backgroundColor: '#2e2c29' ,
      //       fullscreen: false,
      //       webPreferences: {
      //         preload: path.join(__dirname, "cameraPreload.js"),
      //       },
      //     })

      //     win2.loadFile("camera.html");
      //     // win2.loadURL('https://www.electronforge.io/')
      //     win2.once("ready-to-show", () => win2.show())
      //     // win2.setBackgroundColor('hsl(230, 100%, 50%)')


      //     globalShortcut.register('F5', () => {
      //       win2.reload()
      //     })

      //     ipcMain.on("close-window-2", ()=>{
      //       win2.close();
      //     })
      //   }
      // },
    ]
  },
  {
    label: "Window",
    submenu: [
      {
        role: "minimize"
      },
      {
        role: "copy"
      }
    ]
  },
  {
    label: "Exit",
    click: () => {
      app.quit()
    }
  },
]

const menu = Menu.buildFromTemplate(menuItems)
Menu.setApplicationMenu(menu)
