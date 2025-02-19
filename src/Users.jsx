/**
 * Visit React-Query Docs
 * https://tanstack.com/query/v4/docs/framework/react/overview
 * 
*/
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers } from './js/user/Users.js';

export default function Users() {
    // create states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errors, setErrors] = useState({});
    const queryClient = useQueryClient();
    // Get User Functions
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
            // call axios api call post
            const res = await api.post("/users", cred);
            if (res.status == 201) {
                setFirstName("")
                setLastName("")
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

    return (
        <>
            {/* Form */}
            <form onSubmit={mutation.mutate}>
                <label>First Name:
                    <input
                        type="text"
                        name='first_name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={errors.first_name ? { border: "solid red 1px" } : {border:"solid black 1px"}}

                    />
                </label>
                <p style={{ color: "red" }}>{errors.first_name}</p>
                <label>Last Name:
                    <input
                        type="text"
                        name='first_name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={errors.last_name ? { border: "solid red 1px" } : {border:"solid black 1px"}}
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