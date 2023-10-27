import { Button, DatePicker, Form, Input, Select,TimePicker } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

function EventForm({teams, user, addNewEvent}) {
  const navigate = useNavigate()
  const { club } = user
  const [componentSize, setComponentSize] = useState('default');
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const {TextArea} = Input;   

  const dateFormat = 'MM/DD/YYYY';
  // const dayjs1 = dayjs().format(dateFormat)
  // defaultValue={dayjs(dayjs1, dateFormat)}

  const teamsInClub = teams.filter(team => club.id === team.club_id)

  const initialValue = {
    team_id: "",
    event_type: "",
    date: "",
    event_time: "",
    location: "",
    notes: ""
  }
  const [newEventFormData, setNewEventFormData] = useState(initialValue)

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
    // e.preventDefault()

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
    .then(res => res.json())
    .then(data => {
      addNewEvent(data)
      navigate(`/event/${data.id}`)
    })
  } 

  return (
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
      <Form.Item label="Team" >
        <Select name="team_id" onChange={handleTeamChange}>
          {teamsInClub.map(team => <Select.Option key={team.id} value={team.id}>{team.team_name}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item label="Event Type" >
        <Select name="event_type" onChange={handleEventChange}>
          <Select.Option value="Practice">Practice</Select.Option>
          <Select.Option value="Game">Game</Select.Option>
          <Select.Option value="Meeting">Meeting</Select.Option>
          <Select.Option value="Other">Other</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Time">
        <TimePicker.RangePicker use12Hours format="h:mm a" onChange={handleTimeChange} />
      </Form.Item>
      
      <Form.Item label="Date">
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
  );

}

export default EventForm