import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import {
	FieldValues,
	useController,
	UseControllerProps,
} from "react-hook-form";

type Props<T extends FieldValues> = {
	items: { text: string; value: string }[];
	label: string;
} 
& UseControllerProps<T> // from react-hook-form
& Partial<SelectInputProps>; // from mui material. Partial is to make the props optional, else if we dont have this then we are forced to add the required props that SelectInputProps is asking us add. 

export default function SelectInput<T extends FieldValues>(props: Props<T>) {
	const { field, fieldState } = useController({ ...props });

	return (
		// TextField properties that we've been using in ActivityForm are passed
		<FormControl fullWidth error={!!fieldState.error}>
			<InputLabel>{props.label}</InputLabel>
         <Select 
            value={field.value || ''}
            label={props.label}
            onChange={field.onChange}
         >
            {props.items.map(item => (
               <MenuItem key={item.value} value={item.value}>
                  {item.text}
               </MenuItem>
            ))}
         </Select>
         <FormHelperText>{fieldState.error?.message}</FormHelperText>
		</FormControl>
	);
}
