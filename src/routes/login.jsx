import React,{ useState } from 'react'
import { Input, Button, Form ,message } from 'antd'
import { connect } from 'dva'
import VerifyCode from '../components/utils/VerifyCode'
import { parseMsg } from '../utils/ioHelper'

function Login(props) {
    const { dispatch } = props
    const { getFieldDecorator, getFieldsValue,validateFields } = props.form
    
    const [isVerify,setIsVerify] = useState(false)
    const [verifyCode,setVerifyCode] = useState(null)
    const [inputVerifyCode,setInputVerifyCode] = useState(null)
    async function submit() {
        function loginCallback(type,params){
            var execute = {
                'error': () => message.error('login fail retry!'),
                'success': () => {
                    message.success('login success')
                    dispatch({
                        type: 'routerHelp/redirectLastURL'
                    })     
                },
                'errorAndVerify': () => {
                    setVerifyCode(params && params['code'])
                    setIsVerify(true)
                    if(params.isMessage){
                        message.warning('验证码错误')
                    }
                }
            }
            execute[type]()
        }
        var FormValue = getFieldsValue()
        
        dispatch({
            type: 'globalState/login',
            payload: {
                account: FormValue.account,
                password: FormValue.password,
                callback: loginCallback,
                ... isVerify && { code: inputVerifyCode }
            }
        })
        
    }

    function validateCode(rule,val,cb){
        setInputVerifyCode(val)
        if(val == "") return ""
        if(val !== verifyCode){
            cb("验证码不正确哦")
        }
    }
    var wrapStyles = {
        padding: '30px',
        textAlign: 'center'
    }

    const VerifyComponent = (
        <Form.Item>
            {getFieldDecorator('verifyCode',{
                rules: [
                    {
                        required: true,
                        message: "请输入验证码"
                    },{
                        validator: validateCode
                    }
                ]
            })(<Input placeholder="Input Code"></Input>)}
        </Form.Item>
    )

    // validateFields(['verifyCode'],(errors,values) => {
    //     console.log(errors,values)
    // })

    return (
        <div style={wrapStyles}>
            <div style={{ width: '400px' ,margin: '0 auto' }}>
                <Form>
                    <Form.Item> {getFieldDecorator('account')(<Input placeholder="Input your account" allowClear></Input>)}</Form.Item>
                    <Form.Item > {getFieldDecorator('password')(<Input.Password placeholder="password" allowClear ></Input.Password>)} </Form.Item>
                    {isVerify ? <VerifyCode text={verifyCode} x="0" y="0" /> : null }
                    {isVerify ? VerifyComponent : null}
                    <Form.Item ><Button type="primary" htmlType="submit" onClick={submit} > Sign Up </Button> </Form.Item>
                </Form>
            </div>
        </div>
    )
}

const WrapLogin =  Form.create()(Login)
export default connect(({ globalState,routerHelp }) => ({ globalState,routerHelp }))(WrapLogin)