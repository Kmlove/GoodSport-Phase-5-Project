import React, { useState } from 'react'
import { Cascader, Form, Input, Button, Select, DatePicker, Alert } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

function SignupPlayer({clubs, handleLoginorSignUp, handleSetUser, showServerErrorAlert, handleShowServerErrorAlert}) {
  const initialValue = {
    team_id: "",
    player_name: "",
    birthday: "",
    parent_first_name: "",
    parent_last_name: "",
    player_first_name: "",
    player_last_name: "",
    parent_email: "",
    password: "",
    gender: ""
  }

  const [newPlayerFormData, setNewPlayerFormData] = useState(initialValue)
  const dateFormat = 'MM/DD/YYYY';
  const navigate = useNavigate()
  const { Option } = Select
  const clubsOptions = clubs.map(club => (
    {
      value: club.id,
      label: club.club_name,
      children: club.teams.map(team => (
        {
          value: team.id,
          label: team.team_name
        }
      ))
    }
  ))

  function handleChange(e) {
    const { id, value } = e.target
    setNewPlayerFormData({
      ...newPlayerFormData,
      [id]: value
    })
  };

  function handleSelectChange(value, e){
    if(typeof(value) === "string"){
      setNewPlayerFormData({
        ...newPlayerFormData,
        gender: value
      })
    } else if(typeof(value) === "object"){
      console.log(value, e)
      setNewPlayerFormData({
        ...newPlayerFormData,
        team_id: value[1]
      })
    }
  }
  function handleDateChange(date, dateString){
    setNewPlayerFormData({
      ...newPlayerFormData,
      birthday: dateString
    })
  }

  function handleSubmit(e) {
    const curdate = newPlayerFormData.date
    const formattedDate = dayjs(curdate).format('YYYY-MM-DD')
    const parentName = newPlayerFormData.parent_first_name + " " + newPlayerFormData.parent_last_name
    const playerName = newPlayerFormData.player_first_name + " " + newPlayerFormData.player_last_name

    const newPlayer = {
      ...newPlayerFormData,
      player_name: playerName,
      parent_name: parentName,
      birthday: formattedDate
    }
    delete newPlayer.parent_first_name
    delete newPlayer.parent_last_name
    delete newPlayer.player_first_name
    delete newPlayer.player_last_name

    fetch('/players', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newPlayer)
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
  };

  function handleFinishFailed (errorInfo) {
    console.log('Failed:', errorInfo);
  };

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
        onFinishFailed={handleFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="parent_email"
          label="E-mail"
          value={newPlayerFormData.parent_email}
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
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          value={newPlayerFormData.password}
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
          <Input.Password />
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
          label="Team" 
          name="team_id"
          value={newPlayerFormData.team_id}
          rules={[
            {
              required: true,
              message: "Please select a team!"
            },
          ]}
        >
          <Cascader 
            onChange={handleSelectChange} 
            options={clubsOptions} 
            placeholder="Please select a team..." 
          />
        </Form.Item>

        <Form.Item
          name="parent_first_name"
          label="Parent First Name"
          value={newPlayerFormData.parent_first_name}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: "Please input the parent first name!"
            },
          ]}
        >
          <Input name="parent_first_name"/>
        </Form.Item>

        <Form.Item
          name="parent_last_name"
          label="Parent Last Name"
          value={newPlayerFormData.parent_last_name}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: "Please input the parent last name!"
            },
          ]}
        >
          <Input name="parent_last_name"/>
        </Form.Item>

        <Form.Item
          name="player_first_name"
          label="Player First Name"
          value={newPlayerFormData.player_first_name}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: "Please input the player first name!"
            },
          ]}
        >
          <Input name="player_first_name"/>
        </Form.Item>

        <Form.Item
          name="player_last_name"
          label="Player Last Name"
          value={newPlayerFormData.player_last_name}
          onChange={handleChange}
          rules={[
            {
              required: true,
              message: "Please input the player last name!"
            },
          ]}
        >
          <Input name="player_last_name"/>
        </Form.Item>

        <Form.Item 
          label="Player Birthday" 
          name="birthday"
          value={newPlayerFormData.birthday}
          rules={[
            {
              required: true,
              message: "Please input the player birthday!"
            },
          ]}
        >
          <DatePicker format={dateFormat} onChange={handleDateChange}/>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          value={newPlayerFormData.gender}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Please select a player gender..."
            onChange={handleSelectChange}
            allowClear
          >
            <Option value="M">Male</Option>
            <Option value="F">Female</Option>
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

export default SignupPlayer