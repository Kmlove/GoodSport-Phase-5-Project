import { useNavigate } from "react-router-dom";
import "../CSS/accountStyles.css"
import { Form, Input, Button, Select, Alert } from 'antd';
import { useState } from "react";

function Account({handleLoginorSignUp, user}) {
  const {coach_name, email} = user
  const spaceIndex = indexOfSpace(coach_name)
  const firstName = coach_name.slice(0, spaceIndex)
  const lastName = coach_name.slice(spaceIndex + 1)
  const initialValue = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    currPassword: "",
    password: ""
  }
  const [accountFormData , setAccountFormData] = useState(initialValue)
  const navigate = useNavigate()

  function handleClick(e){
    fetch('/logout', {
      method: "DELETE",
    })
    .then(() => {
      handleLoginorSignUp(false)
      navigate('/')
    })
  }

  function indexOfSpace(name){
    for(const el of name){
      if (el === " "){
        return name.indexOf(el)
      }
    }
  }

  function handleChange(e){
    const {name, value} = e.target
    setAccountFormData({
      ...accountFormData,
      [name]: value
    })
  }
  console.log(accountFormData)

  function handleSubmit(e){}

  return (
    <div className="right" >
      <h2>Account Information</h2>
      <button onClick={handleClick}>Log Out</button>

      <Form 
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 10,
        }}
        layout="vertical"
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
        autoComplete="off"
        id="account-form"
      >
        <div id="profile-information">
          <h3>Profile Information</h3>
          <div>
            <img />
            <Form.Item
              name="first_name"
              label="First Name"
              initialValue={accountFormData.first_name}
              onChange={handleChange}
           >
              <Input name="first_name"/>
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Last Name"
              initialValue={accountFormData.last_name}
              onChange={handleChange}
           >
              <Input name="last_name"/>
            </Form.Item>

          </div>
        </div>

        <div id="login-information">
          <h3>Log In Information</h3>
          <div>
          <Form.Item
            name="email"
            label="E-mail"
            initialValue={accountFormData.email}
            onChange={handleChange}
            rules={[
              {
                type: 'email',
                message: 'The input is not a valid E-mail!',
              }
            ]}
          >
            <Input name="email"/>
          </Form.Item>

          <Form.Item
            name="currPassword"
            label="Current Password"
            value={accountFormData.currPassword}
            onChange={handleChange}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your password!',
            //   }
            // ]}
            hasFeedback
          >
            <Input.Password name="currPassword"/>
          </Form.Item>

          <Form.Item
            name="password"
            label="New Password"
            value={accountFormData.password}
            onChange={handleChange}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input your password!',
            //   }, 
            //   {
            //     pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            //     message: 'Password must contain at least one uppercase letter, one lowercase letter, a number, and be at least 8 characters long.',
            //   },
            // ]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!accountFormData.currPassword) {
                    // If the Current Password is not filled, no validation required for New Password
                    return Promise.resolve();
                  }
                  if (value) {
                    // Add your password validation rules here
                    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Password must contain at least one uppercase letter, one lowercase letter, a number, and be at least 8 characters long.'));
                  }
                  return Promise.reject(new Error('Please input your new password!'));
                },
              }),
            ]}
            hasFeedback
          >
            {accountFormData.currPassword? <Input.Password name="password"/> : <Input.Password disabled name="password"/>}
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please confirm your password!',
            //   },
            //   ({ getFieldValue }) => ({
            //     validator(_, value) {
            //       if (!value || getFieldValue('password') === value) {
            //         return Promise.resolve();
            //       }
            //       return Promise.reject(new Error('The new password that you entered do not match!'));
            //     },
            //   }),
            // ]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!accountFormData.currPassword) {
                    // If the Current Password is not filled, no validation required for Confirm Password
                    console.log("Inside first if")
                    return Promise.resolve();
                  }
                  if (value && getFieldValue('password') === value) {
                    console.log("Inside second if")
                    return Promise.resolve();
                  }
                  console.log("before last return")
                  return Promise.reject(new Error('The new password and confirm password do not match!'));
                },
              }),
            ]}
          >
            {accountFormData.currPassword? <Input.Password/>: <Input.Password disabled/>}
          </Form.Item>
          </div>
        </div>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>

    </div>
  )
}

export default Account;
