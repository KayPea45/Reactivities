import { TextField, TextFieldProps } from "@mui/material";
import { FieldValues, useController, UseControllerProps } from "react-hook-form"

// & inherits and allows us to use the props in the Props class as defined when 
// we pass the props in useController
// take in generic type inhereting FieldValues from reacthookform to ensure our zod validation is working with our custom field component, due to the activitySchema.ts file
type Props<T extends FieldValues> = UseControllerProps<T> & TextFieldProps // from react-hook-form and mui material

export default function TextInput<T extends FieldValues>(props: Props<T>) {

   // useController takes in generic type of FieldValues
   // The field object contains all the necessary properties and methods to connect your input component to the form state. It includes properties like value, onChange, onBlur, and name, which are essential for managing the input's state and behavior.
   // The fieldState object contains metadata about the current state of the field, such as whether it has an error, whether it has been touched, or whether it is dirty (i.e., its value has changed from the initial value).
   // e.g. the control property we passed in ActivityForm.tsx to the TextInput component is destructured here in useController via props
   const {field, fieldState} = useController({...props});

  return (
   // TextField properties that we've been using in ActivityForm are passed
    <TextField 
      {...props}
      {...field}
      value={field.value || ''} // fix issue with uncontrolled input error
      fullWidth
      variant="outlined"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  )
}