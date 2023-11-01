import "../CSS/accountStyles.css"
import { Form, Input, Button, DatePicker } from 'antd';
import { useState } from "react";
import dayjs from "dayjs";

function PlayerAccount({user, handleUpdateUser, handleServerError, handlePasswordError, handleSucessfulUpdate}) {
  const {id, birthday, parent_email, parent_name, player_name} = user
  const dateFormat = 'MM/DD/YYYY';
  const initBirthday = dayjs(birthday).format('MM/DD/YYYY')
  const spaceParentIndex = indexOfSpace(parent_name)
  const spacePlayerIndex = indexOfSpace(player_name)
  const parentFirstName = parent_name.slice(0, spaceParentIndex)
  const parentLastName = parent_name.slice(spaceParentIndex + 1)
  const playerFirstName = player_name.slice(0, spacePlayerIndex)
  const playerLastName = player_name.slice(spacePlayerIndex + 1)

  const initialValue = {
    birthday: initBirthday,
    parent_first_name: parentFirstName,
    parent_last_name: parentLastName,
    player_first_name: playerFirstName,
    player_last_name: playerLastName,
    parent_email: parent_email,
    currPassword: "",
    password: "",
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

  function handleDateChange(date, dateString){
    setAccountFormData({
      ...accountFormData,
      birthday: dateString
    })
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

    const curdate = accountFormData.birthday
    const formattedDate = dayjs(curdate).format('YYYY-MM-DD')
    const parentName = accountFormData.parent_first_name + " " + accountFormData.parent_last_name
    const playerName = accountFormData.player_first_name + " " + accountFormData.player_last_name
    
    accountFormData.player_name = playerName
    accountFormData.parent_name = parentName
    accountFormData.birthday = formattedDate

    if (accountFormData.password){
      accountFormData.password_hash = accountFormData.password
      delete accountFormData.password
    }

    delete accountFormData.player_first_name
    delete accountFormData.player_last_name
    delete accountFormData.parent_first_name
    delete accountFormData.parent_last_name

    console.log(accountFormData)

    fetch(`/players/${id}`, {
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
        id="player-account-form"
        >
        <div id="player-information">
            <h3>Player Information</h3>
            <div>
            <img />
            <Form.Item
                name="player_first_name"
                label="Player First Name"
                initialValue={accountFormData.player_first_name}
                value={accountFormData.player_first_name}
                onChange={handleChange}
            >
                <Input name="first_name"/>
            </Form.Item>

            <Form.Item
                name="player_last_name"
                label="Player Last Name"
                initialValue={accountFormData.player_last_name}
                value={accountFormData.player_last_name}
                onChange={handleChange}
            >
                <Input name="last_name"/>
            </Form.Item>

            <Form.Item 
                label="Player Birthday" 
                name="birthday"
                value={accountFormData.birthday}
                >
                <DatePicker format={dateFormat} defaultValue={dayjs(initBirthday)} onChange={handleDateChange}/>
            </Form.Item>
            </div>
        </div>

        <div id="parent-information">
            <h3>Parent Information</h3>
            <Form.Item
                name="parent_first_name"
                label="Parent First Name"
                initialValue={accountFormData.parent_first_name}
                value={accountFormData.parent_first_name}
                onChange={handleChange}
            >
                <Input name="first_name"/>
            </Form.Item>

            <Form.Item
                name="parent_last_name"
                label="Parent Last Name"
                initialValue={accountFormData.parent_last_name}
                value={accountFormData.parent_last_name}
                onChange={handleChange}
            >
                <Input name="last_name"/>
            </Form.Item>
        </div>

        <div id="login-information">
            <h3>Log In Information</h3>
            <div>
            <Form.Item
            name="parent_email"
            label="E-mail"
            initialValue={accountFormData.parent_email}
            onChange={handleChange}
            rules={[
                {
                type: 'email',
                message: 'The input is not a valid E-mail!',
                }
            ]}
            >
            <Input name="parent_email"/>
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

export default PlayerAccount;