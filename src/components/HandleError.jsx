import React from 'react'
import { message } from 'antd'
import {Redirect, withRouter} from 'dva/router' // eslint-disable-line

@withRouter
export default class ErrorBoundary extends React.Component {
  state = {
      error: false,
  }

  componentDidCatch(error, info) {
      console.error(info)
      this.setState({
          error: true,
      })
  }

  render() {
      const ctx = this
      // eslint-disable-next-line
      const Render = function() {
          if (ctx.state.error) {
              message.error('error redirecting ...')
              // this.props.history.push('/')
              // ctx.props.history.push('/')
              // return <Redirect to={'/'}></Redirect>
              return <div style={{fontSize:'400px'}}>出错啦</div>
          } else return ctx.props.children
      }

      return <Render/>
  }
}
