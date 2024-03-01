import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_Prescription = gql`
  query GetAllPrescriptionsByPatientID($patientsId: Int!) {
    GetAllPrescriptionsByPatientID(patientsId: $patientsId) {
      createdAt
      id
      patientsId
      title
      updatedAt
      Medicines {
        id
        giving
        duration
        createdAt
        name
        note
        prescriptionId
        quantity
        times_per_day
        updatedAt
      }
    }
  }
`;

interface Props {}

const useGetPrescription = ({ id }: { id: string | number }) => {
  let res = useLazyQuery(All_Prescription, {
    variables: {
      patientsId: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetPrescription;
