import { useNavigate } from "react-router-dom";
import "../CSS/accountStyles.css"
import { Form, Input, Button, Select, Alert, Steps } from 'antd';
import { useState, useEffect } from "react";

function Account({handleLoginorSignUp, user}) {
  const {coach_name, email, id} = user
  const spaceIndex = indexOfSpace(coach_name)
  const firstName = coach_name.slice(0, spaceIndex)
  const lastName = coach_name.slice(spaceIndex + 1)
  const confirmPasswordError = document.getElementById("confirm_help")
  const newPasswordError = document.getElementById("password_help")
  const [ successfulUpdate, setSuccessfulUpdate ] = useState(false)
  const [ passwordError, setPasswordError ] = useState(false)
  const [ serverError, setServerError ] = useState(false)

  const initialValue = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    currPassword: "",
    password: ""
  }
  const [accountFormData , setAccountFormData] = useState(initialValue)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  // const passwordErrors=form.getFieldError('password')

  useEffect(() => {
    if (successfulUpdate) {
      // Use a setTimeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        setSuccessfulUpdate(false);
      }, 3000); // 3000 milliseconds (3 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    } else if (passwordError) {
      // Use a setTimeout to hide the alert after 6 seconds
      const timer = setTimeout(() => {
        setPasswordError(false);
      }, 6000); // 6000 milliseconds (6 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    } else if (serverError) {
      // Use a setTimeout to hide the alert after 6 seconds
      const timer = setTimeout(() => {
        setServerError(false);
      }, 6000); // 6000 milliseconds (6 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [successfulUpdate, passwordError, serverError ]);


  function handleLogoutClick(e){
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

    console.log(accountFormData)

    fetch(`/coaches/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(accountFormData)
    })
    .then(res => {
      if (res.status === 202){
        return res.json()
      } else if (res.status === 401){
        setPasswordError(true)
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
        setServerError(true)
        return Promise.reject("Internal Server Error")
      }
    })
    .then(data => {
      const spaceIndex = indexOfSpace(data.coach_name)
      const firstName = data.coach_name.slice(0, spaceIndex)
      const lastName = data.coach_name.slice(spaceIndex + 1)
      setSuccessfulUpdate(true)
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
    <div className="right" >
      <h2>Account Information</h2>
      <button onClick={handleLogoutClick}>Log Out</button>

      {successfulUpdate? <Alert message="Account Successfully Updated!" type="success" banner closable showIcon /> : null}
      {passwordError? <Alert message="The current password you entered did not match what we have on file, please try again." type="error" banner closable showIcon /> : null}
      {serverError? <Alert message="There was an error updating your account, please try again later!" type="error" banner closable showIcon /> : null}

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

    </div>
  )
}

export default Account;
