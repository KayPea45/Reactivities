type Activity = {
   id: string;
   title: string;
   date: Date;
   description: string;
   category: string;
   city: string;
   venue: string;
   latitude: number;
   longitude: number;
};

//* Location IQ Autocomplete API
export type LocationIQSuggestion = {
   place_id: string
   osm_id: string
   osm_type: string
   licence: string
   lat: string
   lon: string
   boundingbox: string[]
   class: string
   type: string
   display_name: string
   display_place: string
   display_address: string
   address: LocationIQAddress
 }
 
 export type LocationIQAddress = {
   name: string
   house_number: string
   road: string
   neighbourhood: string
   suburb?: string
   town?: string
   village?: string
   city?: string
   state: string
   postcode: string
   country: string
   country_code: string
 }
//* endof Location IQ Autocomplete API