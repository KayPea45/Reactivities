import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  // React hooks to set a state of variable in this case its activities
  // setActivities is the method of setting the state of our activities
  const [activities, setActivities] = useState([]); // initial state of empty arr

  // A side effect that happens when our App is initialised/mounted
  useEffect(() => {
    axios.get('http://localhost:5000/api/activities')
    .then(response => {
      // NOTE: with Strict mode on (see main.tsx), API will call twice which is normal
      // console.log(response)
      setActivities(response.data)
    })
  }, []) 
  // [] empty dependency, which means only run once, if we had dependencies then 
  // will run again when dependency is met

  return (
    <div>
      <Header as='h2' icon='users' content='Reactivities' />
      <List>
        {activities.map((activity:any) => (
          <List.Item key={activity.id}>{activity.title}</List.Item>
        ))}
      </List>
    </div>
  )
}

export default App
