import React from 'react'
import { Cascader, Form, Input, Button, Select, DatePicker } from 'antd';

function SignupPlayer({clubs}) {
  const dateFormat = 'MM/DD/YYYY';
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

  const onChange = (value) => {
    console.log(value);
  };

  function handleSubmit(values) {
    console.log('Success:', values);
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
        name="email"
        label="E-mail"
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

      <Form.Item label="Team" >
        <Cascader options={clubsOptions} onChange={onChange} placeholder="Please select a team..." />
      </Form.Item>

      <Form.Item
        name="parent_name"
        label="Parent Name"
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
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Birthday">
        <DatePicker format={dateFormat} onChange={""}/>
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder="Select a option and change input text above"
          onChange={''}
          allowClear
        >
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
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