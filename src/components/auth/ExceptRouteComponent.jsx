import React from 'react'
import { withRouter } from 'dva/router'

function ExceptRouteComponent(props){
    const exceptRoute = props.except
    console.log(props)
    let path = props.location.pathname

    let isShouldShow = true
    if(exceptRoute && exceptRoute.indexOf(path) != -1){
        isShouldShow = false
    }

    const RealComponent = () => {
        if(isShouldShow) return props.children
        else return null
    }
    return (
        <RealComponent/>
    )
}

export default withRouter(ExceptRouteComponent)