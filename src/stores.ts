import { addMinutes } from "date-fns";
import { writable } from "svelte/store";

export const settings = writable<{
  endTime: Date;
  passage: {
    text: string;
    reference: string;
  };
}>({
  endTime: addMinutes(new Date(), 5),
  passage: {
    text: "",
    reference: "",
  },
});

export const state = writable({
  currentWord: 0,
});
