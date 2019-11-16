import axios from 'axios'
// import checkStatus from './checkstatus'

export default async function Login({
    account,
    password,
    code
}) {
    try {
        var resp = await axios({
            url: '/api/login',
            method: 'post',
            data: {
                account,
                password
            },
            headers: {
                ... code && { 'x-limit': code }
            }
        })
        var data = resp.data

        const verifyCode = resp.headers['x-limit']
    
        if(verifyCode){
            if(data && data.message == 'verifyCode error'){
                return `VerifyCodeError ${verifyCode}`
            }
            return `ErrorAndVerify ${verifyCode}`
        }
    
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