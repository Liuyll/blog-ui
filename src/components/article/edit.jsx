import React from 'react'
import styles from './edit.css'
import { Input } from 'antd'
import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.show.css'

export default class EditIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            title: null
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
        this.setState({
            text
        })
    }

    handleTitle = ({ target: { value: title } }) => {
        // this.title = title
        this.setState({
            title
        })
    }
    submitStyles = {
        color: 'grey',
        position: 'absolute',
        right: '0px'
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
                <ReactQuill
                    onChange={this.handleChange}
                    value={this.state.text}
                    modules={this.quillConfig}
                    style={{ minHeight: '300px',marginBottom: '5px',width: '900px' }}
                    theme='snow'
                ></ReactQuill>
                <button type="button" onClick={this.highDraw}>draw</button>
                <a type="primary" onClick={() => {this.props.submit(this.state.text,this.state.title)}} style={this.submitStyles}>{this.props.scene ? this.props.scene : 'submit'}</a>
            </div>
        )
    }
} 