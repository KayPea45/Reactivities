import {
	Box,
	debounce,
	List,
	ListItemButton,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
	FieldValues,
	useController,
	UseControllerProps,
} from "react-hook-form";
import { LocationIQSuggestion } from "../../../lib/types";
import axios from "axios";

type Props<T extends FieldValues> = { label: string } & UseControllerProps<T>;

export default function LocationInput<T extends FieldValues>(props: Props<T>) {
	const { field, fieldState } = useController({ ...props });

	const [loading, setLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);

	// this will hold the location value since we only want the name of the venue in string, but have other properties like longitude and latitude
	const [inputValue, setInputValue] = useState(field.value || '');

	useEffect(() => {
		if (field.value && typeof field.value === 'object') {
			setInputValue(field.value.venue || '')
		} else {
			setInputValue(field.value || '')
		}
	},[field.value])

   //? NOTE: limit is number of suggestions shown, dedupe is to remove duplicate suggestions, and we have & at end to add our location input query string 
   const locationURL = "https://api.locationiq.com/v1/autocomplete?key=pk.47b102b991f56f73c80c60a6db610a33&limit=5&dedupe=1&"
   
	// useMemo so that we dont call this function each time this component loads. It is called depending on what depencies are called 
	// not using useCallback as we cannot pass parameters/arguments even though typically we do this when memoize a function
   const fetchSuggestions = useMemo(
		// We only want to fetch the suggestions after 5 characters are inputted
		// debounce function is used to delay statements inside to be executed until certain amount of time specified has passed. e.g here its 0.5 seconds
      () => debounce(async (query: string) => {
         if (!query || query.length < 5) {
            setSuggestions([]);
            return;
         }

         setLoading(true);

         try {
				// we dont want to use agent as that is connected to our backend API
				// and LocationIQ is an external API
            const res = await axios.get<LocationIQSuggestion[]>(`${locationURL}q=${query}`)
            setSuggestions(res.data)
         } catch (error) {
            console.log(error)
         } finally {
            setLoading(false);
         }
      }, 500), [locationURL]
   )

	// Track the changing of the inputs locally
   const handleChange = async (value: string) => {
      field.onChange(value);
      await fetchSuggestions(value);
   }

	const handleSelect = (location: LocationIQSuggestion) => {
		const city = location.address?.city || location.address?.town || location.address?.village || location.address?.suburb;
		const venue = location.display_name;
		const latitude = location.lat;
		const longitude = location.lon;

		setInputValue(venue);
		field.onChange({city, venue, latitude, longitude});
		setSuggestions([]);
	}

	return (
		<Box>
			<TextField
				{...props}
            onChange={e => handleChange(e.target.value)}
				fullWidth
				variant="outlined"
				error={!!fieldState.error}
				helperText={fieldState.error?.message}
            value={inputValue}
			/>
			{loading && <Typography>Loading...</Typography>}
			{suggestions.length > 0 && (
				<List sx={{ border: 1 }}>
					{suggestions.map((suggestion) => (
						<ListItemButton
							divider
							key={suggestion.place_id}
							onClick={() => handleSelect(suggestion)}
						>{suggestion.display_name}</ListItemButton>
					))}
				</List>
			)}
		</Box>
	);
}
