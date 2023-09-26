import { User } from '../types/commonTypes';
import LocalStorageService from '../services/localStorage/LocalStorageService';
import { LocalStorageKeys } from '../services/localStorage/LocalStorageKeys';

export interface ContextState {
  userSettings: User;
  jwtToken: string;
}

const initialState = (): ContextState => {
  return {
    jwtToken: LocalStorageService.getItem(LocalStorageKeys.userAuthToken),
    userSettings: LocalStorageService.getItem<User>(
      LocalStorageKeys.userSettings,
      initUserSettings
    )
  };
};

export const initUserSettings: User = {
  id: '',
  publicAddress: '',
};

export default initialState;
