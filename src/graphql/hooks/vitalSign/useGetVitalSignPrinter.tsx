import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const print_Sick = gql`
  query PrintSick($printSickId: ID!, $date: String) {
    printSick(id: $printSickId, date: $date) {
      id
      lastUpdate
      numberHistory
      diagnosis {
        id
        complaint
        physical_examination
        diagnosis
        recommendations
        medical_history
        createdAt
        updatedAt
      }
      age
      vitalSigns {
        id
        body_temperature
        heart_beat
        blood_pressure
        number_breaths
        blood_sugar
        oxygen_saturation
        createdAt
        updatedAt
      }
      person {
        id
        first_name
        last_name
        email
        phone
        address
        ID_number
        createdAt
      }
    }
  }
`;

interface Props {}

const useGetVitalSignPrinter = () => {
  let res = useLazyQuery(print_Sick);
  return res;
};

export default useGetVitalSignPrinter;
