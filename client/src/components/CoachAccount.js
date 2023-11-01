import { useNavigate } from "react-router-dom";
import "../CSS/accountStyles.css"
import { Form, Input, Button } from 'antd';
import { useState } from "react";

function CoachAccount({user, handleUpdateUser, handleServerError, handlePasswordError, handleSucessfulUpdate}) {
  const {coach_name, email, id} = user
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
  const [form] = Form.useForm()

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

  function handleSubmit(e){

    for (const key in accountFormData){
      if (accountFormData[key] === ""){
        delete accountFormData[key]
      }
    }

    const name = accountFormData.first_name + " " + accountFormData.last_name
    accountFormData.coach_name = name
    if (accountFormData.password){
      accountFormData.password_hash = accountFormData.password
      delete accountFormData.password
    }
    delete accountFormData.first_name
    delete accountFormData.last_name

    fetch(`/coaches/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(accountFormData)
    })
    .then(res => {
      if (res.status === 202){
        return res.json()
      } else if (res.status === 401){
        handlePasswordError(true)
        setAccountFormData({
          ...accountFormData,
          password: "",
          currPassword: ""
        })
        form.resetFields(['currPassword'])
        form.resetFields(['password'])
        form.resetFields(['confirm'])
        return Promise.reject("Password Not Authenticated")
      } else if (res.status === 400){
        return Promise.reject("Validations Error")
      } else if (res.status === 500){
        handleServerError(true)
        return Promise.reject("Internal Server Error")
      }
    })
    .then(data => {
      const spaceIndex = indexOfSpace(data.coach_name)
      const firstName = data.coach_name.slice(0, spaceIndex)
      const lastName = data.coach_name.slice(spaceIndex + 1)
      handleUpdateUser(data)
      handleSucessfulUpdate(true)
      setAccountFormData({
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        password: "",
        currPassword: ""
      })
      form.resetFields(['currPassword'])
      form.resetFields(['password'])
      form.resetFields(['confirm'])
    })
    .catch(err => console.error("Error: ", err))
  }

  return (
    <Form 
      form={form}
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
      id="coach-account-form"
    >
      <div id="profile-information">
        <h3>Profile Information</h3>
        <div>
          <img />
          <Form.Item
            name="first_name"
            label="First Name"
            initialValue={accountFormData.first_name}
            value={accountFormData.first_name}
            onChange={handleChange}
          >
            <Input name="first_name"/>
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            initialValue={accountFormData.last_name}
            value={accountFormData.last_name}
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
        >
          <Input.Password name="currPassword"/>
        </Form.Item>

        <Form.Item
          name="password"
          label="New Password"
          value={accountFormData.password}
          onChange={handleChange}
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
        >
          {accountFormData.currPassword? <Input.Password name="password"/> : <Input.Password disabled name="password"/>}
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!accountFormData.currPassword) {
                  // If the Current Password is not filled, no validation required for Confirm Password
                  return Promise.resolve();
                }
                if (value && getFieldValue('password') === value) {
                  return Promise.resolve();
                }
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
  )
}

export default CoachAccount;