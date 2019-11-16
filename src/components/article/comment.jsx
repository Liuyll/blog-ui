import React from 'react'
import { Comment, Icon, Tooltip } from 'antd'
import moment from 'moment'
import styled from 'styled-components'
import styles from './comment.css'
import _ from 'lodash'

const CommentWrap = styled.div`
    width: 800px;
    border-top: 1px solid #c6c6c6;
    padding: 10px;
    border-radius: 2px;
    margin-top: 40px;
`
const NoBorderComment = styled(Comment)`
    border:0
`

class ArticleComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [
                {
                    author: 'Liuyl1',
                    other: 'Liuyl',
                    content: '这个文章写得非常好',
                    action: null,
                    likes: 0,
                    dislikes: 0,
                    createAt: '1564282184259',
                }
            ],
        }
        
        // this.state.comments = this.handleNestComment(this.state.comments)
        
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if('comments' in nextProps){
            if(Array.isArray(nextProps['comments'])){
                this.setState({
                    comments: nextProps['comments']
                })
            }
        }
    }

    handleNestComment = (comments) => {
        const commentMap = {}
        let _comments = comments
        _comments = _.sortBy(_comments,(o) => o.createAt)
        _comments.forEach((comment,index) => {
            if(!comment.nest) comment.nest = []
            if(comment.other !== this.props.articleAuthor){
                // 按照时间进行排序的,不可能回复的other是不存在的
                let i
                i = commentMap[comment.other]
      
                _comments[i].nest.push(comment)
                _comments.splice(index,1)
                if(commentMap[comment.author] == undefined){
                    commentMap[comment.author] = index
                }
            }
            
            else {
                if(commentMap[comment.author] == undefined){
                    commentMap[comment.author] = index
                }
            }
        })
        return _comments
    }

    handleChange = (index, i) => {
        //FIXME:添加与服务器交互点赞功能
        var { action } = this.state.comments[i]
        if (index === 1) {
            if (action == null) {
                let _comments = this.state.comments.slice()
                _comments[i].action = 'liked'
                _comments[i].likes++
                this.setState({
                    comments: _comments,
                })
            } else if (action == 'liked') {
                let _comments = this.state.comments.slice()
                _comments[i].action = null
                _comments[i].likes--
                this.setState({
                    comments: _comments,
                })
            } else {
                let _comments = this.state.comments.slice()
                _comments[i].action = 'liked'
                _comments[i].likes++
                _comments[i].dislikes--
                this.setState({
                    comments: _comments,
                })
            }
        } else {
            if (action == null) {
                let _comments = this.state.comments.slice()
                _comments[i].action = 'disliked'
                _comments[i].dislikes++
                this.setState({
                    comments: _comments,
                })
            } else if (action == 'disliked') {
                let _comments = this.state.comments.slice()
                _comments[i].action = null
                _comments[i].dislikes--
                this.setState({
                    comments: _comments,
                })
            } else {
                let _comments = this.state.comments.slice()
                _comments[i].action = 'disliked'
                _comments[i].dislikes++
                _comments[i].likes--
                this.setState({
                    comments: _comments,
                })
            }
        }
    }

    render() {
        const action = (i,v) => [
            <span key='1'>
                <Tooltip title="like">
                    <Icon
                        type="like"
                        theme={
                            this.state.comments[i].action === 'liked'
                                ? 'filled'
                                : 'outlined'
                        }
                        onClick={() => this.handleChange(1, i)}
                    />
                    <span style={{ paddingLeft: 8, cursor: 'auto' }}>
                        {this.state.comments[i].likes}
                    </span>
                </Tooltip>
            </span>,
            <span key='2'> 
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={
                            this.state.comments[i].action === 'disliked'
                                ? 'filled'
                                : 'outlined'
                        }
                        onClick={() => this.handleChange(2, i)}
                    />
                </Tooltip>
                <span style={{ paddingLeft: 8, cursor: 'auto' }}>
                    {this.state.comments[i].dislikes}
                </span>
            </span>,
            <span key="3" onClick={() => this.props.judgeOther(v.authorId)}>评论他</span>,
        ]

        const commentOptions = (v,i) => ({
            key: i,
            actions: action(i,v),
            author: <a>{v.author}</a>,
            content: <p>{v.content}</p>,
            datetime: moment(parseInt(v.createAt)).fromNow()
        })
    

        return (
            <CommentWrap className={this.props.className}>
                <div
                    style={{
                        padding: '10px',
                        borderBottom: 0,
                    }}
                >
                    <strong>{this.state.comments.length}条评论</strong>
                </div>
                {this.state.comments.map((v, i) => {
                    if(!this.props.isMore && i > 1) return null 
                    return (
                        <NoBorderComment
                            style={{ border: 0 }}
                            className={
                                i == this.state.comments.length - 1
                                    ? styles['last-comment']
                                    : ''
                            }
                            {...commentOptions(v,i)}
                            key={i}
                        >
                            {(v.nest && v.nest.length != 0 && this.props.isMore) ? v.nest.map((v,i) => <Comment 
                                {...commentOptions(v,i)}
                            />) : null}
                        </NoBorderComment>
                    )}
                )}
            </CommentWrap>
        )
    }
}

ArticleComment.defaultProps = {
    articleAuthor: 'Liuyl'
}

export default ArticleComment
