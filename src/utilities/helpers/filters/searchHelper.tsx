import React from "react";
import dayjs from "dayjs";

interface Props {
  data: object[];
  iteration: string;
}

const searchHelper = (value: string, data: object[]) => {
  return data?.slice()?.filter(function (o: any) {
    return Object.keys(o)?.some(function (k) {
      console.log(
        "🚀 ~ file: searchHelper.tsx ~ line 14 ~ k",
        o?.[k]?.toString()?.toLowerCase()?.indexOf(value)
      );
      return o?.[k]?.toString()?.toLowerCase()?.indexOf(value) != -1;
    });
  });
};

export default searchHelper;
