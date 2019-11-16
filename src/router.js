import React from 'react'
import { Router, Route, Switch,Link,Redirect } from 'dva/router'
import IndexPage from './routes/index/index.jsx'
import HeadIndex from './components/head/index'
import RenderError from './components/HandleError'
import AsyncComponent from './components/AsyncComponent'
import { Provider as ApolloProvider } from './utils/request/graphql'
import ExceptRouteComponent from './components/auth/ExceptRouteComponent'
// import Chat from './routes/chat'
// import Loadable from 'react-loadable'

const AsyncRegister = AsyncComponent(() => import('./routes/login.jsx'))
const AsyncAdd = AsyncComponent(() => import('./routes/add.jsx'))
const AsyncArticleList = AsyncComponent(() => import('./routes/article/index'))
const AsyncArticleContent = AsyncComponent(() => import('./routes/article/detail'))
const AsyncInfos = AsyncComponent(() => import('./routes/infos'))

// const AsyncArticleList1 = (() => import('./routes/article/index'))
function RouterConfig({ history }) {
    return (
        <Router history={history}>
           
            <RenderError>
                <ApolloProvider>
                    <HeadIndex></HeadIndex>
                    <ExceptRouteComponent
                        except={['/infos']}
                    >
                        <IndexPage></IndexPage>
                    </ExceptRouteComponent>
                    {/* <Chat></Chat> */}
                    <Switch>
                        <Route path="/register" component={AsyncRegister}></Route>
                        <Route path="/article/list" exact component={AsyncArticleList}></Route>
                        <Route path="/article/add" component={AsyncAdd}></Route>
                        <Route path="/article/:id" exact component={AsyncArticleContent}></Route>
                        <Route path="/infos" exact component={AsyncInfos}></Route>
                        <Redirect path="/" to={{ pathname: '/article/list' }} exact></Redirect>
                    </Switch>
                </ApolloProvider>
            </RenderError>
            
        </Router>
        
    )
}

export default RouterConfig
