import classNames from 'classnames';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import type { FormMessage } from '../../interfaces/FormMessage';

import { auth } from '../../firebase/firebase';
import authentication from '../../styles/common-styles/Authentication.module.scss';
import { capitalize } from '../../utils/strings';
import styles from './AdminLogin.module.scss';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });

  const navigate = useNavigate();

  const makeAuthErrorCodeReadable = (errorCode: string) => {
    const errorMessage = errorCode.split('/')[1];
    const errorMessageSplit = errorMessage.split('-').map(word => capitalize(word));

    return errorMessageSplit.join(' ');
  };

  return (
    <div className={authentication.root}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Admin Login</h1>

        <form
          className={styles.authForm}
          onSubmit={async (event) => {
            event.preventDefault();

            try {
              await signInWithEmailAndPassword(auth, email, password);
              setFormMessage({ message: 'Logged-in successfully!', type: 'success' });
              navigate('/admin');
            } catch (error) {
              setFormMessage({ message: makeAuthErrorCodeReadable(error.code), type: 'error' });
            }
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

          <div
            className={classNames(
              formMessage.type === 'error' && styles.formMessageError,
              formMessage.type === 'success' && styles.formMessageSuccess,
            )}
          >
            {formMessage.message}
          </div>

          <button className={styles.formButton} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
