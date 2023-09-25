import React, { FC, Suspense, useEffect, useState } from "react";
import { useGetAccountInfo, useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useContext, useDispatch } from "../../context";
import { useLocation } from "react-router-dom";
import LocalStorageService from "../../services/localStorage/LocalStorageService";
import { LocalStorageKeys } from "../../services/localStorage/LocalStorageKeys";
import { logout } from "../../helpers";
import { Spinner } from "react-bootstrap";
import { routes } from "../../routes";
import UsersService from "../../services/UsersService";

function isAuthRoute(pathname: string): boolean {
    const mappedRoute = routes.find((route) => pathname.includes(route.path));
    return mappedRoute ? !!mappedRoute.authenticatedRoute : false;
}

export async function doLogout() {
    LocalStorageService.removeItem(LocalStorageKeys.userAuthToken);
    LocalStorageService.removeItem(LocalStorageKeys.userSettings);

    await logout(`${window.location.origin}/unlock`);
}

const CheckAuth: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
    const { userSettings } = useContext();
    const { address } = useGetAccountInfo();
    const { isLoggedIn } = useGetLoginInfo();
    const { pathname } = useLocation();
    const loginInfo = useGetLoginInfo();
    const dispatch = useDispatch();

    const [isUserAuthAndReady, setIsAuthUserReady] = useState<boolean>(false);

    const setAuthToken = async () => {
        const storedUser = LocalStorageService.getItem(LocalStorageKeys.userSettings);
        if (loginInfo.tokenLogin?.nativeAuthToken && address && isLoggedIn) {
            if (userSettings.id === "" && (!storedUser || storedUser.id === "")) {
                LocalStorageService.setItem(LocalStorageKeys.userAuthToken, loginInfo.tokenLogin?.nativeAuthToken);
                const getUser = await UsersService.getInstance().checkUser(address);
                dispatch({
                    type: "setAuthenticationData",
                    jwtToken: loginInfo.tokenLogin?.nativeAuthToken,
                    userSettings: getUser,
                });
            }
        } else {
            if (userSettings.id !== "" && storedUser) {
                doLogout();
            }
        }
    };

    useEffect(() => {
        if (address && loginInfo.tokenLogin?.nativeAuthToken && isLoggedIn) {
            setAuthToken().catch(() => doLogout());
        }
    }, [address, loginInfo, isLoggedIn]);

    if (isAuthRoute(pathname) && !isUserAuthAndReady) {
        return <Spinner animation="border" />;
    }

    return (
        <Suspense fallback={<Spinner animation="border" />}>{children}</Suspense>
    );
};

export default CheckAuth;