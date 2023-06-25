import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const prescription = gql`
  query Prescription($prescriptionId: ID) {
    prescription(id: $prescriptionId) {
      id
      title
      createdAt
      updatedAt
      medicines {
        id
        name
        quantity
        times_per_day
        duration
        note
        giving
      }
      sick {
        id
        person {
          id
          first_name
          last_name
          email
          phone
          address
          ID_number
        }
      }
    }
  }
`;

interface Props {}

const useGetOnePrescription = () => {
  let res = useLazyQuery(prescription);
  return res;
};

export default useGetOnePrescription;
