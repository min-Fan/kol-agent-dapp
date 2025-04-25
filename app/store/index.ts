// configureStore: store配置项
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
// combineReducers： 组合reducers目录下的所有reducer模块
import { combineReducers } from "redux";
// 数据持久化
import { persistStore, persistReducer } from "redux-persist";
// defaults to localStorage for web
import localForage from "localforage";

// 导入自己封装好的reducers
import userReducer, { UserState } from "./reducers/userSlice";
import { updateVersion } from "./global/actions";
import { DEFAULT_CHAIN } from "@/app/constants/chains";
// 持久化存储配置对象
const persistConfig = {
  key: "interface",
  storage: localForage.createInstance({
    name: "kol-link:redux",
  }),
  version: 0.9,
  throttle: 1000, // ms
  serialize: false,
  deserialize: false,
  migrate: (state: any) => {
    if (!state || state._persist?.version === persistConfig.version) {
      return Promise.resolve(state);
    }

    // 获取初始状态的所有键
    const initialState = {
      userReducer: {
        theme: "dark",
        isLoggedIn: false,
        chainId: DEFAULT_CHAIN.id,
        userInfo: {
          id: 0,
          username: "",
          email: "",
          identity: "",
          member_id: 0,
          member_name: "",
          token: "",
          is_x_authorizationed: false,
          screen_name: "",
          profile_image_url: "",
          description: "",
          details: {
            agent: {
              created: 0,
              total: 0,
            },
            current_member: {
              id: 0,
              name: "",
            },
            email: "",
            user_name: "",
          },
        },
        config: {
          region: [],
          language: [],
          character: [],
          topics: [],
          ability: [],
          price: [],
          kols: [],
          limit: {
            post: 0,
            repost: 0,
            likes: 0,
            quote: 0,
            reply: 0,
            comment: 0,
            agent: 0,
          },
          currentStep: 1,
        },
        from: {
          step1: {},
          step2: {},
          step3: {},
          step4: {},
          step5: {},
          step6: {},
        },
        twitter_full_profile: {},
        agents: [],
      } as UserState,
    };

    // 深度合并函数
    const deepMerge = (target: any, source: any) => {
      const result = { ...target };
      for (const key in source) {
        if (
          typeof source[key] === "object" &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else if (!(key in target)) {
          result[key] = source[key];
        }
      }
      return result;
    };

    // 过滤多余的键，只保留在 schema 中定义的键
    const filterExtraKeys = (data: any, schema: any): any => {
      if (!data || typeof data !== 'object' || typeof schema !== 'object') {
        return data;
      }
      
      // 对于数组，直接返回原始数据
      if (Array.isArray(data)) {
        return data;
      }
      
      const result: any = {};
      
      // 遍历 schema 的键，只保留 schema 中存在的键
      for (const key in schema) {
        if (key in data) {
          if (
            typeof schema[key] === 'object' && 
            schema[key] !== null && 
            typeof data[key] === 'object' && 
            data[key] !== null &&
            !Array.isArray(schema[key])
          ) {
            // 递归处理嵌套对象
            result[key] = filterExtraKeys(data[key], schema[key]);
          } else {
            result[key] = data[key];
          }
        } else {
          // 如果 data 中不存在该键，使用 schema 中的默认值
          result[key] = schema[key];
        }
      }
      
      return result;
    };

    // 合并状态，先补充缺失的键，然后过滤多余的键
    const mergedUserReducer = deepMerge(state.userReducer || {}, initialState.userReducer);
    const filteredUserReducer = filterExtraKeys(mergedUserReducer, initialState.userReducer);

    const newState = {
      ...state,
      userReducer: filteredUserReducer,
      _persist: {
        ...state._persist,
        version: persistConfig.version,
      },
    };

    return Promise.resolve(newState);
  },
};

// 持久化处理后的reducers
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    // 数据切片
    userReducer,
  })
);
// 将持久化插件和store通过middleware关联起来
const store = configureStore({
  // userReducer 模块名
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});

// 可以订阅 store
// store.subscribe(() => console.log(store.getState(), 'userSlice'))

// 持久化的store
const persistor = persistStore(store);

setupListeners(store.dispatch);

store.dispatch(updateVersion());

export { store, persistor };
