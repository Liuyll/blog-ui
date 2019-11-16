import React from 'react'
import styles from './edit.css'
import { Input,Button,Spin } from 'antd'
import ReactQuill from 'react-quill'
import _ from 'lodash'
import axios from 'axios'
import MDEditor from 'for-editor'
import Styled from 'styled-components'
// import 'react-quill/dist/quill.show.css'

const EditorWrap = Styled.div`
    minHeight: '300px';
    marginBottom: '5px';
    width: '900px'
`
export default class EditIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            title: null,
            isMarkdown: true
        }
    }

    quillConfig = {
        toolbar: [['bold','underline'],['link','image'],['code-block']]
    }

    highDraw = () => {
        document.querySelectorAll('pre').forEach((block) => { // eslint-disable-line
            window.hljs.highlightBlock(block) // eslint-disable-line
            // console.log(block)
        })
    }

    handleChange = (text) => {
        this.saveDraftWrap(text)
        this.setState({
            text
        })
    }

    saveDraft = () => {
        this.setState({
            draftLoading: true
        })
        axios.post('/api/article/saveDraft',{
            content: this.state.text
        }).then((resp) => {
            const data = resp.data
            if(data && data.type == 'success'){
                this.setState({
                    draftLoading: false
                })
            }
        })
    }

    saveDraftWrap =  _.debounce(this.saveDraft,1000 * 5,{
        leading: true
    })

    handleTitle = ({ target: { value: title } }) => {
        // this.title = title
        this.setState({
            title
        })
    }
    
    Title = () => {
        if(this.props.scene !== 'article'){
            return <Input placeholder="Your Title" value={this.state.title} onChange={this.handleTitle} size="large" className={styles['ant-input']}></Input>
        }
        else return null
    }
    render() {
        
        return (
            <div style={{ position: 'relative',width: '900px' }}>
                <this.Title></this.Title>
                <EditorWrap>
                    {!this.state.isMarkdown ? <ReactQuill
                        onChange={this.handleChange}
                        value={this.state.text}
                        modules={this.quillConfig}
                        style={{ minHeight: '300px',marginBottom: '5px',width: '900px' }}
                        theme='snow'
                    ></ReactQuill> : (
                        <MDEditor
                            value={this.state.text}
                            onChange={this.handleChange}
                            height="300px"
                        >
                        </MDEditor>
                    )}
                </EditorWrap>

                {this.state.draftLoading ? <div><Spin size="small"/>保存中</div> : null}
                {this.state.isMarkdown ? null : <Button type="primary" onClick={this.highDraw}>高亮代码</Button>}

                <Button 
                    type="primary" 
                    onClick={() => {this.props.submit(this.state.text,this.state.title)}} 
                    style={{ marginTop: '10px' }}
                >
                    {this.props.scene ? this.props.scene : 'submit'}
                </Button>
            </div>
        )
    }
} 