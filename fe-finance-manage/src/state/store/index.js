import { createStore, applyMiddleware, compose } from 'redux';
import reducer from '@state/reducer';
import thunk from 'redux-thunk';
//加入浏览器redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
//加入thunk 异步中间件
const enhancer = composeEnhancers(applyMiddleware(thunk));
const store = createStore(reducer, enhancer);
export default store;
