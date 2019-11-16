function drawText(canvas,{
    text,
    x = 150,
    y = 75,
    color,
    font
}){
    canvas.fillStyle = color
    canvas.font = '30px Arial'
    canvas.textAlign = 'center'
    canvas.fillText(text,x,y)
}

export { drawText }