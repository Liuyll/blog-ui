// import axios from 'axios'
import loginFunc from '../utils/request/login'
import axios from 'axios'

export default {
    namespace: 'globalState',

    state: {
        isLogin: false,
        account: null,
        accountId: null
    },

    subscriptions: {
        setup({ dispatch }) {
            var token = localStorage.getItem('token') // eslint-disable-line
            if (token) {
                axios.get('/api/init', {
                    headers: {
                        'Authorization': token
                    }
                }).then((resp) => {
                    var payload = resp.data
                    if (payload.state == 'login') {
                        dispatch({
                            type: 'changeLoginState',
                            payload: true
                        })
                        dispatch({
                            type: 'changeAccountId',
                            payload: payload.id
                        })
                    }
                    else {
                        // eslint-disable-next-line
                        localStorage.removeItem('token')
                    }
                })
            }
        }
    },

    effects: {
        * login({ payload }, { call, put }) {
            const loginResult = yield call(loginFunc, payload)
            
            if(typeof loginResult == 'string' && loginResult.indexOf('ErrorAndVerify') !== -1){
                let code = loginResult.split(' ')[1]
                payload.callback('errorAndVerify',{
                    code
                })
            } else if (typeof loginResult == 'string' && loginResult.indexOf('VerifyCodeError') !== -1){
                let code = loginResult.split(' ')[1]
                payload.callback('errorAndVerify',{
                    code,
                    isMessage: true
                })
            } else if (loginResult) {
                yield put({
                    type: 'changeLoginState',
                    payload: true
                })
                yield put({
                    type: 'changeAccount',
                    payload: payload.account
                })
                yield put({
                    type: 'changeAccountId',
                    payload: loginResult
                })
                payload.callback('success')
            } else {
                payload.callback('error')
            }
        }
    },

    reducers: {
        changeLoginState(state, action) {
            return Object.assign({},state, { isLogin: action.payload })
        },
        changeAccount(state, { payload }) {
            return { ...state, ... { account: payload } }
        },
        changeAccountId(state, { payload }) {
            return { ...state, ... { accountId: payload } }
        }
    }
}