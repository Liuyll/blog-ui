import React from 'react'
import { Input, Button, Form ,message} from 'antd'
import {connect} from 'dva'
// import {useState,useEffect} from 'react'

function Login(props) {
    const {dispatch} = props
    const { getFieldDecorator, getFieldsValue } = props.form
    // console.log(props.routerHelp)

    async function submit() {
        function loginCallback(type){
            var execute = {
                'error':()=>message.error('login fail retry!'),
                'success':()=> {
                    message.success('login success')
                    dispatch({
                        type:'routerHelp/redirectLastURL'
                    })
                    
                }
            }
            execute[type]()
        }
        var FormValue = getFieldsValue()
        
        dispatch({
            type:'globalState/login',
            payload:{
                account:FormValue.account,
                password:FormValue.password,
                callback:loginCallback
            }
        })
        
    }

    var wrapStyles = {
        width:'400px',
        padding:'30px'
    }

    return (
        <div style={wrapStyles}>
            <Form>
                <Form.Item> {getFieldDecorator('account')(<Input placeholder="Input your account" allowClear></Input>)}</Form.Item>
                <Form.Item > {getFieldDecorator('password')(<Input.Password allowClear ></Input.Password>)} </Form.Item>
                <Form.Item ><Button type="primary" htmlType="submit" onClick={submit} > Sign Up </Button> </Form.Item>
            </Form>
        </div>
    )
}

const WrapLogin =  Form.create()(Login)
export default connect(({globalState,routerHelp})=>({globalState,routerHelp}))(WrapLogin)