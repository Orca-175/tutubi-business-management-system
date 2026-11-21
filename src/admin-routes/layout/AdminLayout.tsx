import classNames from 'classnames';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import {
  BiLogOut,
  BiMenu,
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

  const [sidebarShown, setSidebarShown] = useState(false);

  return (
    <div className={styles.root}>
      {sidebarShown &&
        <div
          className={styles.sidebarBackground}
          onClick={() => setSidebarShown(prev => !prev)}
        ></div>
      }

      <nav
        className={classNames(
          styles.sidebar,
          sidebarShown && styles.sidebarShown,
        )}
      >
        <h1 className={styles.brand}>Tutubi</h1>

        <ul>
          <li>
            <Link to={adminPaths.Home}>
              <BiSolidHome />
              <div>Home</div>
            </Link>
          </li>
          <li>
            <Link to={adminPaths.Inventory}>
              <BiSolidCylinder />
              <div>Inventory</div>
            </Link>
          </li>
          <li>
            <Link to={adminPaths.Ledger}>
              <BiSolidBookOpen />
              <div>Ledger</div>
            </Link>
          </li>
          <li>
            <Link to={adminPaths.Orders}>
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
        <div className={styles.pageHeading}>
          <div>
            <button
              className={styles.menuButton}
              onClick={() => setSidebarShown(prev => !prev)}
            >
              <BiMenu />
            </button>
          </div>

          <h1>{currentPageHeading}</h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
