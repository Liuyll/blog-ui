/* eslint-disable */
import React from 'react'
import { connect } from 'dva'

import Edit from '../components/article/edit'
import axios from 'axios'
import checkstatus from '../utils/request/checkstatus'
import TreeSelect from '../components/TreeSelect'
import styled from 'styled-components'
import { message } from 'antd'

const WrapEdit = styled.div`
    /* eslint-disable */
    margin-left: ${window.wrapWidth};
    /* eslint-enable */
`
@connect(({ data, globalState, routerHelp }) => ({ data, globalState, routerHelp }))
class Add extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            type: null,
            value: null,
        }
        if (!props.globalState.isLogin) {
            message.info('先去登录吧!')
            setTimeout(() => {
                props.history.push({
                    pathname: '/register'
                })
            }, 1000)
        }
    }

    submitArticle = (content, title) => {
        var isLogin = this.props.globalState.isLogin
        if (!isLogin) {
            message.info('先去登录吧!')
            return setTimeout(() => this.props.history.push('/register'), 1000)
        }
        var author = this.props.globalState.username
        var authorId = this.props.globalState.accountId
        var type = this.state.type

        var postObj = {
            content,
            title,
            author,
            authorId,
            type,
        }

        axios.post('/api/article/', postObj).then(resp => {
            var result = checkstatus(resp)
            
            if (result) {
                let lasturl = this.props.routerHelp.lastURL
                if (lasturl) {
                    this.props.history.push(lasturl)
                }
            }
        })
    }

    valueChange = type => {
        this.setState({
            type,
        })
    }
    render() {
        return (
            <WrapEdit>
                <div style={{ width: '900px' }}>
                    <div
                        style={{
                            width: '900px',
                            height: '350px',
                            background: 'url("/static/1.jpg")',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            marginBottom: '15px',
                        }}
                    />
                    <TreeSelect
                        width="300px"
                        valueChange={this.valueChange}
                        menus={this.props.data.getIn(['display', 'menus'])}
                        value={this.state.type}
                    />
                    <Edit submit={this.submitArticle} />
                </div>
            </WrapEdit>
        )
    }
}

export default Add
