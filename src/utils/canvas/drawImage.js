function drawImage(canvas,{
    imgSrc
},cb){
    let img = new Image(300,150)
    img.src = imgSrc
    img.onload = (_img) => {
        canvas.drawImage(img,0,0,300,150)
        cb()
    }
    img.onerror = (err) => console.log(err)   
}

export { drawImage }