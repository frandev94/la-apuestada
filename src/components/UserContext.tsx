import type { UserRecord } from '@/lib/db/user-repository';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface UserContextType {
  user: UserRecord | null;
  setUser: (user: UserRecord | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  initialUser,
}: { children: ReactNode; initialUser?: UserRecord | null }) {
  const [user, setUser] = useState<UserRecord | null>(initialUser ?? null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
