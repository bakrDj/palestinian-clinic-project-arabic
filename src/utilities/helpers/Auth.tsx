import React, { FC, FunctionComponent, ReactElement, ReactNode, useEffect } from "react";
import useStore from "../../store/useStore";
import decode from "jwt-decode";
import { useGetCurrentUser, useGetNewToken } from "../../graphql/hooks/users";
import Route, { useRouter } from "next/router";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { REFRESH_TOKEN } from "../../graphql/hooks/users/useGetNewToken";
import { CURRENT_USER } from "../../graphql/hooks/users/useGetCurrentUser";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Box } from "@mui/material";
import { BeatLoader, ClockLoader } from "react-spinners";

const useAuth = (client: ApolloClient<NormalizedCacheObject> | undefined) => {
  // const [getCurrentUserLazy]: any = useGetCurrentUser();
  // const [getNewTokenLazy]: any = useGetNewToken();
  // let token = useStore((state: any) => state.token);
  // let userData = useStore.getState()?.userData;
  // let route = useRouter();
  let token = (useStore.getState() as any)?.token;

  let checkAuth = async ({ googleAccountId }: { googleAccountId?: String } = {}) => {
    // await checkRefreshToken();
    await getCurrentUserData({ googleAccountId });
    return true;
  };

  let checkRefreshToken = async () => {
    let currentDate = new Date();
    let decodedJWT: any = token && decode(token);

    if (!decodedJWT || decodedJWT.exp * 1000 < currentDate.getTime()) {
      await client
        ?.query({
          query: REFRESH_TOKEN,
          fetchPolicy: "network-only",
        })
        .then(
          ({ data }) => {
            let refreshToken = data?.refreshToken;
            if (refreshToken?.token) {
              useStore.setState({
                isAuth: true,
                token: refreshToken.token,
              });

              if (Route.pathname == "/signin") Route.push("/");
              return;
            }
          },
          (error) => {
            useStore.setState({
              isAuth: false,
              token: "",
            });
            Route.push("/signin");
          }
        );
    }
    // else {
    //   // Route.push("/signin");
    // }
    return true;
  };

  let getCurrentUserData = async ({ googleAccountId }: { googleAccountId?: String } = {}) => {
    await client
      ?.query({
        query: CURRENT_USER,
        variables: {
          googleAccountId: googleAccountId,
        },
      })
      .then(
        ({ data }) => {
          let currentUser = data?.GetOneUserByGoogleId[0];
          if (!currentUser) {
            Route.push("/signin");
            useStore.setState({ userData: {} });
          } else {
            useStore.setState({ userData: currentUser });
          }
        },
        (err) => {
          useStore.setState({ userData: {} });
        }
      );
  };

  return {
    checkAuth,
    // checkRefreshToken,
  };
};

interface Props {
  client?: any;
  children?: any;
}

const ProtectedPage = ({ client, children }: Props): any => {
  // let isAuth = useStore((state: any) => state.isAuth);
  let isAuth = (useStore.getState() as any)?.isAuth;
  let userData = useStore((state: any) => state.userData);

  const [loading, setloading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  let route = useRouter();

  const { checkAuth } = useAuth(client);
  // const auth = auth();

  useEffect(() => {
    (async function () {
      /* chack role */
      // if (route.pathname == "/users" && userData?.role == "Nurse") {
      //   route.push("/");
      // }

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in
          // console.log("User is signed in:", user?.uid);
          setIsAuthenticated(!!user);
          await checkAuth({ googleAccountId: user?.uid }).finally(() => setloading(false));
        } else {
          // User is signed out
          console.log("User is signed out");
          Route.push("/signin");
          route.events.on("routeChangeComplete", () => {
            console.log("completed");
            setloading(false);
            setIsAuthenticated(["/signin"].includes(route.pathname) || !!user);
            // window.location.reload();
          });
          console.log(
            "🚀 ~ file: Auth.tsx:140 ~ ProtectedPage ~ isAuthenticated:",
            isAuthenticated,
            ["/signin"].includes(route.pathname)
          );
        }
      });
    })();
  }, []);

  if (/* isAuthenticated */ loading)
    return (
      <>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <BeatLoader color="rgb(53, 142, 144)" />
        </Box>
      </>
    );
  return <>{/* isAuthenticated &&  */ children}</>;
};

export { useAuth, ProtectedPage };
