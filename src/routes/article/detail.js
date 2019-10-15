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
        axios.get(`/api/article/${props.match.params.id}`).then((resp) => {
            this.setState({
                infos: resp.data,
                // author: resp.author._id
            })
            return null
        })

        this.state = {
            infos: null
        }
    }

    render() {
        if(this.state.infos){
            const articleConfig = {
                text: this.state.infos.infos,
                judge: this.state.infos.judge,
                addition: this.state.infos.addition
            }
            return (
                <WrapArticle>
                    <Article {...articleConfig} id={this.props.match.params.id} author={this.state.infos.author._id}></Article>
                </WrapArticle>
            )
        }
        return null
    }
}
