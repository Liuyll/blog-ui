import React from 'react'
import styled from 'styled-components'
import Comment from './comment'
import Judge from './judge'
import { connect } from 'dva'
import { Apollo } from '../../utils/request/graphql'
import  gql  from 'graphql-tag'
import { Switch,message } from 'antd'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'


const JudgeQuery = (id) => {
    const querystr = `query Judge{
        byArticleId(id:"${id}") {
            like,
            dislike,
            author,
            content,
            other,
            createdAt
        }
    }`
    return gql(querystr)
}

const JudgeSubmit = (infos) => {
    return gql(`
        mutation submitJudge {
            JudgeOther(infos:"${infos}") {
                type
            }
        }
    `)
}

var MainArticleWrap = styled.div`
    
`


@connect(({ globalState }) => ({ globalState })) 
@Apollo
class Article extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // Text应向服务器申请
            text: '<strong>该文章没有内容,请重新加载</strong>',
            
            //TODO:这个应该是作为props
            isJudge: false,
            judgePeople: null, // 评论对象

            infos: {
                id: null,
                author: null,
                like: null,
                unlike: null
            },
            comments: null,
            // 是否展示更多评论
            isMore: false,
            judgeRefetch: null
        }

        axios.get(`/api/article/content/${props.id}`).then((resp) => {
            let data = resp.data
            
            if(data.type == 'success'){
                console.log(data.content)
                this.setState({
                    text: data.content
                })
            }
        })
        this.client = props.query
        this.queryJudge()
    }


    static getDerivedStateFromProps(nextProps,prevState){ // eslint-disable-line
        let commonState = (props,old) => ({
            infos: {
                ...old,
                id: props.id,
                author: props.author
            }
        })

        // if('text' in nextProps){
        //     return {
        //         ...commonState(nextProps,prevState.infos),
        //         text: nextProps.text
        //     }
        // }

        return commonState(nextProps)
    }

    judgeOther = (id) => {
        this.setState(prevState => (
            {
                isJudge: !prevState.isJudge,
                judgePeople: id
            }
        ))
    }

   
    /**
     *
     *
     * @memberof Article
     * graphql version
     */
    submitJudge = (infos) => {
        this.setState({
            isJudge: false
        })

        this.client(JudgeSubmit(infos)).then((resp) => {
            const data = resp.data
            const { type } = data
            if(type != 'success') {
                message.error('提交失败,请重试')
            }
        })
    }

    queryJudge = () => {
        // if(this.state.judgeRefetch) {
        //     this.state.judgeRefetch().then(result => {
        //         console.log(result)
        //     })
        // }
        this.client(JudgeQuery(this.props.id)).then((result) => {
            if(result){
                this.setState({
                    comments: result.data && result.data.byArticleId
                })
            }
        })
    }

    submitJudgeSuccessCb = () => {
        this.queryJudge()
        this.setState({
            isJudge: false
        })
        
    }

    handleShowMore = () => {
        this.setState((prevState) => ({ isMore: !(prevState.isMore) }))
    }

    handleJudge = () => {
        this.setState((prevState) => ({ 
            isJudge: !(prevState.isJudge) ,
            judgePeople: this.props.author
        }))
    }
    render() {
        const ContentRender = this.props.isMarkdown ? (
            <ReactMarkdown
                source={this.state.text}
            ></ReactMarkdown>
        ) : (
            <div
                dangerouslySetInnerHTML = {{ __html: this.state.text }}
            ></div>
        )
        
        return (
            [
                <MainArticleWrap>
                    {
                        ContentRender
                    }
                    <Comment 
                        judgeOther={this.judgeOther} 
                        judge={this.props.judge} 
                        id={this.state.infos.authors}
                        isMore={this.state.isMore}
                        comments={this.state.comments}
                    ></Comment>
                    <Switch
                        style={{ marginTop: '10px',marginLeft: '20px' }}
                        onChange={this.handleShowMore}
                        size="default"
                        checkedChildren="less"
                        unCheckedChildren="more"
                    />
                    <Switch
                        style={{ marginTop: '10px',marginLeft: '20px' }}
                        onChange={this.handleJudge}
                        size="default"
                        checkedChildren="编辑"
                        unCheckedChildren="评论"
                    />
                    {this.state.isJudge  ?  <Judge 
                        submitJudgeSuccessCb={this.submitJudgeSuccessCb}
                        author={this.props.globalState.accountId}
                        other={this.state.judgePeople}
                        article={this.state.infos.id}
                    ></Judge> : null}
                    {/* <Query query={JudgeQuery(this.props.id)}>
                        {({ data }) => <div>{data}</div>} 
                    </Query> */}
                </MainArticleWrap>
            ]
        )
    }
} 

export default Article