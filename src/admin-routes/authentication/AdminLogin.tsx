import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { auth } from '../../firebase/firebase';
import authentication from '../../styles/common-styles/Authentication.module.scss';
import styles from './AdminLogin.module.scss';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  return (
    <div className={authentication.root}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Admin Login</h1>

        <form
          className={styles.authForm}
          onSubmit={async (event) => {
            event.preventDefault();

            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
          }}
        >
          <div className={styles.formInput}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              type="text"
            />
          </div>

          <div className={styles.formInput}>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </div>

          <button className={styles.formButton} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
