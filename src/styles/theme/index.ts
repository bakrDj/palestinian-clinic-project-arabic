import { amber, blue, blueGrey, purple, red } from "@mui/material/colors";
// import { createTheme } from "@mui/material";
import { createTheme as MuiTheme } from "@mui/material";
import { createTheme } from "@mui/material/styles";

let defaultTheme = MuiTheme();

let fontScales = {
  "6xl": "36px !important",
  "5xl": "32px !important",
  "4xl": "29px !important",
  "3xl": "26px !important",
  "2xl": "23px !important",
  xl: "20px !important",
  lg: "18px !important",
  base: "16px !important",
  sm: "14px !important",
  xs: "13px !important",
  "2xs": "11px !important",
  "3xs": "10px !important",
};

export let slate = {
  50: "#F8FAFF",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
};

export let primary = {
  50: "rgba(230, 241, 241, 1)",
  100: "rgba(177, 211, 212, 1)",
  200: "rgba(139, 190, 191, 1)",
  300: "rgba(85, 161, 162, 1)",
  400: "rgba(53, 142, 144, 1)",
  500: "rgba(2, 114, 116, 1)",
  600: "rgba(2, 104, 106, 1)",
  700: "rgba(1, 81, 82, 1)",
  800: "rgba(1, 63, 64, 1)",
  900: "rgba(1, 48, 49, 1)",
};
export let secondary = {
  50: "rgba(249, 243, 230, 1)",
  100: "rgba(236, 216, 177, 1)",
  200: "rgba(226, 198, 139, 1)",
  300: "rgba(213, 171, 86, 1)",
  400: "rgba(205, 155, 53, 1)",
  500: "rgba(193, 130, 3, 1)",
  600: "rgba(176, 118, 3, 1)",
  700: "rgba(137, 92, 2, 1)",
  800: "rgba(106, 72, 2, 1)",
  900: "rgba(81, 55, 1, 1)",
};

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat-Arabic", "sans-serif"].join(","),
    // h1: undefined,
    // h2: undefined,
    // h3: undefined,
    // h4: undefined,
    // h5: undefined,
    // h6: undefined,
    // subtitle1: undefined,
    // subtitle2: undefined,
    // body1: undefined,
    // body2: undefined,
    // button: undefined,
    // caption: undefined,
    // overline: undefined,

    // @ts-ignore
    "6xl": {
      margin: 0,
      fontSize: fontScales["6xl"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    "5xl": {
      margin: 0,
      fontSize: fontScales["5xl"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    "4xl": {
      margin: 0,
      fontSize: fontScales["4xl"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    "3xl": {
      margin: 0,
      fontSize: fontScales["3xl"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    "2xl": {
      margin: 0,
      fontSize: fontScales["2xl"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    xl: {
      margin: 0,
      fontSize: fontScales["xl"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    lg: {
      margin: 0,
      fontSize: fontScales["lg"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    base: {
      margin: 0,
      fontSize: fontScales["base"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    sm: {
      margin: 0,
      fontSize: fontScales["sm"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    xs: {
      margin: 0,
      fontSize: fontScales["xs"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    "2xs": {
      margin: 0,
      fontSize: fontScales["2xs"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
    "3xs": {
      margin: 0,
      fontSize: fontScales["3xs"],
      lineHeight: "120%",
      fontWeight: 400,
      fontFamily: ["Montserrat-Arabic"],
    },
  },
  palette: {
    primary: {
      main: /* "#7d749e" */ primary[400],
    },
    secondary: {
      main: secondary[400],
    },
    error: {
      main: red[200],
    },
    background: {
      ...defaultTheme.palette.background,
      body: slate[50],
    } as any,
  },
  shadows: [
    ...defaultTheme.shadows,
    // [25]
    {
      shadow1: "0px 2px 4px -2px rgba(24, 39, 75, 0.12), 0px 4px 4px -2px rgba(24, 39, 75, 0.08)",
      shadow2: "0px 4px 6px -4px rgba(24, 39, 75, 0.12), 0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
      shadow3: "0px 6px 8px -6px rgba(24, 39, 75, 0.12), 0px 8px 16px -6px rgba(24, 39, 75, 0.08)",
      shadow4: "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
      shadow5: "0px 6px 14px -6px rgba(24, 39, 75, 0.12), 0px 10px 32px -4px rgba(24, 39, 75, 0.1)",
      elevation1: "0px 0px 0px 0.8px rgba(0, 0, 0, 0.12)",
      elevation2: "0px 0.4px 1px 0.8px rgba(0, 0, 0, 0.13)",
      elevation3: "0px 0.8px 2px 0.8px rgba(0, 0, 0, 0.14)",
      elevation4: "0px 1.2px 3px 0.8px rgba(0, 0, 0, 0.15)",
      elevation5: "0px 1.6px 4px 0.8px rgba(0, 0, 0, 0.16)",
    },
    // [26]
    {
      twShadow1: "0px 2px 4px -2px rgba(24, 39, 75, 0.12), 0px 4px 4px -2px rgba(24, 39, 75, 0.08)",
    },
  ] as any,
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          ":hover": {
            border: "unset",
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
