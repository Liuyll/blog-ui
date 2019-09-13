import {message} from 'antd'

function redirectLogin(history){
    message.info('先去登录吧')
    setTimeout(()=>{
        history.push('/register')
    },500)
}

export default redirectLogin
