import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { createUser } from "../adapters/user-adapter";
import QuoteDisplay from "../components/QuoteDisplay";

// Controlling the sign up form is a good idea because we want to add (eventually)
// more validation and provide real time feedback to the user about usernames and passwords
export default function SignUpPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [errorText, setErrorText] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // users shouldn't be able to see the sign up page if they are already logged in.
  // if the currentUser exists in the context, navigate the user to 
  // the /users/:id page for that user, using the currentUser.id value
  if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText('');
    if (!firstName || !lastName || !email || !password) return setErrorText('Missing username or password');

    const [user, error] = await createUser({ firstName,lastName,email, password });
    if (error) return setErrorText(error.message);

    setCurrentUser(user);
    navigate('/');
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setErrorText('');
  //   // Check for missing fields
  //   if (!firstName || !lastName || !password) {
  //     return setErrorText('Missing first name, last name, or password');
  //   }
  
  //   // Include first_name and last_name in the payload
  //   const [user, error] = await createUser({
  //     first_name: firstName,
  //     last_name: lastName,
  //     email,
  //     password,
  //   });

  //   setCurrentUser(user);
  //   navigate('/');
  // };


  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setLastName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return <>
    <h1>Sign Up</h1>
    <form onSubmit={handleSubmit} onChange={handleChange} aria-labelledby="create-heading">
      <h2 id="create-heading">Create New User</h2>
      <label htmlFor="firstName">First Name</label>
      <input
        autoComplete="off"
        type="text"
        id="firstName"
        name="firstName"
        onChange={handleChange}
        value={firstName}
      />

<label htmlFor="lastName">Last Name</label>
      <input
        autoComplete="off"
        type="text"
        id="lastName"
        name="lastName"
        onChange={handleChange}
        value={lastName}
      />

<label htmlFor="email">Email</label>
      <input
        autoComplete="off"
        type="text"
        id="email"
        name="email"
        onChange={handleChange}
        value={email}
      />

      <label htmlFor="password">Password</label>
      <input
        autoComplete="off"
        type="password"
        id="password"
        name="password"
        onChange={handleChange}
        value={password}
      />

      {/* In reality, we'd want a LOT more validation on signup, so add more things if you have time
        <label htmlFor="password-confirm">Password Confirm</label>
        <input autoComplete="off" type="password" id="password-confirm" name="passwordConfirm" />
      */}

      <button>Sign Up Now!</button>
    </form>
    {!!errorText && <p>{errorText}</p>}
    {/* put this line below in the form? */}
    <p>Already have an account with us? <Link to="/login">Log in!</Link></p>
    <section className='quote-space'>
      <section className="quotesection">
        <QuoteDisplay />
      </section>
    </section>
  </>;
}
