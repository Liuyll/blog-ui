import React from 'react'
import { Card } from 'antd'
import immutable from 'immutable'
import { Link } from 'dva/router'
import axios from 'axios'
import styled from 'styled-components'
import moment from 'moment'
import judgeScrollToBottom from 'Utils/tools/scrollHelper'
import { Input } from 'antd'

const { Search } = Input

const qs = require('querystring')

/* eslint-disable */
const WrapList = styled.div`
  margin-left: ${window.wrapWidth};
`
/* eslint-enable */

const WrapCard = styled.div`
    margin-bottom:30px
`

export default class Article extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            articles: null,
            currentPage: 1,
            searchUrl: null,
            scrollListener: null,
            isSearch: {
                status: false,
                condition: null,
                isFirst: true
            }
        }

        var search = qs.decode(props.location.search.replace('?',''))
        var type = search.type
        var id = search.id

        if(type){
            var isAll = search.isAll
            axios.get(`/api/article/type`, {
                params: {
                    type,
                    isAll: isAll ? isAll : '0'
                }
            }).then((resp) => {
                var data = resp.data
                this.setState({
                    articles: immutable.List(data.article),
                    searchUrl: `/api/article/type`
                })
            })
        }
        else if(id){
            axios.get(`/api/article/list/${id}/${this.state.currentPage}`).then((resp) => {
                var data = resp.data
                this.setState({
                    articles: immutable.List(data.article),
                    currentPage: this.state.currentPage + 1,
                    searchUrl: `/api/article/list/${id}`
                })
            })
        }
        else {
            axios.get(`/api/article/list/${this.state.currentPage}`).then((resp) => {
                var data = resp.data
                this.setState({
                    articles: immutable.List(data.article),
                    currentPage: this.state.currentPage + 1,
                    searchUrl: `/api/article/list`
                })
            })
        }

    }
    
    componentDidMount(){
        const that = this
        document.addEventListener('scroll',() => { //eslint-disable-line
            judgeScrollToBottom() ? fetchArticle() : null
        })

        function fetchArticle(){
            if(that.state.isSearch.status) {
                that.handleSearch()
                return
            }
            axios.get(`${that.state.searchUrl}/${that.state.currentPage}`).then((resp) => {
                var data = resp.data
                that.setState({
                    articles: that.state.articles.concat(data.article),
                    currentPage: that.state.currentPage + 1
                })
            })
        }  
        
        this.state.scrollListener = fetchArticle //eslint-disable-line
    }

    componentWillUnmount(){
        document.removeEventListener('scroll',this.scrollListener) //eslint-disable-line
    }

    handleSearchInput = (value) => {
        this.state.isSearch.isFirst = true //eslint-disable-line
        this.handleSearch(value)
    }

    handleSearch = (value) => {
        const that = this
        axios.post('/api/article/search',{
            search: value,
            page: that.state.isSearch.isFirst ? 1 : that.state.currentPage
        }).then((resp) => {
            let data = resp.data
 
            this.setState((prevState) => {
                if(prevState.isSearch.isFirst){
                    return {
                        articles: immutable.List(data),
                        isSearch: {
                            status: true,
                            condition: value,
                            isFirst: false
                        },
                        currentPage: 2
                    }
                }
                else return {
                    article: prevState.articles.concat(data),
                    currentPage: prevState.currentPage + 1
                }
            })
        })
    }

    render() {
        const SearchOptions = {
            placeholder: "Types or List",
            loading: true,
            enterButton: true,
            style: {
                width: '300px',
                marginBottom: '20px'
            }
        }
        var ctx = this
        const ArticleList = function () {
            if (ctx.state.articles) {
                var articles = ctx.state.articles.toJS()
                articles = articles.map((article) => {
                    return (
                        <div>
                            <WrapCard>
                                <Card
                                    title={article.title}
                                    extra={<Link to={`/article/${article._id}`}>More</Link>}
                                    cover={<img src={`/static/${article.cover}`} />}
                                    style={{ width: '600px' }}
                                    key={article._id}
                                    id={article._id}
                                >
                                    <Card.Meta title={`author:${article.author.account} ` + `time:${moment(Number(article.time)).fromNow()}`} description={article.desc}></Card.Meta>
                                </Card>
                        
                            </WrapCard>
                        </div>
                    )
                })

                return articles
            }
            return null
        }

        return (
            <WrapList>
                <Search
                    {...SearchOptions}
                    onSearch={this.handleSearchInput}
                ></Search>  
                <ArticleList />
            </WrapList>
        )
    }
}