import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_NurseOrder = gql`
  query GetAllNurseTasksByPatientID($patientsId: Int!) {
    GetAllNurseTasksByPatientID(patientsId: $patientsId) {
      checked
      createdAt
      id
      note
      patientsId
      updatedAt
    }
  }
`;

interface Props {}

const useGetNurseDuty = ({ id }: { id: string | number }) => {
  let res = useLazyQuery(All_NurseOrder, {
    variables: {
      patientsId: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetNurseDuty;
