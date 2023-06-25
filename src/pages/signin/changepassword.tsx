import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useStore from "../../store/useStore";

interface Props {}

const ChangePW = (props: Props) => {
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
        // window.location.replace(`http://${location.host}/login?emailVerificationStatus=true`);
        route.push({
          pathname: "/signin/change-password",
          query: {
            token: route.query?.token as any,
          },
        });
      }
    } catch (error) {
      // window.location.replace(`http://${location.host}/login?emailVerificationStatus=false`);
      route.push({
        pathname: "/signin",
        query: {
          emailVerificationStatus: false,
        },
      });
    }
  };

  return "";
};

export default ChangePW;
