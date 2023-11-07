import "../CSS/accountStyles.css"
import { Form, Input, Button, Select, Upload, Progress } from 'antd';
import { useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import { CLOUDINARY_API_KEY } from "../apikeys";

function CoachAccount({user, handleUpdateUser, handleServerError, handlePasswordError, handleSucessfulUpdate, container}) {
  const { Option } = Select
  // const prefixSelector = (
  //   <Form.Item name="prefix" noStyle>
  //     <Select
  //       style={{
  //         width: 70,
  //       }}
  //     >
  //       <Option value="1">+1</Option>
  //     </Select>
  //   </Form.Item>
  // );
  const {coach_name, email, phone_number, id} = user
  const spaceIndex = indexOfSpace(coach_name)
  const firstName = coach_name.slice(0, spaceIndex)
  const lastName = coach_name.slice(spaceIndex + 1)

  const initialValue = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    currPassword: "",
    password: "",
    phone_number: phone_number
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
    let new_coach
    if(photoUrl.length > 0){
      new_coach = {
        ...accountFormData,
        coach_name: name,
        headshot_img_url: photoUrl
      }
    } else {
      new_coach = {
        ...accountFormData,
        coach_name: name
      }
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
      setPhotoFile(null)
      setPhotoUrl("")
      setUploadStatus('idle')
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
        maxWidth: 800,
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

          <Form.Item
            name="phone_number"
            label="Phone Number"
            className="form-item"
            initialValue={accountFormData.phone_number}
            value={accountFormData.phone_number}
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
              // addonBefore={prefixSelector}
              name="phone_number"
              style={{
                width: '100%',
                height: "46px"
              }}
              className="select"
            />
          </Form.Item>

          <Form.Item label="Upload Profile Picture" name="fileList">
            <Upload.Dragger name="fileList" maxCount={1}  showUploadList={false} customRequest={handlePhotoChange} accept=".png, .jpeg, .jpg">
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