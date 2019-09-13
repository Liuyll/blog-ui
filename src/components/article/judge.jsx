import React from 'react'
import { Input ,Button } from 'antd'
import styled from 'styled-components'

const { TextArea } = Input

const Wrap = styled.div`
    margin-top:40px;
`
const QuillWrap = styled.div`
    position:relative;
    overflow:hidden;
    height:250px;
    padding:20px;
    background-color:#FAFAFA;
    width:850px;
`

const SubmitButton = styled(Button)`
    display:block;
    position:relative;
    left:730px;
    top:20px;
`
const quillConfig = {
    placeholder:'友善评论是交流的起点...',
}

export default function JudgeQuill(props){

    return (
        <Wrap>
            <h3>Judge</h3>
            <QuillWrap>
                <TextArea {...quillConfig} onChange={props.handleChange} style={{height:'120px',width:'800px'}}></TextArea>
                <SubmitButton type="primary">评论</SubmitButton>
            </QuillWrap>
        </Wrap>
    )
}