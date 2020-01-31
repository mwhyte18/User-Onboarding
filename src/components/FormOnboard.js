import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import styled from "styled-components";

const FormStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fffdd0;
    padding: 3%;
`
const Button = styled.button`
    background-color: black;
    color: white;
    border: none;
    padding: 1%;
    margin-top: 2%;
`
const FormOnboard = ({ values, errors, touched, status}) => {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        console.log("status change", status)
        status && setUsers( users =>
            [...users, status])

    }, [status]);

    return ( 
        <FormStyle className="form">
            <Form>
                <label htmlFor="name">
                Enter Name:               
                    <Field id="name" type="text" name="name" placeholder="name"/>
                    {touched.name && errors.name && (
                        <p className="hasError">{errors.name}</p>
                    )}
                </label>
                <label htmlFor="email">
                Email:
                    <Field id="email" type="text" name="email" placeholder="email"/>
                    {touched.email && errors.email && (
                        <p className="hasError">{errors.email}</p>
                    )}
                </label>
                <label htmlFor="password">
                Password:    
                    <Field id="password" type="text" name="password" placeholder="password"/>
                </label>
                <label htmlFor="terms-of-service">
                Terms of Service:
                    <Field id="tos" type="checkbox" name="tos" check={values.tos} placeholder="ToS"/>
                    <span className="checkbox" />
                </label>
                <Button type="submit">Submit Form</Button>
            </Form>
            {users.map(user => (
                <ul key={user.id}>
                    <li>Name: {user.name}</li>
                    <li>Email: {user.email}</li>
                    <li>Password: {"*".repeat(user.password.length)}</li>
                </ul>                    
            ))}
        </FormStyle>
     );
    };

const ForMikFormOnboard = withFormik({
    mapPropsToValues({ name, email, password, tos }){
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            tos: tos || false
        }
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required("Name is Required"),
        email: Yup.string().email().required("Email is Required"),
        password: Yup.string().required("Password is Required")
    }),
    handleSubmit(values, {setStatus, resetForm}) {
        console.log("submitting", values);
        axios.post("https://reqres.in/api/users", values)
        .then(res => {
            console.log("success", res)
            setStatus(res.data)
            resetForm();
        })
        .catch(err => console.log(err.response));
    }
})(FormOnboard);

 
export default ForMikFormOnboard;