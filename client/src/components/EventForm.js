import { Button, DatePicker, Form, Input, Select,TimePicker, Alert } from 'antd';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

function EventForm({teams, user, addNewEvent, handleShowSuccessfulAddAlert}) {
  const initialValue = {
    team_id: "",
    event_type: "",
    date: "",
    event_time: "",
    location: "",
    notes: ""
  }
  const navigate = useNavigate()
  const [showAddEventError, setShowAddEventError] = useState(false)
  const [newEventFormData, setNewEventFormData] = useState(initialValue)
  const { club } = user
  const {TextArea} = Input;   
  const dateFormat = 'MM/DD/YYYY';
  const teamsInClub = teams.filter(team => club.id === team.club_id)

  useEffect(() => {
    if (showAddEventError) {
      // Use a setTimeout to hide the alert after 3 seconds
      const timer = setTimeout(() => {
        setShowAddEventError(false);
      }, 3000); // 3000 milliseconds (3 seconds)

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    } 
    }, [ showAddEventError ]);

  function handleTimeChange(time, timeStringArray) {
    const timeString = timeStringArray[0] + " - " + timeStringArray[1]
    setNewEventFormData({
      ...newEventFormData,
      event_time: timeString
    })
  }

  function handleDateChange(date, dateString){
    setNewEventFormData({
      ...newEventFormData,
      date: dateString
    })
  }

  function handleTeamChange(key, e){
    setNewEventFormData({
      ...newEventFormData,
      team_id: e.value
    })
  }

  function handleEventChange(key, e){
    setNewEventFormData({
      ...newEventFormData,
      event_type: e.value
    })
  }

  function handleTextChange(e){
    const {name, value} = e.target

    setNewEventFormData({
      ...newEventFormData,
      [name]: value
    })
  }

  function handleSubmit(e){

    const curdate = newEventFormData.date
    const formattedDate = dayjs(curdate).format('YYYY-MM-DD')

    const newEvent = {
      ...newEventFormData,
      coach_id: user.id,
      date: formattedDate
    }

    fetch('/events', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newEvent)
    })
    .then(res => {
      if (res.status === 201){
        return res.json()
      } else if(res.status === 400){
        setShowAddEventError(true)
        return Promise.reject("Validations Error")
      } else if (res.status === 500){
        setShowAddEventError(true)
        return Promise.reject("Server Error")
      }
    })
    .then(data => {
      addNewEvent(data)
      handleShowSuccessfulAddAlert(true)
      navigate(`/event/${data.id}`)
    })
    .catch(err => console.error("Error: ", err))
  } 

  return (
    <div className='right'>
      {showAddEventError? <Alert message="An error occured while creating this event, please try again!" type="error" banner closable showIcon /> : null}

      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        layout="horizontal"
        size="large"
        style={{
          maxWidth: 600,
        }}
        onFinish={handleSubmit}
      >
        <Form.Item 
          label="Team"
          name="team_id" 
          rules={[
            {
              required: true,
              message: 'Please select a team!',
            },
          ]}
        >
          <Select name="team_id" onChange={handleTeamChange}>
            {teamsInClub.map(team => <Select.Option key={team.id} value={team.id}>{team.team_name}</Select.Option>)}
          </Select>
        </Form.Item>

        <Form.Item 
          label="Event Type"
          name="event_type"
          rules={[
            {
              required: true,
              message: 'Please select an event type!',
            },
          ]} 
        >
          <Select name="event_type" onChange={handleEventChange}>
            <Select.Option value="Practice">Practice</Select.Option>
            <Select.Option value="Game">Game</Select.Option>
            <Select.Option value="Meeting">Meeting</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item 
          label="Time"
          name="event_time"
          rules={[
            {
              required: true,
              message: 'Please select an event time!',
            },
          ]} 
        >
          <TimePicker.RangePicker use12Hours format="h:mm a" onChange={handleTimeChange} />
        </Form.Item>
        
        <Form.Item 
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: 'Please select an date!',
            },
          ]} 
        >
          <DatePicker format={dateFormat} onChange={handleDateChange}/>
        </Form.Item>

        <Form.Item label="Location">
          <Input onChange={handleTextChange} name="location" value={newEventFormData.location}/>
        </Form.Item>

        <Form.Item label="Notes" >
            <TextArea rows={4} name='notes' value={newEventFormData.notes} onChange={handleTextChange}/>
        </Form.Item>

        <Form.Item >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

}

export default EventForm