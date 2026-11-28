import type { Employee, EmployeeData, Role, RoleData } from 'shared/interfaces/firestore-collections';

import { getIdTokenResult, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import { AuthContext } from '../context/AuthContext';
import { getCollectionConverter } from '../firebase/converters/collectionConverter';
import { auth, db } from '../firebase/firebase';

export function AuthProvider() {
  const [user, setUser] = useState<null | User>(auth.currentUser);
  const [roleData, setRoleData] = useState<RoleData>();
  const [employeeData, setEmployeeData] = useState<EmployeeData>();
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  if (user) {
    console.log('user.email: ', user.email);
    console.log('isSuperuser: ', isSuperuser);
    console.log('employeeData.email: ', employeeData?.email);
    console.log('roleData.name: ', roleData?.name);
  }

  useEffect(() => {
    async function getAdminUserData(user: User) {
      if (!user) {
        setEmployeeData(null);
        return;
      }

      const getAdminUserClaims = async (user: User) => {
        type AdminUserClaims = { admin: boolean; isSuperuser: boolean; };

        return (await getIdTokenResult(user, true)).claims as AdminUserClaims;
      };

      const adminUserClaims = await getAdminUserClaims(user);
      if (adminUserClaims.isSuperuser) {
        setIsSuperuser(true);
        setIsLoading(false);

        return;
      }
      setIsSuperuser(false);

      const employeeDocSnap = await getDoc(
        doc(db, collections.employees, user.uid)
          .withConverter(getCollectionConverter<Employee>(),
      ));

      if (employeeDocSnap.exists()) {
        const employeeData = { ...employeeDocSnap.data(), docId: employeeDocSnap.id };

        const roleDocSnap = await getDoc(
          doc(db, collections.roles, employeeData.role.docId)
            .withConverter(getCollectionConverter<Role>()),
        );
        const roleData = { ...roleDocSnap.data(), docId: roleDocSnap.id };

        setEmployeeData(employeeData);
        setRoleData(roleData);
      }

      setIsLoading(false);
    }


    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      getAdminUserData(user);
    });
  }, []);

  if (isLoading) {
    return null;
  } else if (!user) {
    // TODO: Make login required page to replace this redirect
    return <Navigate to={'/'} />;
  } else {
    return (
      <AuthContext value={{
        employeeData: employeeData,
        isLoading: isLoading,
        isSuperuser: isSuperuser,
        roleData: roleData,
        user: user,
      }}>
        <Outlet />
      </AuthContext>
    );
  }
}

