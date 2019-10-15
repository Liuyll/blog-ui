import client from '../index'
import { gql } from 'apollo-boost'

export default (id,cb) => client.query({
    query: gql`
        {
            byArticleId(id:${id})
        }
    `
}).then(result => cb(result))