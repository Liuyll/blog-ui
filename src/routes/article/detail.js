import React from 'react'
import axios from 'axios'
import Article from '../../components/article/index' // eslint-disable-line
import styled from 'styled-components'

const WrapArticle = styled.div`
  margin-left: 600px;
`

export default class _ extends React.Component {
    constructor(props) {
        super(props)
        console.log(props.match.params.id)
        axios.get(`/api/article/${props.match.params.id}`).then((resp) => {
            this.setState({
                content: resp.data
            })
            return null
        })

        this.state = {
            content: null
        }
    }

    render() {
        if(this.state.content){
            const articleConfig = {
                text:this.state.content.content,
                judge:this.state.content.judge,
                addition:this.state.content.addition
            }
            return (
                <WrapArticle>
                    <Article {...articleConfig}></Article>
                    
                </WrapArticle>
            )
        }
        return null
    }
}
