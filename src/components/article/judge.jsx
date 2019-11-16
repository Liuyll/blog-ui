import React,{ useState } from 'react'
import { Input ,Button } from 'antd'
import styled from 'styled-components'
import axios from 'axios'

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
    placeholder: '友善评论是交流的起点...',
}


export default function JudgeQuill(props){
    const [judgeContent,setJudgeContent] = useState(null)

    let handleChange = (value) => {
        value = value.target.value
        setJudgeContent(value)
    }

    let submitJudge = () => {
        let parentCB
        if(props.submitJudgeSuccessCb){
            parentCB = props.submitJudgeSuccessCb
        }
        axios.post('/api/article/judge',{
            article: props.article,
            content: judgeContent,
            author: props.author,
            other: props.other         
        }).then((resp) => {
            if(resp.data && resp.data.type == 'success'){
                if(parentCB) parentCB()
            }
        })
    }

    // eslint-disable-next-line
    let handleSubmitChange = () => { 
        const infos = {
            author: props.author,
            other: props.other,
            content: judgeContent,
            article: props.article
        }
        const submitJudge = props.submitJudge
        return submitJudge(infos)
    }
    
    return (
        <Wrap>
            <h3>Judge</h3>
            <QuillWrap>
                <TextArea {...quillConfig} onChange={handleChange} style={{ height: '140px',width: '800px' }}></TextArea>
                <SubmitButton type="primary" onClick={submitJudge}>评论</SubmitButton>
            </QuillWrap>
        </Wrap>
    )
}