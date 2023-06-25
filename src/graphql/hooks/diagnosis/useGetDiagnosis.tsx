import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_Diagnosis = gql`
  query AllDiagnosis($idSick: ID) {
    allDiagnosis(id_sick: $idSick) {
      id
      complaint
      physical_examination
      diagnosis
      recommendations
      createdAt
      updatedAt
      medical_history
    }
  }
`;

interface Props {}

const useGetDiagnosis = ({ id }: { id: string }) => {
  let res = useLazyQuery(All_Diagnosis, {
    variables: {
      idSick: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetDiagnosis;
