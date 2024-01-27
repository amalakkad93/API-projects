import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const isSignupDisabled =
        !email.trim() ||
        username.length < 4 ||
        !firstName.trim() ||
        !lastName.trim() ||
        password.length < 6 ||
        !confirmPassword.trim();

        const validateSignupForm = (values) => {
            let errors = {};

            if (!values.email) errors.email = "Email is required";
            else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(values.email))
                errors.email = "The provided email is invalid.";

            if (values.username.length < 4) errors.username = "Username must be at least 4 characters long";

            if (!values.firstName) errors.firstName = "First Name is required";
            if (!values.lastName) errors.lastName = "Last Name is required";

            if (values.password.length < 6) errors.password = "Password must be at least 6 characters long";
            if (values.password !== values.confirmPassword)
                errors.confirmPassword = "Confirm Password field must be the same as the Password field";

            return errors;
        };


    const handleModalClose = () => {
        setEmail("");
        setUsername("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
        closeModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formErrors = validateSignupForm({
            email,
            username,
            firstName,
            lastName,
            password,
            confirmPassword
        });

        // If there are any client-side errors, set them
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            // If there are no client-side errors, attempt server signup
            dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password,
                })
            )
            .then(handleModalClose)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    // Add server-side errors
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        ...data.errors
                    }));
                }
            });
        }
    };



    return (
        <>
            <form onSubmit={handleSubmit} className="signup-form">
                <h2 className="signup-h1-tag">Sign Up</h2>
                <label className="label-signup">
                    {errors.email && <p className="errors">{errors.email}</p>}
                    <input
                        type="text"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.email;
                                return newErrors;
                            });
                        }}
                        required
                    />
                </label>
                <label className="label-signup">
                    {errors.username && <p className="errors">{errors.username}</p>}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.username;
                                return newErrors;
                            });
                        }}
                        required
                    />
                </label>
                <label className="label-signup">
                    {errors.firstName && <p className="errors">{errors.firstName}</p>}
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                            setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.firstName;
                                return newErrors;
                            });
                        }}
                        required
                    />
                </label>
                <label className="label-signup">
                    {errors.lastName && <p className="errors">{errors.lastName}</p>}
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.lastName;
                                return newErrors;
                            });
                        }}
                        required
                    />
                </label>
                <label className="label-signup">
                    {errors.password && <p className="errors">{errors.password}</p>}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.password;
                                return newErrors;
                            });
                        }}
                        required
                    />
                </label>
                <label className="label-signup">
                    {errors.confirmPassword && (<p className="errors">{errors.confirmPassword}</p>)}
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.confirmPassword;
                                return newErrors;
                            });
                        }}
                        required
                    />
                </label>
                <button type="submit" disabled={isSignupDisabled}>Sign Up</button>
            </form>
        </>
    );
}

export default SignupFormModal;




// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// import * as sessionActions from "../../store/session";
// import "./SignupForm.css";

// function SignupFormModal() {
//     const dispatch = useDispatch();
//     const [email, setEmail] = useState("");
//     const [username, setUsername] = useState("");
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [errors, setErrors] = useState({});
//     const { closeModal } = useModal();

