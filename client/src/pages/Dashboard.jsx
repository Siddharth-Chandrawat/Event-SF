import {useState, useEffect} from 'react'

export default function Dashboard() {
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/name')
    .then(res => res.json())
    .then(data => setName(data.name))

  }, [])
  
  return (
    <p> Welcome {name} </p>
  );
}

