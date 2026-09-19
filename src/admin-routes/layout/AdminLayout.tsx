import { signOut } from 'firebase/auth';
import {
  BiLogOut,
  BiSolidBookOpen,
  BiSolidContact,
  BiSolidCylinder,
  BiSolidGroup,
  BiSolidHome,
  BiSolidNotepad,
  BiSolidPurchaseTag,
} from 'react-icons/bi';
import { Link, Outlet } from 'react-router';

import { auth } from '../../firebase/firebase';
import styles from './AdminLayout.module.scss';

export function AdminLayout() {
  return (
    <div className={styles.root}>
      <nav className={styles.sidebar}>
        <h1 className={styles.brand}>Tutubi</h1>

        <ul>
          <li>
            <Link to="/admin">
              <BiSolidHome />
              <div>Home</div>
            </Link>
          </li>
          <li>
            <Link to="/">
              <BiSolidCylinder />
              <div>Inventory</div>
            </Link>
          </li>
          <li>
            <Link to="/">
              <BiSolidBookOpen />
              <div>Ledger</div>
            </Link>
          </li>
          <li>
            <Link to="/">
              <BiSolidNotepad />
              <div>Orders</div>
            </Link>
          </li>
          <li>
            <Link to="/">
              <BiSolidPurchaseTag />
              <div>Purchases</div>
            </Link>
          </li>
          <li>
            <Link to="/">
              <BiSolidGroup />
              <div>Staff</div>
            </Link>
          </li>
          <li>
            <Link to="/">
              <BiSolidContact />
              <div>Clients</div>
            </Link>
          </li>

          <li className={styles.bottomNavItems}>
            <button
              className={styles.logoutButton}
              onClick={(event) => {
                event.preventDefault();
                signOut(auth);
              }}
            >
              <BiLogOut />
              <div>Logout</div>
            </button>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
