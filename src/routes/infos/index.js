import React from 'react'
import { Tabs } from 'antd'
import ArticleInfos from '../../components/manager/article'
import styled from 'styled-components'

const { TabPane } = Tabs

const Wrap = styled.div`
    margin:0 80px 0;
`

function Infos(props){
    return (
        <Wrap>
            <Tabs defaultActiveKey="article">
                <TabPane key="article" tab="article">
                    <ArticleInfos/>
                </TabPane>
                <TabPane key="users" tab="users"></TabPane>
            </Tabs>
        </Wrap>
    )
}

export default Infos