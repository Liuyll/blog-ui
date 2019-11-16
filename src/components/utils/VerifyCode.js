import React,{ useRef,useEffect } from 'react'
import styles from 'styled-components'
import { drawText } from 'Utils/canvas/drawText'
import { drawImage } from 'Utils/canvas/drawImage'

const Canvas = styles.canvas`
    height:${(props) => props.height},
    weight:${(props) => props.weight}
`
export default function VerifyCode(props){
    const canvasRef = useRef()
    useEffect(() => {
        let canvas = canvasRef.current
        if(canvas){
            console.log('qweqwe')
            let canvas2d = canvas.getContext('2d')
            drawImage(canvas2d,{ imgSrc: '/static/1.jpg' },() => {
                drawText(canvas2d,{
                    text: props.text,
                    color: 'red'
                }) 
            })
        }
    },props.text)
    return (
        <Canvas
            height={props.height}
            width={props.width}
            ref={canvasRef}
        />
    )
}