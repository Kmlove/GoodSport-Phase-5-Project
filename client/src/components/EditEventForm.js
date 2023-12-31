import { useState } from "react"
import { Button, DatePicker, Form, Input, Select,TimePicker } from 'antd';
import dayjs from 'dayjs';

function EditEventForm({id, handleUpdateEvent, handleUpdateCurEvent, handleCloseEditForm, handleShowSuccessfulUpdateAlert, handleShowErrorUpdateAlert}) {
    const {TextArea} = Input;   
    const dateFormat = 'MM/DD/YYYY';
    const eventDetails = document.querySelector('.event-details')

    const initialValue = {
        event_type: eventDetails.querySelector('#event_type').textContent,
        date: eventDetails.querySelector('#date').textContent,
        event_time: "",
        location: eventDetails.querySelector('#location').textContent,
        notes: eventDetails.querySelector('#notes').textContent
      }
    const [editEventFormData, setEditEventFormData] = useState(initialValue)

    function handleTimeChange(time, timeStringArray) {
        const timeString = timeStringArray[0] + " - " + timeStringArray[1]
        setEditEventFormData({
          ...editEventFormData,
          event_time: timeString
        })
    }
    
    function handleDateChange(date, dateString){
        setEditEventFormData({
          ...editEventFormData,
          date: dateString
        })
    }
    
    function handleEventChange(key, e){
        setEditEventFormData({
          ...editEventFormData,
          event_type: e.value
        })
    }
    
    function handleTextChange(e){
        const {name, value} = e.target
    
        setEditEventFormData({
          ...editEventFormData,
          [name]: value
        })
    }

    function handleSubmit(e){

      for (const key in editEventFormData){
        if (editEventFormData[key] === ''){
            delete editEventFormData[key]
        }

        if (key === 'date' && editEventFormData.date){
          const curdate = editEventFormData.date
          const formattedDate = dayjs(curdate).format('YYYY-MM-DD')
          editEventFormData.date = formattedDate
        }
      }

      fetch(`/events/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(editEventFormData)
      })
      .then(res => {
        if (res.status === 202){
          return  res.json()
        } else if (res.status === 400){
          handleShowErrorUpdateAlert(true)
          return Promise.reject('Validations Error')
        } else if (res.status === 404){
          handleShowErrorUpdateAlert(true)
          return Promise.reject('Event Not Found')
        } else if (res.status === 500){
          handleShowErrorUpdateAlert(true)
          return Promise.reject('Server Error')
        }
      })
      .then(data => {
        handleUpdateEvent(data)
        handleUpdateCurEvent(data)
        handleCloseEditForm(false)
        handleShowSuccessfulUpdateAlert(true)
      })
      .catch(err => console.error("Error: ", err))
    }

  return (
    <Form
      className="form edit-event"
      layout="horizontal"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 10,
      }}
      size="large"
      style={{
        // maxWidth: 800,
        margin: "30px auto 0 auto",
      }}
      onFinish={handleSubmit}
    >

      <Form.Item label="Event Type" >
        <Select name="event_type" onChange={handleEventChange} value={editEventFormData.event_type}>
          <Select.Option value="Practice">Practice</Select.Option>
          <Select.Option value="Game">Game</Select.Option>
          <Select.Option value="Meeting">Meeting</Select.Option>
          <Select.Option value="Other">Other</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Time">
        <TimePicker.RangePicker use12Hours format="h:mm a" onChange={handleTimeChange} className="select"/>
      </Form.Item>
      
      <Form.Item label="Date">
        <DatePicker format={dateFormat} onChange={handleDateChange} defaultValue={dayjs(editEventFormData.date, dateFormat)} className="select"/>
      </Form.Item>

      <Form.Item label="Location">
        <Input onChange={handleTextChange} name="location" value={editEventFormData.location} className="select"/>
      </Form.Item>

      <Form.Item label="Notes" >
          <TextArea rows={4} name='notes' value={editEventFormData.notes} onChange={handleTextChange} className="select"/>
      </Form.Item>

      <Form.Item  wrapperCol={{offset: 10}}>
        <Button type="primary" htmlType="submit" className="edit-event-submit-button" >
          Update Event
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditEventForm