import React,{ useState,useEffect } from 'react'
import { Link,withRouter } from 'dva/router'
import { connect } from 'dva'
import styled,{ keyframes } from 'styled-components'
import { Dropdown, Avatar, Badge, Menu, Modal } from 'antd'
import _ from 'lodash'
import Chat from '../../routes/chat/index'
import redirectLogin from '../help/redirectLogin'

const StyledLink = styled(Link)`
  color: palevioletred;
  font-weight: bold;
`

var currentKeyframes = {
    head: keyframes`
        0%{
            top:-180px;
        }

        100%{
            top:50px;
        }

    `
}
const HeadWrap = styled.div`
    text-align:center;
    margin-bottom:40px;
    height:250px;
`

const Wrap = styled('div')`
    width:100%;
    position:absolute;
    text-align:center;
    animation:1.5s ${currentKeyframes.head} linear forwards;
`

const ListWrap = styled.ul`
    display:flex;
    flex-direction:row;
    justify-content:center;
    list-style:none
`

const Li = styled.li`
    width:60px
`

const AccountState = styled.div`
    width:140px;
    display:flex;
    justify-content:space-between;
    position: fixed;
    top:30px;
    right:120px;
`


function Head(props) {
    const [visible,setVisible] = useState(false)
    var lists = {
        main: '/',
        add: '/article/add',
        article: '/article/list',
        info: '/infos',
        chat: '/chat'
    }

    const List = (
        _.map(lists, (v, i) => {
            if(i == 'chat') return <StyledLink as='a' onClick={enterChat} key={i}>{i}</StyledLink> // eslint-disable-line
            return (
                <Li key={i}>
                    <StyledLink to={v}>{i}</StyledLink>
                </Li>
            )
        })
    )
    
    const menu = (
        <Menu>
            <Menu.Item>回复我的</Menu.Item>
            <Menu.Item>我的浏览</Menu.Item>
            <Menu.Item>我的收藏</Menu.Item>
        </Menu>
    )
    
    function enterChat(){
        if(props.globalState.isLogin){
            setVisible(true)
        }
        else {
            redirectLogin(props.history)
        }
    }
    function handleLoginOut(){
        const { dispatch } = props
        dispatch({
            type: 'globalState/changeLoginState',
            payload: false
        })
        localStorage.removeItem('token') // eslint-disable-line
        props.history.push('/')
    }

    function handleCancel(){
        setVisible(false)
    }


    const ModalConfig = {
        maskClosable: false,
        width: '700px',
        visible: visible,
        onCancel: handleCancel,
        destroyOnClose: true,
        footer: null,
        centerer: true
    }
    return (
        <HeadWrap>
            <Wrap>
                <img src="/static/logo.png"></img>
                <ListWrap>
                    {List}
                </ListWrap>
            </Wrap>
            <AccountState>
                {props.globalState.isLogin ? <div style={{ display: 'flex',justifyContent: 'space-around',width: '100%' }}>
                    <div>
                        <Dropdown overlay={menu}>
                            <Badge count={1}>
                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></Avatar>
                            </Badge>
                        </Dropdown>
                    </div>
                    <div>
                        <a style={{ color: '#8DE0FF' }} onClick={handleLoginOut}>login out</a>
                    </div>
                </div>
                    : <Link to={"/register"}>sign up</Link>
                }
            </AccountState>
            <Modal
                {...ModalConfig}
            >
                <Chat></Chat>
            </Modal>
        </HeadWrap>
    )
}

export default withRouter(connect(({ globalState }) => ({ globalState }))(Head))