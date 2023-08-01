
import { handleActions } from 'redux-actions';

import {
  CACHE_USER_INFO
} from '@state/action/actionType'

const initialState = {
  userInfo: {}
}

export default handleActions({
  [CACHE_USER_INFO]: (state, action) => ({ ...state, userInfo: action.payload }),
}, initialState)