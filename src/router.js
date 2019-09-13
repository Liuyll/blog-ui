import React from 'react'
import { Router, Route, Switch,Link } from 'dva/router'
import IndexPage from './routes/index/index.jsx'
import HeadIndex from './components/head/index'
import RenderError from './components/HandleError'
import AsyncComponent from './components/AsyncComponent'
// import Chat from './routes/chat'
// import Loadable from 'react-loadable'

const AsyncRegister = AsyncComponent(()=>import('./routes/login.jsx'))
const AsyncAdd = AsyncComponent(()=>import('./routes/add.jsx'))
const AsyncArticleList = AsyncComponent(() => import('./routes/article/index'))
const AsyncArticleContent = AsyncComponent(() => import('./routes/article/detail'))
// const AsyncArticleList1 = (() => import('./routes/article/index'))
function RouterConfig({ history }) {
    return (
        <Router history={history}>
            <RenderError>
        
                <Link to="/register">toregister</Link>
                <HeadIndex></HeadIndex>
                <IndexPage></IndexPage>
                {/* <Chat></Chat> */}
                {/* <AsyncArticleList></AsyncArticleList> */}
                <Switch>
                    <Route path="/register" component={AsyncRegister}></Route>
                    <Route path="/article/list" exact component={AsyncArticleList}></Route>
                    <Route path="/article/add" component={AsyncAdd}></Route>
                    <Route path="/article/:id" exact component={AsyncArticleContent}></Route>
                </Switch>

            </RenderError>
        </Router>
    )
}

export default RouterConfig
