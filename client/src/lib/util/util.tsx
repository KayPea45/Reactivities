import {DateArg, format} from 'date-fns'

export function formatDateTime(datetime: DateArg<Date>) {
   return format(datetime, "dd MMM yyyy h:mm a");
}