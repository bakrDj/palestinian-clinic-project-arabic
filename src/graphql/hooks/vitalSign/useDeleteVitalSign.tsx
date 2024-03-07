import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Delete_VitalSigns = gql`
  mutation DeleteVitalSign($deleteVitalSignId: Int!) {
    DeleteVitalSign(id: $deleteVitalSignId) {
      id
    }
  }
`;

interface VariableProps {
  deleteVitalSignId?: number;
}

const useUpdateVitalSign = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Delete_VitalSigns, {
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

export default useUpdateVitalSign;
