import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Input, Button, Select, Alert } from 'antd';

function SignupCoach({handleSetUser, handleLoginorSignUp, clubs, showServerErrorAlert, handleShowServerErrorAlert}) {
  const { Option } = Select
  const initialValue = {
    club_id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  }

  const navigate = useNavigate()
  const [signupForm, setSignupForm] = useState(initialValue)


  function handleChange(e){
    const {name, value} = e.target

    setSignupForm({
      ...signupForm,
      [name]: value
    })
  }

  function handleSelectChange(value, e){
    setSignupForm({
      ...signupForm,
      club_id: value
    })
  }

  function handleSubmit(e){

    const name = signupForm.first_name + " " + signupForm.last_name
    const newCoach = {
      club_id: signupForm.club_id,
      coach_name: name,
      email: signupForm.email,
      password: signupForm.password
    }

    fetch('/coaches', {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(newCoach)
    })
    .then(res => {
      if (res.status === 201){
        return res.json()
      } else if (res.status === 400){
        return Promise.reject("Validations Error")
      } else if (res.status === 500){
        handleShowServerErrorAlert(true)
        return Promise.reject("Internal Server Error")
      }
    })
    .then(data => {
      handleSetUser(data)
      handleLoginorSignUp(true)
      navigate('/home')
    })
    .catch(err => console.error("Error: ", err))
  }
  
  return (
    <>
      {showServerErrorAlert? <Alert message="INTERNAL SERVER ERROR: please try again later!" type="error" banner closable showIcon /> : null}

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
      >
        <Form.Item
          name="first_name"
          label="First Name"
          value={signupForm.first_name}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: "Please input your first name!"
            },
          ]}
        >
          <Input name="first_name"/>
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Last Name"
          value={signupForm.last_name}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: "Please input your last name!"
            },
          ]}
        >
          <Input name="last_name"/>
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          value={signupForm.email}
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
          <Input name="email"/>
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          value={signupForm.password}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            }, 
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message: 'Password must contain at least one uppercase letter, one lowercase letter, a number, and be at least 8 characters long.',
            },
          ]}
          hasFeedback
        >
          <Input.Password name="password"/>
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The new password that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="club_id"
          label="Select Your Club:"
          value={signupForm.club_id}
          rules={[
            {
              required: true,
              message: "Club required!"
            },
          ]}
        >
          <Select
            onChange={handleSelectChange}
            allowClear
          >
            {clubs.map(club => <Option key={club.id} value={club.id}>{club.club_name}</Option>)}
          </Select>
        </Form.Item>
        
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>

      </Form>

      <button onClick={() => navigate('/')}>Login</button>
    </>
  )
}

export default SignupCoach;