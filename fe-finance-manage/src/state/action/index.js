import { createAction } from 'redux-actions';

import {
  CACHE_USER_INFO
} from './actionType'

export const cacheUserInfo = createAction(CACHE_USER_INFO, (data) => data);
