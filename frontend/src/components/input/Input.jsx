import { TextField } from "@mui/material";

function Input({
  labelName,
  type,
  className,
  isRequired,
  name,
  error,
  ...props
}) {
  return (
    <TextField
      name={name}
      required={isRequired}
      label={labelName}
      error={error}
      type={type}
      className={`${className} bg-[#edf2f65c] w-full max-w-md  `}
      {...props}
    />
  );
}

export default Input;
