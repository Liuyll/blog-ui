export default function (src,x,y){
    if(Image){
        let IMG = new Image(y,x)
        IMG.src = src
    }
    else {
        throw new Error('not in browser env')
    }

}