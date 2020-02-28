import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";


const AnimalForm = ({ values, errors, touched, status }) => {
  // console.log("values", values);
  // console.log("errors", errors);
  // console.log("touched", touched);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    console.log("status has changed!", status);
    status && setUsers(users => [...users, status]);
  }, [status]);
  return (
    <div >
      <Form className="bigBoxForm">
        <label className="bbLabel" htmlFor="Name">
          Name: 
          <Field
            id="Name"
            type="text"
            name="Name"
            placeholder="Name"
          />
    
          {touched.Name && errors.Name && (
            <p >{errors.Name}</p>
          )}
        </label>
        <label className="bbLabel" htmlFor="Email">
          Email: 
          <Field id="Email" type="email" name="Email" placeholder="Email" />
          {touched.Email && errors.Email && (
            <p >{errors.Email}</p>
          )}
        </label>
        <label className="bbLabel" htmlFor="Password">
          Password: 
          <Field id="Password" type="password" name="Password" placeholder="Password" />
          {touched.Password && errors.Password && (
            <p >{errors.Password}</p>
          )}
        </label>
        <label className="bbLabel" >
          Agree to Terms and Services 
          <Field
            type="checkbox"
            name="Terms"
            checked={values.Terms}
          />
          <span />
        </label >
        <button type="submit">Submit!</button>
      </Form>
      {/* <pre>{JSON.stringify(values, null, 2)}</pre>
      <pre>{JSON.stringify(errors, null, 2)}</pre> */}
      {users.map(animal => {
        return (
          <ul key={animal.id}>
            <li>Name: {animal.Name}</li>
            <li>Email: {animal.Email}</li>
          </ul>
        );
      })}
    </div>
  );
};

const FormikAnimalForm = withFormik({
  // props from <AnimalForm /> in app are in props param
  mapPropsToValues(props) {
    // set initial state of form to value from parent component OR the initial value (after || )
    return {
      Name: props.Name || "",
      Email: props.Email || "",
      Password: props.Password || "",
      Terms: props.Terms || false,
    };
  },

  // Declare shape and requirement of values object (form state )
  validationSchema: Yup.object().shape({
    Name: Yup.string().required(),
    // passing a string in required makes a custom inline error msg
    Email: Yup.string().required("Email IS MANDATORY")
  }),

  // passed through props (magically) to Form component in Formik
  // fires when button type=submit is fired
  // values = state of form, formikBag is second param
  // in FormikBag: setStatus (sends API response to AnimalForm) & resetForm (clears form when called)
  handleSubmit(values, { setStatus, resetForm }) {
    console.log("submitting", values);
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        // console.log("success", res);
        // sends a status update through props in AnimalForm with value as res.data content
        setStatus(res.data);

        //clears form inputs, from FormikBag
        resetForm();
      })
      .catch(err => console.log(err.response));
  }
})(AnimalForm);
export default FormikAnimalForm;

  