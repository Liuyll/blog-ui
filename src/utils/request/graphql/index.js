import React from 'react'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { Message } from 'antd'

const link = new HttpLink({
    uri: '/api/graphql'
})

const cache = new InMemoryCache()
const client = new ApolloClient({
    cache,
    link
})


async function query(_gql) {
    return client.query({
        query: _gql
    }).catch(err => {
        Message.error(`test graphql error:${err}`)
    })
}

const GraphqlContext = React.createContext()
const Provider = (props) => (
    <GraphqlContext.Provider value={{ query }}>{props.children}</GraphqlContext.Provider>
)

const Consumer = (props) => (
    <GraphqlContext.Consumer>{props.children}</GraphqlContext.Consumer>
) 

const InjectClassComponent = function(WrapComponent){
    return class ApolloConsumer extends React.Component {
        constructor(props){super(props)}
        render(){
            return <WrapComponent {...this.props} query={query} client={client}></WrapComponent>
        }
    }
}

export {
    Provider,
    Consumer,
    InjectClassComponent as Apollo
}
