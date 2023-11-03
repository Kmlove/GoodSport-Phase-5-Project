import "../CSS/accountStyles.css"
import { Form, Input, Button } from 'antd';
import { useState } from "react";

function CoachAccount({user, handleUpdateUser, handleServerError, handlePasswordError, handleSucessfulUpdate, container}) {
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
    const new_coach = {
      ...accountFormData,
      coach_name: name
    }

    if (accountFormData.password){
      new_coach.password_hash = accountFormData.password
      delete new_coach.password
    }
    delete new_coach.first_name
    delete new_coach.last_name

    fetch(`/coaches/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(new_coach)
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
        container.scrollTop = 0
        return Promise.reject("Password Not Authenticated")
      } else if (res.status === 400){
        container.scrollTop = 0
        return Promise.reject("Validations Error")
      } else if (res.status === 500){
        container.scrollTop = 0
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
      container.scrollTop = 0
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
      // wrapperCol={{
      //   span: 10,
      // }}
      layout="vertical"
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={handleSubmit}
      autoComplete="off"
      className="account-form"
      id="coach-account-form"
    >
      <div id="profile-information" className="account-form-section">
        <h3>Profile Information</h3>
        <div>
          <img />
          <Form.Item
            name="first_name"
            label="First Name"
            className="form-item"
            initialValue={accountFormData.first_name}
            value={accountFormData.first_name}
            onChange={handleChange}
          >
            <Input name="first_name" className="input"/>
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            className="form-item"
            initialValue={accountFormData.last_name}
            value={accountFormData.last_name}
            onChange={handleChange}
          >
            <Input name="last_name" className="input"/>
          </Form.Item>

        </div>
      </div>

      <div id="login-information" className="account-form-section">
        <h3>Log In Information</h3>
        <div>
        <Form.Item
          name="email"
          label="E-mail"
          className="form-item"
          initialValue={accountFormData.email}
          onChange={handleChange}
          rules={[
            {
              type: 'email',
              message: 'The input is not a valid E-mail!',
            }
          ]}
        >
          <Input name="email" className="input"/>
        </Form.Item>

        <Form.Item
          name="currPassword"
          label="Current Password"
          className="form-item"
          value={accountFormData.currPassword}
          onChange={handleChange}
        >
          <Input.Password name="currPassword" className="input"/>
        </Form.Item>

        <Form.Item
          name="password"
          label="New Password"
          className="form-item"
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
          {accountFormData.currPassword? <Input.Password name="password" className="input"/> : <Input.Password disabled name="password" className="input"/>}
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          className="form-item"
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
          {accountFormData.currPassword? <Input.Password className="input"/>: <Input.Password disabled className="input"/>}
        </Form.Item>
        </div>
      </div>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" className="button" style={{width: "150px"}}>
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CoachAccount;