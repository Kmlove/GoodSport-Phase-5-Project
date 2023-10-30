import React, { useState } from 'react'
import { Cascader, Form, Input, Button, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';


function SignupPlayer({clubs}) {
  const initialValue = {
    team_id: "",
    player_name: "",
    birthday: "",
    parent_name: "",
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

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

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
    const newPlayer = {
      ...newPlayerFormData,
      birthday: formattedDate
    }
    console.log(newPlayer)
    fetch('/players', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newPlayer)
    })
    .then(res => res.json())
    .then(data => console.log(data))
  };

  function handleFinishFailed (errorInfo) {
    console.log('Failed:', errorInfo);
  };

  return (
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
      validateMessages={validateMessages}
    >
      <Form.Item
        name="parent_email"
        label="E-mail"
        value={newPlayerFormData.parent_email}
        onChange={handleChange}
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
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
      >
        <Cascader 
          onChange={handleSelectChange} 
          options={clubsOptions} 
          placeholder="Please select a team..." 
        />
      </Form.Item>

      <Form.Item
        name="parent_name"
        label="Parent Name"
        value={newPlayerFormData.parent_name}
        onChange={handleChange}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="player_name"
        label="Player Name"
        value={newPlayerFormData.player_name}
        onChange={handleChange}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label="Birthday" 
        name="birthday"
        value={newPlayerFormData.birthday}
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
          placeholder="Select a option and change input text above"
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
          Submit
        </Button>
      </Form.Item>

    </Form>
  )
}

export default SignupPlayer