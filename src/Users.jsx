/**
 * Visit React-Query Docs
 * https://tanstack.com/query/v4/docs/framework/react/overview
 * 
*/
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers } from './js/user/Users.js';
import api from './js/api.js';
import { create } from 'zustand';
/* zustand state */
const useNameStore = create((set) => ({
    firstName: "",
    lastName: "",
    errors: {},
    setErrors: (errors) => set(() => ({ errors: errors })),
    setFirstName: (firstName) => set(() => ({ firstName: firstName })),
    setLastName: (lastName) => set(() => ({ lastName: lastName })),
    counter: 0,
    setCounter: () => set(state => ({ counter: state.counter + 1 }))
}))
export default function Users() {
    /* react state */
    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    // const [errors, setErrors] = useState({});

    const queryClient = useQueryClient();
    // use query
    const { isError, isLoading, data, error } = useQuery({
        queryKey: ['users'], queryFn: getUsers, staleTime: 120000
    });
    // console.log(data)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(e);
        let errArr = {};
        if (firstName == "") {
            errArr['first_name'] = "First Name is required.";
        }
        if (lastName == "") {
            errArr['last_name'] = "Last Name is required.";
        }
        // set errors
        setErrors(errArr);
        if (firstName != "" && lastName != "") {
            // console.log(firstName, lastName)
            // create Object
            const cred = {
                first_name: firstName,
                last_name: lastName
            }
            const res = await api.post("/users", cred);
            // call axios api call post
            if (res.status == 201) {
                setFirstName("");
                setLastName("");
            }
            console.log(res);
        }
    }
    // Mutations
    const mutation = useMutation({
        mutationFn: handleSubmit,
        // Invalidate and refetch
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    })
    const { firstName, lastName, setFirstName, setLastName, counter, setCounter, errors, setErrors } = useNameStore();
    return (
        <>
            {/* Form */}
            <button type="button" onClick={setCounter}>{counter} Counter</button>
            <form onSubmit={mutation.mutate}>
                <label>First Name:
                    <input
                        type="text"
                        name='first_name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={errors.first_name ? { border: "solid red 1px" } : { border: "solid black 1px" }}

                    />
                </label>
                <p style={{ color: "red" }}>{errors.first_name}</p>
                <label>Last Name:
                    <input
                        type="text"
                        name='first_name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={errors.last_name ? { border: "solid red 1px" } : { border: "solid black 1px" }}
                    />
                </label>
                <p style={{ color: "red" }}>{errors.last_name}</p>
                {/* <input type="submit" value="Submit" /> */}
                <button type="submit">Submit</button>
            </form>
            {/* Table */}
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        {/* <th>Actions</th> */}
                    </tr>
                </thead>
                <tbody>
                    {isError ? <tr><td colSpan={2}>Error...</td></tr> : isLoading ? <tr><td colSpan={2}>Loading...</td></tr> :
                        data.map(v => {
                            return (
                                <tr key={v.id}>
                                    <td>{v.first_name}</td>
                                    <td>{v.last_name}</td>
                                </tr>)
                        })
                    }
                </tbody>
            </table>
        </>
    )
}