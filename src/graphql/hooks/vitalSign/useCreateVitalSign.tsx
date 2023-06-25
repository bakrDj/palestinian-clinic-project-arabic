import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationTuple,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import { Box } from "react-feather";

export const Create_VitalSigns = gql`
  mutation CreateVitalSigns($content: contentVitalSigns) {
    createVitalSigns(content: $content) {
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
  }
`;

interface VariableProps {
  content: {
    body_temperature: string;
    heart_beat: string;
    blood_pressure: string;
    number_breaths: string;
    blood_sugar: string;
    oxygen_saturation: string;
    id_sick: string;
  };
}

const useCreateVitalSign = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Create_VitalSigns, {
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
