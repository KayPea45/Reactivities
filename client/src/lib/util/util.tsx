import {DateArg, format} from 'date-fns'
import { z } from 'zod';

export function formatDateTime(datetime: DateArg<Date>) {
   return format(datetime, "dd MMM yyyy h:mm a");
}

export const requiredString = (fieldName: string) =>
   z
      .string({ required_error: `${fieldName} is required` })
      .min(2, { message: `${fieldName} is required` });