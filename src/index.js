import './ReactotronConfig'
import dva from 'dva'
import axios from 'axios'
import { message } from 'antd'
import moment from 'moment'
import { browserHistory } from 'dva/router'
// 1. Initialize
// TODO:要引入histroy库来修复 browserHistory无效的bug
const app = dva({
    history: browserHistory
})

// 2. Plugins
// app.use({});

//global data
window.wrapWidth = "680px" // eslint-disable-line

// options npm init
moment.locale('zh-cn')

axios.interceptors.request.use(function(config) {
    var token
    // eslint-disable-next-line 
    if ((token = localStorage.getItem('token'))) {
        config.headers.Authorization = token 
    }
    
    config.validateStatus = function(status){
        return status >= 200 && status < 400
    }

    return config
})

axios.interceptors.response.use(function(response){
    return response
},function(error){
    
    var response = error.response
    if(response.status >= 400 && response.status < 500){
        if(response.status == 401 ){
            return message.error('您无权访问')
        }
        message.error(`cant access code:${response.status}`)
    }
    if(response.status >= 500) {
        if( response.status == 504) {
            message.error('504 gateway error')
        }
        
        if( response.status == 500){
            message.error('500 internel error')
        }
    }
    return Promise.reject(error)
})

axios.interceptors.response.use(function(response){
    if(response.headers.authorization) {
        console.log('update auth')
        localStorage.setItem('token',response.headers.authorization) // eslint-disable-line
    }
    return response
})

//TODO:load model
function loadModel() {
    var concatmodels = []
    const models = require.context('./models', false, /^.*.js$/)
    models.keys().forEach((key) => concatmodels = concatmodels.concat(models(key).default))
    return concatmodels
}

var models = loadModel()
models.forEach((v) => app.model(v))

// app.model(require('./models/state').default);
// app.model(require('./models/routerHelp').default);

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')

// const { dispatch } = app._store
//TODO:init
//后端判断身份用


