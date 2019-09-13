import React from 'react';
import {Card} from 'antd';
const styled = require('styled-components')

const cartFooter = styled.div`
    display:flex;
    justify-content:space-between;
`

export default function Index(props){
    // const {showContents} = props;
    const showContents = [
        {
            title:"JavaScript的正则表达式",
            sub:"你知道js的正则表达式如何进行匹配的吗？关于exec和match的区别你又知道多少呢？",
            info:[1268,'12-28',Liuyl] //热度，发表时间，最后一次编辑
        }
    ]

    const cards = showContents.map((v,i)=>{
        return (
        <Card title={v.title}>
            <p>{v.sub}</p>
            <cartFooter>
                <strong>热度:{v.info[0]}</strong>
                <span>发表时间:{v.info[1]}</span>
                <span>最后编辑者:{v.info[2]}</span>
            </cartFooter>
        </Card>
        )
    })
    return (
        <Card>
            
        </Card>
    )
}