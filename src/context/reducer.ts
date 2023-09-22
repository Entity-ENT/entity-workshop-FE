import { ContextState } from './state';
import LocalStorageService from '../services/localStorage/LocalStorageService';
import { LocalStorageKeys } from '../services/localStorage/LocalStorageKeys';

export type ContextAction =
  | {
      type: 'setJwtToken';
      jwtToken: ContextState['jwtToken'];
    }
  | {
      type: 'setUserSettings';
      userSettings: ContextState['userSettings'];
    }
  | {
      type: 'setAuthenticationData';
      jwtToken: ContextState['jwtToken'];
      userSettings: ContextState['userSettings'];
    };

export function reducer(
  state: ContextState,
  action: ContextAction
): ContextState {
  switch (action.type) {
    case 'setJwtToken': {
      const { jwtToken } = action;

      jwtToken
        ? LocalStorageService.setItem(LocalStorageKeys.userAuthToken, jwtToken)
        : LocalStorageService.removeItem(LocalStorageKeys.userAuthToken);

      return {
        ...state,
        jwtToken
      };
    }
    case 'setUserSettings': {
      const { userSettings } = action;
      LocalStorageService.setItem(LocalStorageKeys.userSettings, userSettings);
      return {
        ...state,
        userSettings
      };
    }
    case 'setAuthenticationData': {
      const { jwtToken, userSettings } = action;
      jwtToken
        ? LocalStorageService.setItem(LocalStorageKeys.userAuthToken, jwtToken)
        : LocalStorageService.removeItem(LocalStorageKeys.userAuthToken);

      LocalStorageService.setItem(LocalStorageKeys.userSettings, userSettings);

      return {
        ...state,
        jwtToken,
        userSettings
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}
