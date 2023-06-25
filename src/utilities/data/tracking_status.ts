import {
  blue,
  blueGrey,
  deepOrange,
  deepPurple,
  green,
  grey,
  lightGreen,
  lime,
  orange,
  purple,
  red,
  yellow,
} from "@mui/material/colors";

interface StatusProps {
  [key: number]: {
    nameAr: string;
    color: string;
  };
}

const box_cycle: StatusProps = {
  1: {
    nameAr: "طلب جديد",
    color: deepPurple["400"],
  },

  2: {
    nameAr: "تم الاستلام",
    color: grey["A700"],
  },
  3: {
    nameAr: "جاري الشحن",
    color: blue["500"],
  },
  4: {
    nameAr: "تم الشحن",
    color: lightGreen["A200"],
  },

  5: {
    nameAr: "تم التوصيل",
    color: green["A400"],
  },
};

const container_cycle: StatusProps = {
  6: {
    nameAr: "الحاوية فارغة",
    color: deepPurple["400"],
  },

  7: {
    nameAr: "قيد التعبئة",
    color: grey["A700"],
  },
  8: {
    nameAr: "الحاوية ممتلئة",
    color: blue["500"],
  },
  9: {
    nameAr: "قيد الشحن",
    color: lightGreen["A200"],
  },

  10: {
    nameAr: "تم الوصول",
    color: green["A400"],
  },
};

const traking_status: StatusProps = {
  0: {
    nameAr: "مسودة",
    color: "#5f9ea0",
  },
  ...box_cycle,
  ...container_cycle,
};

export default traking_status;
export { box_cycle, container_cycle };
