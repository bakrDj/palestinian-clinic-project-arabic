import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  concat,
  from,
  ApolloLink,
  Observable,
  fromPromise,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Slide } from "@mui/material";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";
import "dayjs/locale/ar-dz"; // ES 2015
// import "dayjs/locale/he"; // ES 2015
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { ConfigProvider } from "react-avatar";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import Layout from "../components/generated/Layout";
import useStore from "../store/useStore";
import "../styles/globals.css";
import theme from "../styles/theme";
import avatar_colors from "../styles/theme/avatar_colors";
import { ProtectedPage, useAuth } from "../utilities/helpers/Auth";
import SocketClient from "../utilities/lib/socket";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

import Router from "next/router";
import { REFRESH_TOKEN } from "../graphql/hooks/users/useGetNewToken";
import PullToRefresh from "react-simple-pull-to-refresh";
import { createUploadLink } from "apollo-upload-client";
import { LocalizationProvider } from "@mui/lab";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

/****| DayJS related code |****/

dayjs.locale("ar-dz");
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

/****| Theme related code |****/

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

theme.direction = "rtl";

function RTL(props: any) {
  return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

/****| Apollo related code |****/

let client: ApolloClient<NormalizedCacheObject> | undefined = undefined;

const authLink = setContext((_, { headers, operationName }) => {
  const token = (useStore.getState() as any).token;

  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
      "x-apollo-operation-name": operationName,
      "apollo-require-preflight": true,
    },
  };
});

let isRefreshing: boolean;
let pendingRequests: Function[] = [];
const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    const { extensions, path, message, locations } = graphQLErrors[0];

    const { authorization } = operation.getContext().headers;
    if (extensions.code === "UNAUTHENTICATED" && path?.[0] != "refreshToken") {
      let innerForward;
      if (!isRefreshing) {
        isRefreshing = true;
        innerForward = fromPromise(
          useAuth(client)
            .checkRefreshToken()
            .then(() => {
              resolvePendingRequests();
              return true;
            })
            .catch(() => {
              pendingRequests = [];
              return false;
            })
            .finally(() => {
              isRefreshing = false;
            })
        ).filter((value) => Boolean(value));
      } else {
        innerForward = fromPromise(
          new Promise<void>((resolve) => {
            pendingRequests.push(() => resolve());
          })
        );
      }

      return innerForward.flatMap(() => {
        return forward(operation);
      });
    } else {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    }
  }
});

// const httpLink = createHttpLink({
//   // uri: "https://rrkpgd2a7f.qafilaty.com/graphql",
//   uri: "https://deliveryapi-5050.qafilaty.com/graphql",
//   credentials: "include",
// });
const httpLink = createUploadLink({
  uri: "http://localhost:4001/graphql",
  credentials: "include",
});

let cache = new InMemoryCache();
client = new ApolloClient({
  // link: errorLink.concat(authLink.concat(httpLink)),
  link: from([errorLink, authLink, httpLink]),
  cache: cache,
  credentials: "include",
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: "cache-and-network",
  //   },
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   mutate: {
  //     fetchPolicy: "network-only",
  //   },
  // },

  // uri: "https://api.qafilaty.com/graphql",
});

cache.policies.addTypePolicies({
  PickUPGroup: {
    keyFields: ["code"],
  },
});

/****| Snackbar configs |****/

const defaultSnackbarProps = {
  maxSnack: 2,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "right",
  },
  autoHideDuration: 3000,
  // @ts-ignore
  TransitionComponent: (props) => <Slide {...props} direction="right" />,
};

// console.log = () => {};

function MyApp({ Component, pageProps }: AppProps) {
  const isLayoutDisabled = useStore((state: any) => state.isLayoutDisabled);
  const userData = useStore((state: any) => state.userData);
  const [isUserDataAvailable] = useState(userData);
  // useEffect(() => {
  //   if (Object.keys(userData ?? {}).length) {
  //     const socket = new SocketClient({
  //       client_id: userData?.id,
  //       stock_id: null,
  //       user_id: userData?.user?.id,
  //       user_username: userData?.user?.user_name,
  //     });
  //     socket.connect(client);
  //   }

  //   // return () => {
  //   //   socket.disconnect();
  //   // };
  // }, [userData]);

  return (
    <RTL>
      <MUIThemeProvider theme={theme}>
        <ApolloProvider client={client as any}>
          <ProtectedPage client={client}>
            <SnackbarProvider {...(defaultSnackbarProps as any)}>
              <ConfigProvider colors={avatar_colors}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Layout disabled={isLayoutDisabled}>
                    <Component {...pageProps} />
                  </Layout>
                </LocalizationProvider>
              </ConfigProvider>
            </SnackbarProvider>
          </ProtectedPage>
        </ApolloProvider>
      </MUIThemeProvider>
    </RTL>
  );
}

export default MyApp;
