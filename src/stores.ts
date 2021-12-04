import { addMinutes } from 'date-fns';
import { writable } from 'svelte/store';

export const settings = writable({
   endTime: addMinutes(new Date(), 5)
});