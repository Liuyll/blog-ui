import React from 'react'
import { Menu, Icon } from 'antd' // eslint-disable-line
import { connect } from 'dva'

const { SubMenu } = Menu
const _ = require('lodash')


export default @connect(({ routerHelp }) => ({ routerHelp })) class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = [
            { 'javascript': ['算法', '正则', { '函数式编程': ['y组合子','curry function'] }] },
            { '后端': [{ 'java': ['spring'] }, { 'node': ['c++', 'egg', 'koa'] }] },
            { '前端': ['html', 'css3'] },
            { '其他': ['babalala','gegebaba', { 'hello': ['world'] }] }
        ]
    }
    getTypesList() {

    }

    parseChildrenList(v) {
        var children = []
        _.map(v, (val) => {
            _.map(val, (v) => {
                if (Object.prototype.toString.call(v) === '[object Object]') { 
                    children.push([_.keys(v)[0], v])
                }
                else children.push(['general', v])
            })

        })
        children = _.map(children, (v, i) => {
            if (v[0] === 'general') return (<Menu.Item key={i} >{v[1]}</Menu.Item>)
            else return (
                <SubMenu
                    key={i}
                    title={<span>{v[0]}</span>}>
                    {this.parseChildrenList(v[1])}
                </SubMenu>)
        })
        return children
    }
    render() {
        const SubMenus = this.state.map((v, k) => { // eslint-disable-line
            return (
                <SubMenu key={_.keys(v)[0]} title={
                    <span>{_.keys(v)[0]}</span>
                }>
                    {/* {console.log(this.parseChildrenList(v))} */}
                    {this.parseChildrenList(v)}
                </SubMenu>)
        })

        return (
        <>
            <Menu style={{ width: 400 }} mode="vertical" onClick={() => {}}>
                {SubMenus}
            </Menu>
        </>
        )
    }
}