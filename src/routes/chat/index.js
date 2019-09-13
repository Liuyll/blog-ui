import React from 'react'
import styled from 'styled-components'
import io from 'socket.io-client'
import { connect } from 'dva'
// eslint-disable-next-line
import immutable, { Map, List } from 'immutable'
import moment from 'moment'
import { Input, Button, Spin, message, Avatar, Upload, Icon } from 'antd' // eslint-disable-line
import { parseMsg, handleTimeout } from '../../utils/ioHelper'
import style from './index.css'

const RoomWrap = styled.div`
   display:flex;
   position:relative;
   height:600px;
   width:600px; 
   flex-wrap:wrap;
`

const ChatWindowWrap = styled.div`
    width:65%;
`

const InfoWrap = styled.div`
    border:10px solid white;
    flex:0 1 60%;
    width:200px;
    border-radius:10px;
    padding:10px;
    display:flex;
    flex-direction:row row-reverse;
    justify-content:space-around;
    background-color:${props => props.color}
`

const ActionWrap = styled.div`
    width:30%;
    border-left:1px solid black;
    margin-left:auto;
    display:flex;
    flex=direction:column;
`

const SendWrap = styled.div`
    display:flex;
`

const LineWrap = styled.div`
    flex-basis:100%;
`

const SendPicPreviewWrap = styled.div`
    display:flex;
`

const SendPicPreview = styled.div`
    width:30%;
    margin-left:10px;
`




@connect(({ globalState }) => ({ globalState }))
export default class ChatRoomUI extends React.Component {
    constructor(props) {
        super(props)

        let socket = new io('ws://localhost:3000/', {
            query: {
                auth: localStorage.getItem('token') // eslint-disable-line
            },
            reconnectionAttempts: 2
        })

        this.inputRef = React.createRef()
        this.state = {
            sendPics:List([]),
            socket: socket,
            infos: List([]),
            inputValue: null,
            sendLoading: false,
            clients: null,
            clientCount: null,
        }
        socket.emit('chat', JSON.stringify({ room: 'test1' }))

        socket.emit('updateClientCount', JSON.stringify({
            room: 'test1'
        }))
        // event
        // console.log(parseMsg)
        socket.on('message', (data) => { console.log(data) })

        socket.on('updateClientCount', (data) => {
            this.setState({
                clientCount: Number(data)
            })
        })

        socket.on(socket.id, (payload) => {
            try {
                payload = JSON.stringify(payload)
                if (payload.account == 'info') {
                    this.setState({
                        infos: this.state.infos.push({
                            presenter: {
                                id: payload.presenter.id,
                                account: payload.presenter.account
                            },
                            message: payload.payload.message,
                            date: payload.meta.date
                        })
                    })
                }
            } catch (error) {
                console.log(error)
            }
        })

        socket.on('info', (payload) => {
            payload = JSON.parse(payload)
            if (payload.payload.presenter.socketId == this.state.socket.id) return
            this.setState({
                infos: this.state.infos.push(payload.payload)
            })
        })

        socket.on('updateClietns', (payload) => {
            this.setState({
                clients: payload.payload.clients
            })
        })

        socket.on('hello', (data) => {
            console.log(data)
        })

    }

    handleChange = ({ target: { value } }) => {
        this.setState({
            inputValue: value
        })
    }

    submit = () => {
        const ctx = this

        this.setState({
            sendLoading: true
        })

        function handleError() {
            message.error('网络错误,请检查你的网络')
            ctx.setState({
                sendLoading: false
            })
        }

        function cb(err, thisInfo) {

            if (!err) {
                if (thisInfo) {
                    thisInfo = JSON.parse(thisInfo)
                    ctx.setState({
                        infos: ctx.state.infos.push(thisInfo),
                        sendLoading: false
                    })
                }
                else {

                    ctx.setState({
                        sendLoading: false
                    })
                }
            }

            else {
                message.info("网络出错,请重发")
                ctx.setState({
                    sendLoading: false
                })
            }
        }

        const payload = parseMsg(
            'submit',
            {
                room: 'chat',
                message: this.state.inputValue
            }
        )

        handleTimeout(this.state.socket, 'submit', payload, cb, 2000, handleError)

    }

    submitPicture = ({ target }) => {
        let pic = target.files[0]

        const ctx = this
        console.log(target)


        const picReader = new FileReader() // eslint-disable-line
        picReader.readAsDataURL(pic)
        picReader.onload = function () {
            ctx.setState({
                sendPics:ctx.state.sendPics.push(this.result)
            })
            ctx.state.socket.emit('submit', JSON.stringify(parseMsg(
                'submit',
                {
                    type: 'pic',
                    data: this.result
                }
            )))
        }
    }

    openPictureTool = () => {
        const submitTool = this.inputRef.current
        submitTool.click()

    }

    componentWillUnmount() {
        this.state.socket.disconnect()
    }



    render() {
        return (
            <RoomWrap>
                <ChatWindowWrap>
                    {
                        this.state.infos && this.state.infos.map((info, i) => {
                            if (info.presenter == this.state.socket.id) {
                                return (
                                    <InfoWrap color="#6495ED" key={i} className={style.right}>
                                        <div style={{ width: '60%' }}>{info.message}</div>
                                        <div style={{ width: '60%' }}>{moment(info.date).fromNow()}</div>
                                    </InfoWrap>)
                            }
                            else return (
                                <InfoWrap color="#90EE90" key={i} className={style.left}>
                                    <div style={{ width: '60%' }}>{info.message}</div>
                                    <div style={{ width: '60%' }}>{moment(info.date).fromNow()}</div>
                                </InfoWrap>
                            )
                        })
                    }

                    <SendWrap>
                        <div
                            style={{ position: 'absolute', bottom: '20px' }}
                        >
                            <LineWrap>
                                <Input
                                    value={this.state.inputValue}
                                    onChange={this.handleChange}
                                    style={{ width: '300px' }} />
                                {this.state.sendLoading ? <Spin /> : <Button type="primary" onClick={this.submit}>send</Button>}
                                <Icon type="picture" onClick={this.openPictureTool} />
                            </LineWrap>
                            <SendPicPreviewWrap>
                                {this.state.sendPics ? this.state.sendPics.map((src, i) => {
                                    return (
                                        <SendPicPreview key={i}>
                                            <img height="50" width="50" src={src} />
                                        </SendPicPreview>
                                    )
                                })
                                    : null}
                            </SendPicPreviewWrap>
                            <input
                                type="file"
                                style={{ display: 'none', width: '20px' }}
                                id='pic'
                                onChange={this.submitPicture}
                                ref={this.inputRef}
                            ></input>
                        </div>

                    </SendWrap>
                </ChatWindowWrap>
                <ActionWrap>
                    <div>
                        <div>
                            当前在线人数:{this.state.clientCount}
                        </div>
                    </div>
                </ActionWrap>
            </RoomWrap>
        )
    }
}