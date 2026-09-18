import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { auth } from '../../firebase/firebase';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        await signInWithEmailAndPassword(auth, email, password);
        navigate('/admin');
      }}
    >
      <h1>Admin Login</h1>

      <label htmlFor="username">Username:</label>
      <input
        id="username"
        onChange={(event) => setEmail(event.target.value)}
        type="text"
      />

      <label htmlFor="password">Password:</label>
      <input
        id="password"
        onChange={(event) => setPassword(event.target.value)}
        type="password"
      />

      <button type="submit">Login</button>
    </form>
  );
}
