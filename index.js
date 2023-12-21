const imageTag = document.getElementById("imageTag")

window.electronAPI.getImage((event, data)=> {
    imageTag.src = data
    window.electronAPI.closeWindow2();
})

const openCamera = document.getElementById("openCamera")

openCamera.addEventListener("click", ()=>{
    window.electronAPI.openCamera()
})