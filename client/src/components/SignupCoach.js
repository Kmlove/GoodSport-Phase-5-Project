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
    <div id="signup-coach">
      {showServerErrorAlert? <Alert message="INTERNAL SERVER ERROR: please try again later!" type="error" banner closable showIcon /> : null}
      <p>Create A Coach Account Below:</p>
      <Form 
        labelCol={{
          span: 8,
        }}
        // wrapperCol={{
        //   span: 10,
        // }}
        layout="vertical"
        // style={{
        //   maxWidth: 600,
        // }}
        className="form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="first_name"
          label="First Name"
          className="form-item"
          value={signupForm.first_name}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: "Please input your first name!"
            },
          ]}
        >
          <Input name="first_name" className="input"/>
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Last Name"
          className="form-item"
          value={signupForm.last_name}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: "Please input your last name!"
            },
          ]}
        >
          <Input name="last_name" className="input"/>
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          className="form-item"
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
          <Input name="email" className="input"/>
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          className="form-item"
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
          <Input.Password name="password" className="input"/>
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          className="form-item"
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
          <Input.Password className="input"/>
        </Form.Item>

        <Form.Item
          name="club_id"
          label="Select Your Club:"
          className="form-item"          
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
            style={{height: "46px"}}
          >
            {clubs.map(club => <Option key={club.id} value={club.id}>{club.club_name}</Option>)}
          </Select>
        </Form.Item>
        
        <Form.Item
          // wrapperCol={{
          //   offset: 8,
          //   span: 16,
          // }}
        >
          <Button type="primary" htmlType="submit" className="button">
            Sign Up
          </Button>
        </Form.Item>

      </Form>
      
      <div className="have-account">
        <p>Alredy Have An Account?</p>
        <button onClick={() => navigate('/')} className="login-button">Login</button>
      </div>
    </div>
  )
}

export default SignupCoach;