import classNames from 'classnames';
import { signOut } from 'firebase/auth';
import { type ReactNode, useContext, useState } from 'react';
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

import { adminPageNames } from '../../constants/adminPageNames';
import { adminPaths } from '../../constants/route-paths/adminPaths';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../firebase/firebase';
import styles from './AdminLayout.module.scss';

interface NavItemProps {
  children: ReactNode;
  pageName: string;
}

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
          <NavItem
            pageName={adminPageNames.inventory}
          >
            <li>
              <Link to={adminPaths.Inventory}>
                <BiSolidCylinder />
                <div>Inventory</div>
              </Link>
            </li>
          </NavItem>

          <NavItem
            pageName={adminPageNames.ledger}
          >
            <li>
              <Link to={adminPaths.Ledger}>
                <BiSolidBookOpen />
                <div>Ledger</div>
              </Link>
            </li>
          </NavItem>

          <NavItem
            pageName={adminPageNames.orders}
          >
            <li>
              <Link to={adminPaths.Orders}>
                <BiSolidNotepad />
                <div>Orders</div>
              </Link>
            </li>
          </NavItem>

          <NavItem
            pageName={adminPageNames.purchases}
          >
            <li>
              <Link to="/">
                <BiSolidPurchaseTag />
                <div>Purchases</div>
              </Link>
            </li>
          </NavItem>


          <NavItem
            pageName={adminPageNames.purchases}
          >
            <li>
              <Link to={adminPaths.Staff}>
                <BiSolidGroup />
                <div>Staff</div>
              </Link>
            </li>
          </NavItem>

          <NavItem
            pageName={adminPageNames.clients}
          >
            <li>
              <Link to="/">
                <BiSolidContact />
                <div>Clients</div>
              </Link>
            </li>
          </NavItem>

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

      <div className={styles.mainContainer}>
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
    </div>
  );
}

function NavItem({ children, pageName }: NavItemProps) {
  const { isSuperuser, roleData } = useContext(AuthContext);

  if (!isSuperuser) {
    return roleData.pagePermissions[pageName]?.read && children ;
  }

  return children;
}

