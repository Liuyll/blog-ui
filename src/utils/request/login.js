import axios from 'axios'
// import checkStatus from './checkstatus'

export default async function Login({
    account,
    password
}) {
    try {
        var resp = await axios.post('api/login', { account, password })
        // var result = checkStatus(resp)

        // if (result) {
        //     var auth = resp.headers['authorization']
        
        //     if (auth) {
                
        //         console.log('auth get')
        //         localStorage.setItem('token', auth)// eslint-disable-line
        //         return true
        //     } else {
        //         var data = resp.data
        //         if (data.type === 'success') {
        //             return true
        //         } else {
        //             return false
        //         }
        //     }
        // }
        var data = resp.data
        console.log(data)
        if (data.type === 'success') {
            return data.accountId
        } else {
            return false
        }
    } catch (e) {
        console.log(e)
        return false
    }


}