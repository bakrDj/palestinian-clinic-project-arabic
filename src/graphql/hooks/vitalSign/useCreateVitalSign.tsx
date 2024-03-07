import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Create_VitalSign = gql`
  mutation CreateVitalSign($data: VitalSignInputType) {
    CreateVitalSign(data: $data) {
      blood_sugar
      blood_pressure
      body_temperature
      createdAt
      heart_beat
      id
      number_breaths
      oxygen_saturation
      patientsId
      updatedAt
    }
  }
`;

interface VariableProps {
  data: {
    blood_pressure?: string;
    blood_sugar?: string;
    body_temperature?: string;
    heart_beat?: string;
    number_breaths?: string;
    oxygen_saturation?: string;
    patientsId: number;
  };
}

const useCreateVitalSign = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Create_VitalSign, {
    //   update: (cache, { data: { createBox } }) => {
    //     cache.modify({
    //       fields: {
    //         boxClient(existedBoxes = [], { readField }) {
    //           return [...existedBoxes, createBox];
    //         },
    //       },
    //     });
    //   },
  });
  return res;
};

export default useCreateVitalSign;
