import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_Diagnosis = gql`
  query GetAllDiagnosesByPatientID($patientsId: Int!) {
    GetAllDiagnosesByPatientID(patientsId: $patientsId) {
      complaint
      createdAt
      diagnosis
      id
      medical_history
      patientsId
      physical_examination
      recommendations
      updatedAt
    }
  }
`;

interface Props {}

const useGetDiagnosis = ({ id }: { id: string | number }) => {
  let res = useLazyQuery(All_Diagnosis, {
    variables: {
      patientsId: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetDiagnosis;
