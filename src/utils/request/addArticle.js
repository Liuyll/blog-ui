import axios from 'axios'
import checkStatus from './checkstatus'
import {message} from 'antd'

export default async function addArticle(accountId, payload) {
    var resp = await axios.post('/api/article', payload)
    var result = checkStatus(resp)
    if (result) {
        message.success('publish success')
        return 'success'
    } else{
        message.error('failed retry')
        return false
    }
}