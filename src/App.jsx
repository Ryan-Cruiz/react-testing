import { use, useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
async function getUsers() {
  const res = await axios.get("http://localhost:3000/users")
  // console.log(res.);
  return res;
}
function App() {
  const [users, setUsers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log(e);
    let errArr = [];
    if (firstName == "") {
      errArr.push("First Name is required.")
    }
    if (lastName == "") {
      errArr.push("Last Name is required.")
    }
    setErrors(errArr);
    if (firstName != "" && lastName != "") {
      // console.log(firstName, lastName)
      const cred = {
        first_name: firstName,
        last_name: lastName
      }
      const res = await axios.post("http://localhost:3000/users", cred);
      if (res.status == 201) {
        const userResponse = getUsers();
        userResponse.then(user_res => { setUsers(user_res.data) })
        setFirstName("")
        setLastName("")
      }
      console.log(res);
    }
  }
  useEffect(() => {
    const res = getUsers();
    res.then(res => { setUsers(res.data) })
    // console.log(users);
  }, [])
  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <label>First Name:
            <input
              type="text"
              name='first_name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <p style={{ color: "red" }}>{errors[0]}</p>
          <label>Last Name:
            <input
              type="text"
              name='first_name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <p style={{ color: "red" }}>{errors[1]}</p>
          <input type="submit" value="Submit" />
        </form>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            {users.map(v => {
              return (
                <tr key={v.id}>
                  <td>{v.first_name}</td>
                  <td>{v.last_name}</td>
                </tr>)
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
