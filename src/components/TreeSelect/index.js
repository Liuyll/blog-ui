import React from 'react'
import _ from 'lodash'
import './index.css'
import {TreeSelect} from 'antd'

const TreeNode = TreeSelect.TreeNode

export default class $TreeSelect extends React.Component {
    state = {
        value: null
    }


    parseChildrenTreeSelect(v) {
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
                        {this.parseChildrenTreeSelect(son)}
                    </TreeNode>
                )
            }
        }
        )
        return elements
    }
    render() {

        const TreeSelectConfig = {
            style: { width: this.props.width },
            placeholder: 'please choose types',
            value: this.props.value,
            onChange: value => {
                this.props.valueChange(value)
            },
        }

        return (
            <TreeSelect {...TreeSelectConfig}>
                <TreeNode key="null" value="null" title="顶层" />
                {this.parseChildrenTreeSelect(this.props.menus)}
            </TreeSelect>
        )
    }
}