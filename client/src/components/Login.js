import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Input, Button, Alert } from 'antd';
import "../CSS/loginStyles.css"

function Login({handleLoginorSignUp, handleSetUser, showServerErrorAlert, handleShowServerErrorAlert}) {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const initialValue = {
    email: "",
    password: ""
  }
  const [loginForm, setLoginForm] = useState(initialValue)
  const [hasAccount, setHasAccount] = useState(true)

  function handleChange(e){
    const {name, value} = e.target
    setLoginForm({
      ...loginForm,
      [name]: value
    })
  }

  function handleLoginSubmit(e){

    fetch('/login', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(loginForm)
    })
    .then(res => {
      if (res.status === 200){
        return res.json()
      } else if (res.status === 404){
        setHasAccount(false)
        form.resetFields(['password'])
        setLoginForm({
          ...loginForm,
          password: ""
        })
        return Promise.reject("Account Not Found")
      } else if (res.status == 500){
        handleShowServerErrorAlert(true)
        return Promise.reject("Internal Server Error")
      }
    })
    .then(data => {
      handleSetUser(data)
      handleLoginorSignUp(true)
      navigate('/home')
    })
    .catch(err => console.error(err))
  }

  return (
    <div id="login">
      {showServerErrorAlert? <Alert message="INTERNAL SERVER ERROR: please try again later!" type="error" banner closable showIcon /> : null}

      {hasAccount? null : <Alert message="Sorry, we didn't recognize that email or password, please try again!" type="error" banner showIcon />}

      <Form 
        form={form}
        className="form"
        // labelCol={{
        //   span: 8,
        // }}
        // style={{
        //   maxWidth: 600,
        // }}
        layout="vertical"
        initialValues={{
          remember: true,
        }}
        onFinish={handleLoginSubmit}
        autoComplete="off"
        id="loginForm"
      >
        
        <Form.Item
          name="email"
          label="E-mail"
          className="form-item"
          value={loginForm.email}
          onChange={handleChange}
          rules={[
            {
              type: 'email',
              message: 'The input is not a valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input name="email" className="input"/>
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          className="form-item"
          value={loginForm.password}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password name="password" className="input"/>
        </Form.Item>
        
        <Form.Item
          // wrapperCol={{
          //   offset: 8,
          //   span: 16,
          // }}
        >
          <Button type="primary" htmlType="submit" className="button">
            Login
          </Button>
        </Form.Item>

      </Form>
      <div className="change-login-signup">
        <p>Don't have an account?</p>    
        <button onClick={() => navigate('/signup')} className="signup-button">Sign Up</button>
      </div>
    </div>
  )
}

export default Login