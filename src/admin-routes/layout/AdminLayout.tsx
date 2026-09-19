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
import { Link, Outlet, useLocation } from 'react-router';

import { adminPaths } from '../../constants/route-paths/adminPaths';
import { auth } from '../../firebase/firebase';
import styles from './AdminLayout.module.scss';

export function AdminLayout() {
  const location = useLocation();
  const currentPageEntry = Object.entries(adminPaths).find(([_, path]) => path == location.pathname);
  const currentPageHeading = currentPageEntry ? currentPageEntry[0] : '';

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
        <h1 className={styles.pageHeading}>
          {currentPageHeading}
        </h1>
        <Outlet />
      </main>
    </div>
  );
}
