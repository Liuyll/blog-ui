// import axios from 'axios'
import login from '../utils/request/login'
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
                    // console.log(payload)
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
                })
            }
        }
    },

    effects: {
        * login({ payload }, { call, put }) {
            const loginresult = yield call(login, payload)
            if (loginresult) {
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
                    payload: loginresult
                })
                payload.callback('success')
            } else {
                payload.callback('error')
            }
        }
    },

    reducers: {
        changeLoginState(state, action) {
            return Object.assign(state, { isLogin: action.payload })
        },
        changeAccount(state, { payload }) {
            return { ...state, ... { account: payload } }
        },
        changeAccountId(state, { payload }) {
            return { ...state, ... { accountId: payload } }
        }
    }
}