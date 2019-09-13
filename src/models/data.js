import immutable from 'immutable'

export default {
    namespace:'data',

    state:immutable.fromJS({
        //展示用数据 如列表等
        display:{
            menus:null
        }
    }),

    reducers:{
        changeMenus(state,{payload}){
            return state.setIn(['display','menus'],payload)
        }
    }
}