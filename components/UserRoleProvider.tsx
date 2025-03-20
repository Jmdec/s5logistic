"use client"; 

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const UserRoleContext = createContext<string | null>(null);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setUserRole(storedRole);
  }, []);

  return (
    <UserRoleContext.Provider value={userRole}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
