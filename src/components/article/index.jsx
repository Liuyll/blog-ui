import React from 'react'
import styled from 'styled-components'
import Comment from './comment'
import Judge from './judge'

var MainActicleWrap = styled.div`
    
`

export default class EditIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '<strong>该文章没有内容,请重新加载</strong>',
            isJudge: false
        }
    }

    static getDerivedStateFromProps(nextProps,prevState){ // eslint-disable-line
        if('text' in nextProps){
            return {
                text:nextProps.text
            }
        }

        return null
    }

    judgeArticle = () => {
        this.setState({
            isJudge: true
        })
    }

    submitJudge = () => {
        this.setState({
            isJudge: false
        })
    }

    render() {
        return (
            [
                <MainActicleWrap>
                    <div dangerouslySetInnerHTML={{__html:this.state.text}}></div>
                    <Comment judgeArticle={this.judgeArticle} judge={this.props.judge}></Comment>
                    {this.state.isJudge ? <Judge submitJudge={this.submitJudge}></Judge> : null }
                </MainActicleWrap>
            ]
        )
    }
} 