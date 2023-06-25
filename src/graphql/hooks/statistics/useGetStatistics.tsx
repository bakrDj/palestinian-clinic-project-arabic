import { useQuery } from "@apollo/client";
import { statistics } from "../../queries/statistics";

interface Props {}

const useGetStatistics = ({ id_client }: { id_client: string }) => {
  let { data, loading } = useQuery(statistics, {
    fetchPolicy: "network-only",
    variables: {
      idClient: id_client,
    },
  });

  return [data?.statisticsClient, loading];
};

export default useGetStatistics;
