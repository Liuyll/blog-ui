import React,{useState, useEffect, useRef} from 'react'
import _ from 'lodash'
import {Select} from 'antd'
import usePullData from './usePullData'

export default function Select(){
    const [cached, setCached] = useState(new Map())
    const [dataList,setDataList] = useState(null)
    const currentSearchKey = useRef(null)

    function _key(value){
        axios.get(`/api/list/type?key=${key}`).then((resp) => {
            if(currentSearchKey.current !== value){
                return ;
            }
            var result = checkstatus(resp.status)
            if (result) {
                setDataList(resp.data)
            } 
            else setDataList([])
        })
    }

    var exec = _.debounce(_key,300)

    function findData(value){
        var cache 
        if((cache = cached.get(cached))) return cache

        else {
            currentSearchKey.current = value
            exec()   
        }
    }
    return (
        <Select
            mode="multiple"
            placeholder="choose types"
            onSearch={findData}
        ></Select>
    )
}