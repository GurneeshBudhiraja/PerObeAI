import React from "react";

function FormSubmitButton({ ...props }) {
  return (
    <>
      <input type="submit" {...props} />
    </>
  );
}

export default FormSubmitButton;
