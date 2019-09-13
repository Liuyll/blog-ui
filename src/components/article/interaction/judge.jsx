import React from 'react'

import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.show.css'

export default class EditIndex extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            text:''
        }
    }

    handleChange = (text) => {
        // console.log(this.state.text)
        this.setState({
            text
        })
    }

    render(){
        return <ReactQuill onChange={this.handleChange} value={this.state.text}></ReactQuill>
    }
} 