import {
  IconButton,
  InputAdornment,
  outlinedInputClasses,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  textFieldClasses,
  TextFieldProps,
} from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
import { styled } from "@mui/system";
import React from "react";
import { Plus, Search as SearchIcon, X } from "react-feather";
import { slate } from "../../styles/theme";

export interface Props extends Omit<OutlinedTextFieldProps, "size"> {
  size?: "xsmall" | "small" | "medium";
  onResetClick?: () => any;
}

const StyledTextField = styled(TextField)(({ theme, color }: { theme: any; color?: any }) => {
  return {
    ...theme.typography["2xs"],
    backgroundColor: `${slate[100]} !important`,
    borderRadius: 24,

    "& .MuiInputAdornment-root": {
      height: "auto",

      "& svg": {
        width: 18,
        height: 18,
        verticalAlign: "middle",
        color: theme.palette.primary.light,
      },
    },

    "& .MuiOutlinedInput-input": {
      ...theme.typography["xs"],
      backgroundColor: `${slate[100]} !important`,
      border: "unset",
      borderRadius: 24,
    },
    [`&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline`]: {
      border: `2px solid ${grey[300]}`,
      borderWidth: 2,
    },

    [`& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline`]: {
      border: "unset",
    },

    [`& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline`]: {
      border: `2px solid ${grey[300]}`,
      // borderColor: grey[700],
      borderColor: theme.palette[color || "primary"].main,
      // outline: `2px solid ${theme.palette[color || 'primary'].main}`
    },

    "& .MuiOutlinedInput-input.MuiInputBase-input.MuiInputBase-inputSizeSmall": {
      height: "34px",
      padding: "0 6px",
      paddingLeft: 4,
      background: "#FFF",
      borderWidth: 2,
      // color: grey[200],
    },

    [`& .MuiOutlinedInput-notchedOutline`]: {
      borderWidth: 2,
      borderRadius: 24,
    },
  };
});

const Search = (props: Props) => {
  return (
    <>
      <StyledTextField
        {...(props as any)}
        size={"small"}
        // sx={{ position: "absolute", left: 0 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: props.value && (
            <IconButton
              size="small"
              style={{ marginLeft: "-6px" }}
              onClick={() => typeof props.onResetClick == "function" && props.onResetClick()}
            >
              <X size="16" />
            </IconButton>
          ),
        }}
      ></StyledTextField>
    </>
  );
};

export default Search;
