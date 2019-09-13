import React from 'react'
import { Card } from 'antd'
import immutable from 'immutable'
import { Link } from 'dva/router'
import axios from 'axios'
import styled from 'styled-components'
import moment from 'moment'

const qs = require('querystring')

/* eslint-disable */
const WrapList = styled.div`
  margin-left: ${window.wrapWidth};
`
/* eslint-disable */

const WrapCard = styled.div`
    margin-bottom:30px
`

export default class Article extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            articles: null
        }

        var search = qs.decode(props.location.search.replace('?',''))
        var type = search.type
        var id = search.id

        if(type){
            var isAll = search.isAll
            axios.get(`/api/article/type/`, {
                params: {
                    type,
                    isAll:isAll ? isAll : '0'
                }
            }).then((resp) => {
                var data = resp.data
                this.setState({
                    articles: immutable.List(data.article)
                })
            })
        }
        else if(id){
            axios.get(`/api/article/list/${id}`).then((resp) => {
                var data = resp.data
                this.setState({
                    articles: immutable.List(data.article)
                })
            })
        }
        else {
            axios.get('/api/article/list').then((resp) => {
                var data = resp.data
                this.setState({
                    articles: immutable.List(data)
                })
            })
        }
    }
    

    render() {

        var ctx = this
        const ArticleList = function () {
            if (ctx.state.articles) {
                var articles = ctx.state.articles.toJS()
                articles = articles.map((article) => {
                    return (
                        <WrapCard>
                            <Card
                                title={article.title}
                                extra={<Link to={`/article/${article._id}`}>More</Link>}
                                cover={<img src={`/static/${article.cover}`} />}
                                style={{ width: '600px' }}
                                key={article._id}
                            >
                                <Card.Meta title={`author:${article.author.account} `+`time:${moment(Number(article.time)).fromNow()}`} description={article.desc}></Card.Meta>
                            </Card>
                    
                        </WrapCard>
                    )
                })

                return articles
            }
            return null
        }

        return (
            <WrapList>
                <ArticleList />
            </WrapList>
        )
    }
}