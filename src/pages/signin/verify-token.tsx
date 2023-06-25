import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useStore from "../../store/useStore";

interface Props {}

const VerifyToken = (props: Props) => {
  // const [authenticateClientMutation, { data }] = useAuthenticateClient();
  // const [getCurrentUserLazy] = useGetCurrentUser();
  const route = useRouter();

  // Watchers

  useEffect(() => {
    emailVerificationHandler();
  }, [route.push]);

  useEffect(() => {
    useStore.setState({ isLayoutDisabled: true });
  }, []);

  let emailVerificationHandler = async () => {
    try {
      let token = await jwtDecode(route.query?.token as any);
      let location = window.location;
      if (token) {
        route.push({
          pathname: "/signin",
          query: {
            emailVerificationStatus: true,
          },
        });
      }
    } catch (error) {
      route.push({
        pathname: "/signin",
        query: {
          emailVerificationStatus: false,
        },
      });
      // route.push("/login", {});
    }
  };

  return "";
};

export default VerifyToken;
