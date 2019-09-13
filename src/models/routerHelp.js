import { routerRedux } from 'dva/router'

export default {
    namespace: 'routerHelp',

    state: {
        currentURL: null,
        lastURL: null,
        shouldRedirect: false,
    },

    subscriptions: {
        changeURLState({ history, dispatch }) {
            history.listen((location) => {
                // console.log(location.pathname)
                dispatch({
                    type:'comparisonBeforeAndAfterPath',
                    payload:{
                        currentURL:location
                    }
                }).then((data) => {
                    if(!data){
                        dispatch({
                            type: 'autoChangeLastURL'
                        })
                        dispatch({
                            type: 'changeURL',
                            payload: {
                                currentURL: location.pathname
                            }
                        })
                    }
                })
               
            })

        },
        loginRedirect({ dispatch, history }) {
            history.listen(({ pathname }) => {
                if (pathname) {
                    var redirectRe = /(registre|login)/
                    if (redirectRe.test(pathname)) {
                        dispatch({
                            type: 'changeRedirectState',
                            payload: true
                        })
                    }
                }
            })
        }
    },

    reducers: {
        autoChangeLastURL(state) {
            return {...state, ... { lastURL: state.currentURL } }
        },
        changeURL(state, { payload }) {
            return {...state, ...payload }
        },
        changeRedirectState(state, { payload }) {
            return {...state, ... { shouldRedirect: payload } }
        }
    },

    effects: {
        * comparisonBeforeAndAfterPath( { payload:{currentURL=''} },{select}){
            const oldURL = yield select((state) => state.routerHelp.lastURL)
            return oldURL == currentURL
        },
        // eslint-disable-next-line
        * redirectLastURL({ payload }, { put, select }) {
            var lastURL = yield select((state) => state.routerHelp.lastURL)
            if (!lastURL) lastURL = "/"
            yield put(routerRedux.push({
                pathname: lastURL
            }))
        }
    }
}