//     const handleModalClose = () => {
//         setEmail("");
//         setUsername("");
//         setFirstName("");
//         setLastName("");
//         setPassword("");
//         setConfirmPassword("");
//         setErrors({});
//         closeModal();
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (password === confirmPassword) {
//             setErrors({});
//             return dispatch(
//                 sessionActions.signup({
//                     email,
//                     username,
//                     firstName,
//                     lastName,
//                     password,
//                 })
//             )
//                 .then(handleModalClose)
//                 .catch(async (res) => {
//                     const data = await res.json();
//                     if (data && data.errors) {
//                         setErrors(data.errors);
//                     }
//                 });
//         }
//         return setErrors({
//             confirmPassword: "Confirm Password field must be the same as the Password field"
//         });
//     };

//     const isSignupDisabled =
//         !email ||
//         username.length < 4 ||
//         !firstName ||
//         !lastName ||
//         password.length < 6 ||
//         !confirmPassword;

//     return (
//         <>
//             <form onSubmit={handleSubmit} className="signup-form">
//                 <h2 className="signup-h1-tag">Sign Up</h2>
//                 {/* Email */}
//                 <label className="label-signup">
//                     {/* <div className="label-title">Email</div> */}
//                     <input
//                         type="text"
//                         value={email}
//                         placeholder="Email"
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </label>
//                 {errors.email && <p className="errors">{errors.email}</p>}

//                 {/* Username */}
//                 <label className="label-signup">
//                     {/* <div>Username</div> */}
//                     <input
//                         type="text"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                     />
//                 </label>
//                 {errors.username && <p className="errors">{errors.username}</p>}

//                 {/* First Name */}
//                 <label className="label-signup">
//                     {/* <div>First Name</div> */}
//                     <input
//                         type="text"
//                         placeholder="First Name"
//                         value={firstName}
//                         onChange={(e) => setFirstName(e.target.value)}
//                         required
//                     />
//                 </label>
//                 {errors.firstName && <p className="errors">{errors.firstName}</p>}

//                 {/* Last Name */}
//                 <label className="label-signup">
//                     {/* <div>Last Name</div> */}
//                     <input
//                         type="text"
//                         placeholder="Last Name"
//                         value={lastName}
//                         onChange={(e) => setLastName(e.target.value)}
//                         required
//                     />
//                 </label>
//                 {errors.lastName && <p className="errors">{errors.lastName}</p>}

//                 {/* Password */}
//                 <label className="label-signup">
//                     {/* <div>Password</div> */}
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </label>
//                 {errors.password && <p className="errors">{errors.password}</p>}

//                 {/* Confirm Password */}
//                 <label className="label-signup">
//                     {/* <div>Confirm Password</div> */}
//                     <input
//                         type="password"
//                         placeholder="Confirm Password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         required
//                     />
//                 </label>
//                 {errors.confirmPassword && (
//                     <p className="errors">{errors.confirmPassword}</p>
//                 )}

//                 <button type="submit" disabled={isSignupDisabled}>Sign Up</button>
//             </form>
//         </>
//     );
// }

// export default SignupFormModal;




// // frontend/src/components/SignupFormModal/index.js
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// import * as sessionActions from "../../store/session";
// import "./SignupForm.css";

// function SignupFormModal() {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const { closeModal } = useModal();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (password === confirmPassword) {
//       setErrors({});
//       return dispatch(
//         sessionActions.signup({
//           email,
//           username,
//           firstName,
//           lastName,
//           password,
//         })
//       )
//         .then(closeModal)
//         .catch(async (res) => {
//           const data = await res.json();
//           if (data && data.errors) {
//             setErrors(data.errors);
//           }
//         });
//     }
//     return setErrors({
//       confirmPassword: "Confirm Password field must be the same as the Password field"
//     });
//   };

//   return (
//     <>
//       {/* <h1>Sign Up</h1> */}
//       <form onSubmit={handleSubmit} className="signup-form">
//         <label className="label-signup">
//         <div class="label-title">Email</div>
//           <input
//             type="text"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//         </label>
//         {errors.email && <p>{errors.email}</p>}
//         <label className="label-signup">
//           <div>Username</div>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </label>
//         {errors.username && <p>{errors.username}</p>}
//         <label className="label-signup">
//           <div>First Name</div>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//         </label>
//         {errors.firstName && <p>{errors.firstName}</p>}
//         <label className="label-signup">
//           <div>Last Name</div>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             required
//           />
//         </label>
//         {errors.lastName && <p>{errors.lastName}</p>}
//         <label className="label-signup">
//           <div>Password</div>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         {errors.password && <p>{errors.password}</p>}
//         <label className="label-signup">
//           <div>Confirm Password</div>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </label>
//         {errors.confirmPassword && (
//           <p>{errors.confirmPassword}</p>
//         )}
//         <button type="submit">Sign Up</button>
//       </form>
//     </>
//   );
// }

// export default SignupFormModal;
