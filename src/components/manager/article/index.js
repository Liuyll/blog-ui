import React from 'react'
import { Boundary } from 'react-suspense-boundary'
import ArticleList from './ArticleList'
import { Message,Skeleton } from 'antd'

export default function ArticleInfos(props){
    const Loading = <Skeleton/>
    return (
        <Boundary
            pendingFallback={<ArticleList loading={Loading}/>}
            renderError={(err) => Message.error(err)}
        >
            <ArticleList/>
        </Boundary>
    )
}
