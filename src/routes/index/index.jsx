import React from 'react'
import { Menu, Button, TreeSelect, Modal, Input } from 'antd'
import EditIndex from '../../components/article/index'
import styled from 'styled-components'
import { Route, Switch, withRouter } from 'dva/router'
// import AsyncComponent from '../../components/AsyncComponent.jsx'
import axios from 'axios'
import immutable from 'immutable'
import cssStyle from './index.css'
import { connect } from 'dva'


const qs = require('querystring')
const TreeNode = TreeSelect.TreeNode
const { SubMenu } = Menu
const _ = require('lodash')

const WrapMenu = styled.div`
  position: absolute;
  left: 0;
  top: 20px;
  width: 400px;
  height:${props => props.height ? props.height + 'px' : '100%'}
`

@withRouter
@connect((state) => ({ state }))
class Index extends React.Component {
    constructor(props) {
        super(props)
        axios.get('/api/list').then(resp => {
            if(resp.data) this.setState({
                menus: resp.data,
            })

            else console.log(resp)

            props.dispatch({
                type: 'data/changeMenus',
                payload: resp.data
            })
        })

        var modal = immutable.fromJS({
            visible: false,
        })

        var select = immutable.fromJS({
            value: null,
            groupValue: null,
        })
        this.state = {
            modal,
            select,
            menus: null,
        }
    }
    getTypesList() {}

    parseChildrenList(v) {
        if (_.isNil(v)) return
        var elements = _.map(v, (son, infos) => {
            infos = JSON.parse(infos)
            if (_.isEmpty(son)) {
                return <Menu.Item key={infos.id}>{infos.name}</Menu.Item>
            } else {
                return (
                    <SubMenu data-key={infos.id} key={infos.id} onTitleClick={this.handleSelect} title={<span>{infos.name}</span>}>
                        {this.parseChildrenList(son)}
                    </SubMenu>
                )
            }
        })
        return elements
    }

    parseChildrenListTreeSelect(v) {
        if (_.isNil(v)) {
            return
        }
        var elements = _.map(v, (son, infos) => {
            infos = JSON.parse(infos)
            if (_.isEmpty(son)) {
                return <TreeNode key={infos.id} title={infos.name} value={infos.id} />
            } else {
                return (
                    <TreeNode key={infos.id} value={infos.id} title={infos.name}>
                        {this.parseChildrenListTreeSelect(son)}
                    </TreeNode>
                )
            }
        })

        return elements
    }

  handleButtonClick = () => {
      this.setState({
          modal: this.state.modal.set('visible', true),
      })
  }
  handleModalCancel = () => {
      this.setState({
          modal: this.state.modal.set('visible', false),
      })
  }

  handleModalOk = () => {
      axios
          .post('/api/list', {
              pid: this.state.select.get('value'),
              group: this.state.select.get('groupValue'),
          })
          .then(resp => {
              if (resp.data) {
                  this.setState({
                      menus: resp.data,
                  })
              }
              this.setState({
                  modal: this.state.modal.set('visible',false)
              })
          })
  }

  handleModalInputChange = ({ target: { value } }) => {
      console.log(value)
      this.setState({
          select: this.state.select.set('groupValue', value),
      })
  }

  handleSelect = ({ key }) => {
      try{
          this.props.history.push({
              pathname: `/article/list`,
              search: qs.encode({
                  id: key
              })
          })
      }catch(e){
          console.log(e)
      }
  }

  render() {
      const MenuConfig = {
          onClick: this.handleSelect
      }

      const TreeSelectConfig = {
          style: { width: '300px' },
          placeholder: 'please choose types',
          value: this.state.select.get('value'),
          onChange: value => {
              this.setState({
                  select: this.state.select.set('value', value),
              })
          },
      }

      const ModalConfig = {
          visible: this.state.modal.get('visible'),
          onCancel: this.handleModalCancel,
          onOk: this.handleModalOk,
      }

      const SubMenus = _.map(this.state.menus, (v, k) => {
          if (_.isNil(v)) return
          const infos = JSON.parse(k)
          return (
              <SubMenu key={infos.id} data-key={infos.id} onTitleClick={this.handleSelect} title={<span onClick={this.handleSelect}>{infos.name}</span>}>
                  {this.parseChildrenList(v)}
              </SubMenu>
          )
      })

      // eslint-disable-next-line
      const ScreenHeight = window.innerHeight

      return (
      <>
        <WrapMenu height={ScreenHeight}>
            <Menu style={{ width: 300 }} mode="vertical" {...MenuConfig}>
                {SubMenus}
            </Menu>
            <div>
                <Button type="link" onClick={this.handleButtonClick}>
              添加
                </Button>
            </div>
        </WrapMenu>

        <Modal {...ModalConfig}>
            <div className={cssStyle.inputWrap}>
                <Input
                    width="300"
                    placeholder="please input group name"
                    value={this.state.select.get('groupValue')}
                    onChange={this.handleModalInputChange}
                />
            </div>
            <TreeSelect {...TreeSelectConfig}>
                <TreeNode key="null" value="null" title="顶层" />
                {this.parseChildrenListTreeSelect(this.state.menus)}
            </TreeSelect>
        </Modal>
      </>
      )
  }
}

export default Index