//用来请求数据
import { useEffect, useState } from 'react'
import axios from 'axios'
import checkstatus from '../../utils/request/checkstatus'

export default function usePullData(key) {
    const [dataList, setDataList] = useState([])
    const [loading, setLoading] = useState(undefined)
    
    useEffect(() => {
        axios.get(`/api/list/type?key=${key}`).then((resp) => {
            var result = checkstatus(resp.status)
            if (result) {
                setDataList(resp.data)
                return dataList
            } else return 'error'
        })
    })
}