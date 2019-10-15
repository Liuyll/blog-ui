import React from 'react'
import { ApolloClient,ApolloProvider } from 'react-apollo'

const client = new ApolloClient({
    uri: 'http://localhost:3000/api/graphql'
})

const Provider = <ApolloProvider client={client}></ApolloProvider>
export default Provider