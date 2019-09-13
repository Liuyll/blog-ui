import React from 'react'

export default class WrapQuills extends React.Component {
    constructor(props) {
        super(props)
    }

    
    quillConfig = {
        toolbar: [['bold','underline'],['link','image']],
        theme:'snow'
    }
    render() {
        return (
            <>
                {this.props.children()}
            </>
        )
    }
}