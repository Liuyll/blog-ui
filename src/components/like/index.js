import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import {Icon, Spin} from 'antd'

const LikeComponent = styled.div`
    display:flex;
    flex-direction:column;
`
var cancelToken = axios.CancelToken // eslint-disable-line
var cancel

export default function Like(props) {
    /* eslint-disable */
    const [upLoading, setUpLoading] = useState(false)
    const [downLoading,setDownLoading] = useState(false)
    /* eslint-disable */

    function submit(type,action) {
        if (cancel) {
            cancel()
        }

        var _type = type.charAt(0).toUpperCase() + type.slice(1)

        eval(`set${_type}Loading(true)`)
        axios.post('/api/article/like',{
            body:{
                type:type,
                action:action
            },
            cancelToken: function cancel_(c) {
                cancel = c
            }
        }
        ).then((resp) => {
            setLoading(false)
        })
    }
    return (
        <div>
            <LikeComponent>
                {upLoading ? <Icon type="up" onClick={submit}></Icon> : <Spin/>}
                {downLoading ? <Icon type="down" onClick={submit}></Icon> : <Spin/>}
            </LikeComponent>
        </div>
    )
} 