import React from 'react'
import { Comment, Icon, Tooltip } from 'antd'
import moment from 'moment'
import immutable from 'immutable'
import styled from 'styled-components'
import styles from './comment.css'

const CommentWrap = styled.div`
    width: 800px;
    border: 1px solid #c6c6c6;
    padding: 10px;
    border-radius: 2px;
    margin-top: 40px;
`

export default class ArticleComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [
                {
                    author: 'Liuyl',
                    comment: '这个文章写得非常好',
                    action: null,
                    likes: 0,
                    dislikes: 0,
                    datatime: '1564282184259',
                },
                {
                    author: 'Liuyl1',
                    comment: '这个文章写得非常好',
                    action: null,
                    likes: 0,
                    dislikes: 0,
                    datatime: '1564262884259',
                },
                {
                    author: 'Liuyl',
                    comment: '这个文章写得非常好',
                    action: null,
                    likes: 0,
                    dislikes: 0,
                    datatime: '1564282884259',
                },
            ],
        }
        this.imtest1 = immutable.Map({
            a: 1,
        })
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
        const action = i => [
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
            <span key='3' onClick={this.props.judgeArticle}>评论他</span>,
        ]
        return (
            <CommentWrap>
                <div
                    style={{
                        padding: '10px',
                        borderBottom: '1px solid rgba(198,198,198,.2)',
                    }}
                >
                    <strong>{this.state.comments.length}条评论</strong>
                </div>
                {this.state.comments.map((v, i) => (
                    <Comment
                        className={
                            i == this.state.comments.length - 1
                                ? styles['last-comment']
                                : ''
                        }
                        key={i}
                        actions={action(i)}
                        author={<a>{v.author}</a>}
                        content={<p>{v.comment}</p>}
                        datetime={moment(v.datatime).fromNow()}
                    />
                ))}
            </CommentWrap>
        )
    }
}
