import React from 'react'
import styled from 'styled-components'
import Comment from './comment'
import Judge from './judge'
import { connect } from 'dva'
import { gql,graphql } from 'react-apollo'

var MainActicleWrap = styled.div`
    
`

const JudgeQuery = gql`
    query {
        byArticleId($id:String!){
            like
        }
    }
`


@graphql(JudgeQuery,{
    options: ({ id }) => ({ variables: { id } })
})
@connect(({ globalState }) => ({ globalState })) class Article extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '<strong>该文章没有内容,请重新加载</strong>',
            //TODO:这个应该是作为props
            isJudge: true,
            infos: {
                id: null,
                author: null,
                like: null,
                unlike: null
            }
            
        }
    }

    static getDerivedStateFromProps(nextProps,prevState){ // eslint-disable-line
        let commonState = (props,old) => ({
            infos: {
                ...old,
                id: props.id,
                author: props.author
            }
        })
        if('text' in nextProps){
            return {
                ...commonState(nextProps,prevState.infos),
                text: nextProps.text
            }
        }

        return commonState(nextProps)
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
                    <div dangerouslySetInnerHTML={{ __html: this.state.text }}></div>
                    <Comment judgeArticle={this.judgeArticle} judge={this.props.judge}></Comment>
                    {this.state.isJudge ? <Judge 
                        submitJudge={this.submitJudge}
                        author={this.props.globalState.accountId}
                        other={this.state.infos.author}
                        article={this.state.infos.id}
                    ></Judge> : null }
                </MainActicleWrap>
            ]
        )
    }
} 

export default Article