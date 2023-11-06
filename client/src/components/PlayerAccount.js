import "../CSS/accountStyles.css"
import { Form, Input, Button, DatePicker, InputNumber, Upload, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from "react";
import dayjs from "dayjs";
import { CLOUDINARY_API_KEY } from "../apikeys";

function PlayerAccount({user, handleUpdateUser, handleServerError, handlePasswordError, handleSucessfulUpdate, container}) {

  const {id, birthday, parent_email, parent_name, player_name, parent_phone_number, jersey_num} = user
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
    parent_phone_number: parent_phone_number,
    parent_email: parent_email,
    currPassword: "",
    password: "",
    jersey_num: jersey_num
  }
  const [accountFormData , setAccountFormData] = useState(initialValue)
  const [ photoFile, setPhotoFile ] = useState(null);
  const [ photoUrl, setPhotoUrl ] = useState("")
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', or 'done'
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

  function handleJerseyChange(jerseyNum){
    setAccountFormData({
      ...accountFormData,
      jersey_num: jerseyNum
    })
  }

  function handleChange(e){
    const {name, value} = e.target
    setAccountFormData({
      ...accountFormData,
      [name]: value
    })
  }

  function handlePhotoChange(info){
    setPhotoFile(info.file)
    setUploadStatus('uploading')
    const formData = new FormData()
    formData.append('file', info.file)
    formData.append('upload_preset', 'bvspu3zv')
    formData.append('api_key', CLOUDINARY_API_KEY)

    // Make a POST request to Cloudinary for image upload
    fetch('https://api.cloudinary.com/v1_1/kmlovecloud/image/upload', {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from Cloudinary here, e.g., store the image URL
      setPhotoUrl(data.secure_url)
      setUploadStatus('done');
      // You can now do something with the image URL, like saving it to your database or displaying it in your UI.
    })
    .catch((error) => {
      setUploadStatus('error')
      console.error('Upload error:', error);
    });
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

    let updated_player
    if(photoUrl.length > 0){
      updated_player = {
        ...accountFormData,
        player_name: playerName,
        parent_name: parentName,
        birthday: formattedDate,
        headshot_img_url: photoUrl
      }
    } else {
      updated_player = {
        ...accountFormData,
        player_name: playerName,
        parent_name: parentName,
        birthday: formattedDate
      }
    }

    if (accountFormData.password){
        updated_player.password_hash = accountFormData.password
        delete updated_player.password
    }

    delete updated_player.player_first_name
    delete updated_player.player_last_name
    delete updated_player.parent_first_name
    delete updated_player.parent_last_name

    fetch(`/players/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(updated_player)
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
        const spaceParentIndex = indexOfSpace(data.parent_name)
        const spacePlayerIndex = indexOfSpace(data.player_name)
        const parentFirstName = data.parent_name.slice(0, spaceParentIndex)
        const parentLastName = data.parent_name.slice(spaceParentIndex + 1)
        const playerFirstName = data.player_name.slice(0, spacePlayerIndex)
        const playerLastName = data.player_name.slice(spacePlayerIndex + 1)
        const initBirthday = dayjs(data.birthday).format('MM/DD/YYYY')
      handleUpdateUser(data)
      handleSucessfulUpdate(true)
      setPhotoFile(null)
      setPhotoUrl("")
      setUploadStatus('idle')
      setAccountFormData({
        birthday: initBirthday,
        parent_first_name: parentFirstName,
        parent_last_name: parentLastName,
        player_first_name: playerFirstName,
        player_last_name: playerLastName,
        parent_email: parent_email,
        currPassword: "",
        password: "",
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
        //     span: 10,
        // }}
        layout="vertical"
        style={{
            maxWidth: 800,
        }}
        initialValues={{
            remember: true,
        }}
        onFinish={handleSubmit}
        autoComplete="off"
        id="player-account-form"
        className="account-form"
        >
        <div id="player-information" className="account-form-section">
          <h3>Player Information</h3>
            <Form.Item
                name="player_first_name"
                label="Player First Name"
                className="form-item"
                initialValue={accountFormData.player_first_name}
                value={accountFormData.player_first_name}
                onChange={handleChange}
            >
                <Input name="player_first_name" className="input"/>
            </Form.Item>

            <Form.Item
                name="player_last_name"
                label="Player Last Name"
                className="form-item"
                initialValue={accountFormData.player_last_name}
                value={accountFormData.player_last_name}
                onChange={handleChange}
            >
                <Input name="player_last_name" className="input"/>
            </Form.Item>

            <Form.Item 
                label="Player Birthday" 
                name="birthday"
                className="form-item"
                value={accountFormData.birthday}
                >
                <DatePicker format={dateFormat} defaultValue={dayjs(initBirthday)} onChange={handleDateChange} style={{height: "45px"}} className="player-account-birthday"/>
            </Form.Item>

            <Form.Item 
                label="Jersey Number" 
                name="jersey_num"
                className="form-item"
                value={accountFormData.jersey_num}
                >
              <InputNumber name="jersey_num" size="large" min={0} max={999} defaultValue={accountFormData.jersey_num} onChange={handleJerseyChange} />
            </Form.Item>

            <Form.Item label="Upload Profile Picture" name="profile-pic">
            <Upload.Dragger name="profile-pic" maxCount={1}  showUploadList={false} customRequest={handlePhotoChange} accept=".png, .jpeg, .jpg">
              {uploadStatus === 'done' ? (
                                    
                <div>
                  <Progress
                    percent={100} // Set the progress to 88% 
                    status="done"
                  />
                  <p className="ant-upload-text">Upload complete!</p>
                </div>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    {uploadStatus === 'uploading' ? 'Uploading...' : 'Click or drag file to this area to upload'}
                  </p>
                  {uploadStatus === 'uploading' && (
                    <Progress
                      percent={88} // Set the progress to 88% 
                      status="active"
                    />
                  )}
                  <p className="ant-upload-hint">Support for a single upload.</p>
                </>
              )}
            </Upload.Dragger>
          </Form.Item>
          {uploadStatus === "done"? photoFile.name: null}
        </div>

        <div id="parent-information" className="account-form-section">
            <h3>Parent Information</h3>
            <Form.Item
                name="parent_first_name"
                label="Parent First Name"
                className="form-item"
                initialValue={accountFormData.parent_first_name}
                value={accountFormData.parent_first_name}
                onChange={handleChange}
            >
                <Input name="parent_first_name" className="input"/>
            </Form.Item>

            <Form.Item
                name="parent_last_name"
                label="Parent Last Name"
                className="form-item"
                initialValue={accountFormData.parent_last_name}
                value={accountFormData.parent_last_name}
                onChange={handleChange}
            >
                <Input name="parent_last_name" className="input"/>
            </Form.Item>

            <Form.Item
              name="parent_phone_number"
              label="Parent Phone Number"
              className="form-item"
              initialValue={accountFormData.parent_phone_number}
              value={accountFormData.parent_phone_number}
              onChange={handleChange}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value.length !== 10) {
                      return Promise.reject(new Error('Phone number need to be 10 digits long!'));
                    } 
                    if (isNaN(Number(value))) {
                      return Promise.reject(new Error('Phone number must consist of numbers between 0-9!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input
                name="parent_phone_number"
                style={{
                  width: '100%',
                  height: "46px"
                }}
                className="select"
              />
            </Form.Item>
        </div>

        <div id="login-information" className="account-form-section">
            <h3>Log In Information</h3>
            <div>
            <Form.Item
            name="parent_email"
            label="E-mail"
            className="form-item"
            initialValue={accountFormData.parent_email}
            onChange={handleChange}
            rules={[
                {
                type: 'email',
                message: 'The input is not a valid E-mail!',
                }
            ]}
            >
            <Input name="parent_email" className="input"/>
            </Form.Item>

            <Form.Item
            name="currPassword"
            label="Current Password"
            className="form-item"
            value={accountFormData.currPassword}
            onChange={handleChange}
            >
            <Input.Password name="currPassword" className="input" />
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

export default PlayerAccount;