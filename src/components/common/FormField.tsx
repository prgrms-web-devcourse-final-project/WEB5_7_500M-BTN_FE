import React from "react";
import {
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";

interface BaseFieldProps {
  name: string;
  label: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
}

interface TextFieldProps extends BaseFieldProps {
  type: "text" | "email" | "password" | "number" | "tel";
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{ value: string | number; label: string }>;
}

type FormFieldProps = TextFieldProps | SelectFieldProps;

const FormField: React.FC<FormFieldProps> = (props) => {
  const {
    name,
    label,
    error,
    touched,
    required = false,
    disabled = false,
    fullWidth = true,
    size = "medium",
  } = props;

  const showError = touched && error;

  if (props.type === "select") {
    return (
      <FormControl
        fullWidth={fullWidth}
        size={size}
        error={!!showError}
        disabled={disabled}
        required={required}
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          value={props.value}
          label={label}
          onChange={(e) => props.onChange(e.target.value)}
        >
          {props.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {showError && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <TextField
      name={name}
      label={label}
      type={props.type}
      value={props.value}
      onChange={(e) => {
        const value =
          props.type === "number" ? Number(e.target.value) : e.target.value;
        props.onChange(value);
      }}
      error={!!showError}
      helperText={showError ? error : undefined}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      placeholder={props.placeholder}
      multiline={props.multiline}
      rows={props.rows}
      inputProps={{
        maxLength: props.maxLength,
      }}
    />
  );
};

// 특정 타입별 폼 필드 컴포넌트들
export const TextFormField: React.FC<Omit<TextFieldProps, "type">> = (
  props
) => <FormField {...props} type="text" />;

export const EmailFormField: React.FC<Omit<TextFieldProps, "type">> = (
  props
) => <FormField {...props} type="email" />;

export const PasswordFormField: React.FC<Omit<TextFieldProps, "type">> = (
  props
) => <FormField {...props} type="password" />;

export const NumberFormField: React.FC<Omit<TextFieldProps, "type">> = (
  props
) => <FormField {...props} type="number" />;

export const PhoneFormField: React.FC<Omit<TextFieldProps, "type">> = (
  props
) => <FormField {...props} type="tel" />;

export const SelectFormField: React.FC<SelectFieldProps> = (props) => (
  <FormField {...props} />
);

export default FormField;
