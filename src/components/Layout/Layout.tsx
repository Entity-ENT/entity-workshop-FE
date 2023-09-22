import React from 'react';
import { useLocation } from 'react-router-dom';
import { AuthenticatedRoutesWrapper } from 'components';
import { routeNames, routes } from 'routes';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import CheckAuth from './CheckAuth';
import { ContextProvider } from 'context';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation();
  return (
    <div className='bg-light d-flex flex-column flex-fill wrapper'>
      <Navbar />
      <main className='d-flex flex-column flex-grow-1'>
        <ContextProvider>
          <AuthenticatedRoutesWrapper
            routes={routes}
            unlockRoute={`${routeNames.unlock}${search}`}
          >
            <CheckAuth>{children}</CheckAuth>
          </AuthenticatedRoutesWrapper>
        </ContextProvider>
      </main>
      <Footer />
    </div>
  );
};
