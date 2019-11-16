import React,{ useState,useMemo } from 'react'
import { Table } from 'antd'
import { useResource,useSnapshot } from 'react-suspense-boundary'
import axios from 'axios'
import moment from 'moment'

const fetch = (page) => axios.get(`/api/article/infos/${page}`).then((resp) => {
    return resp.data
})

export default function ArticleList(props){
    const [pageIndex,setPageIndex] = useState(1)
    const [pageSize,setPageSize] = useState(10)
    let [{ articles ,total }] = props.loading ? [{}] : useResource(fetch,pageIndex)

    const pagination = useMemo(() => ({
        pageSize,
        total,
        current: pageIndex,
        onChange(page){
            setPageIndex(page)
        }
    }),[pageSize,pageIndex])

    const columnsData = [['title'],['author','author.account'],['date','updatedAt'],['like'],['browseCount'],['collect'],['type']]
    const columns = columnsData.map(((v,i) => ({
        title: v[0],
        dataIndex: v[1] ? v[1] : v[0],
        render: (text) => {
            if(i == 6) {
                return text ? text.group : null
            }

            if(i == 2){
                if(!text) return '未知日期'
                return moment(text).format('YY年MM月DD日')
            }
            return text
        },
    })))
    
    return (
        <Table
            rowKey="_id"
            dataSource={articles}
            columns={columns}
            pagination={pagination}
            loading={props.loading ? props.loading : false}
        >
        </Table>
    )
}