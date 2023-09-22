import React, { FC, Suspense, useEffect, useState } from 'react';
import { useGetAccountInfo, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useContext, useDispatch } from '../../context';
import { useLocation } from 'react-router-dom';
import LocalStorageService from '../../services/localStorage/LocalStorageService';
import { LocalStorageKeys } from '../../services/localStorage/LocalStorageKeys';
import { User } from '../../types/commonTypes';
import { logout } from '../../helpers';
import { Spinner } from 'react-bootstrap';
import { routes } from '../../routes';
import UsersService from '../../services/UsersService';
import { initUserSettings } from '../../context/state';

function isAuthRoute(pathname: string): boolean {
  const mappedRoute = routes.find((route) => pathname.includes(route.path));
  return mappedRoute ? !!mappedRoute.authenticatedRoute : false;
}

async function doLogout() {
  await logout(`${window.location.origin}/unlock`);
}

const CheckAuth: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { userSettings, jwtToken } = useContext();
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const loginInfo = useGetLoginInfo();

  const [isUserAuthAndReady, setIsAuthUserReady] = useState<boolean>(false);
  const [isSessionAlive] = useState<boolean>(
    LocalStorageService.getItem(LocalStorageKeys.isSessionAlive)
  );

  const setAuthToken = async () => {
    let jwtTokenInfo: string | undefined = jwtToken;
    let getUser: User | undefined = userSettings;

    if (isLoggedIn) {
      if (jwtTokenInfo && getUser && getUser.id) {
        setIsAuthUserReady(true);
        return;
      }

      if (!jwtTokenInfo) {
        jwtTokenInfo = loginInfo.tokenLogin?.nativeAuthToken;
        if (jwtTokenInfo) {
          LocalStorageService.setItem(
            LocalStorageKeys.userAuthToken,
            jwtTokenInfo
          );
        }
      }

      if (jwtTokenInfo && !getUser.id) {
        getUser = await UsersService.getInstance().checkUser(address);
      }

      if (jwtTokenInfo && getUser && getUser.id) {
        setIsAuthUserReady(true);
        dispatch({
          type: 'setAuthenticationData',
          jwtToken: jwtTokenInfo,
          userSettings: getUser
        });
      } else {
        await doLogout();
      }
    } else {
      if (jwtTokenInfo || (getUser && getUser.id)) {
        await doLogout();
      }

      if (
        LocalStorageService.getItem(LocalStorageKeys.userSettings) ||
        LocalStorageService.getItem(LocalStorageKeys.userAuthToken)
      ) {
        LocalStorageService.removeItem(LocalStorageKeys.userSettings);
        LocalStorageService.removeItem(LocalStorageKeys.userAuthToken);
        dispatch({
          type: 'setAuthenticationData',
          jwtToken: '',
          userSettings: initUserSettings
        });
      }
    }
  };

  useEffect(() => {
    if (!isSessionAlive) {
      if (isLoggedIn) {
        doLogout();
      }
      LocalStorageService.setItem(LocalStorageKeys.isSessionAlive, true);
    }
  }, [isSessionAlive]);

  useEffect(() => {
    setAuthToken().catch(() => doLogout());
  }, []);

  if (isAuthRoute(pathname) && !isUserAuthAndReady) {
    return <Spinner animation='border' />;
  }

  return (
    <Suspense fallback={<Spinner animation='border' />}>{children}</Suspense>
  );
};

export default CheckAuth;
