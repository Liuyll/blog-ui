import React, { useEffect,useState } from 'react'
import axios from 'axios'
import connect from 'dva'

var cancelToken = axios.CancelToken
var cancel

function useData(url,method,payload,config={}){
    const [loading,setLoading] = useState(false)
    const [data,setData] = useState(null)
    const [error,setError] = useState(false)

    let paramsKey =  (method == 'GET' ? 'params' : 'body')

    axios(url,{
        method: method,
        [paramsKey]: payload,
        ...config,
        cancelToken: function cancel_(c){
            cancel = c
        }
    }).then((resp)={
        
    })
}

export default connect(({ apiHelp }) => ({ apiHelp }))(useData)