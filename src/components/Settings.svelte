<script lang="ts">
  import { isValid } from "date-fns";
  import { settings } from "../stores";

  let isOpen = true;
  let reference = "";

  const inputHour = $settings.endTime.getHours().toString().padStart(2, "0");
  const inputMinute = $settings.endTime
    .getMinutes()
    .toString()
    .padStart(2, "0");

  $: inputValue = inputHour + ":" + inputMinute;

  async function fetchReference() {
    const res = (await fetch(
      `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(
        reference
      )}&include-verse-numbers=false&include-short-copyright=false&include-passage-references=false&include-footnotes=false&include-headings=false&include-selahs=false`,
      {
        headers: {
          Authorization: `Token ${import.meta.env.PUBLIC_ESV_API_KEY}`,
        },
      }
    ).then((res) => res.json())) as {
      canonical: string;
      query: string;
      passages: string[];
    };

    settings.update((settings) => ({
      ...settings,
      passage: {
        reference: res.canonical.trim(),
        text: res.passages.map((text) => text.trim()).join(""),
      },
    }));
  }

  function onDateChange(dateInput: string) {
    const [hours, minutes] = dateInput.split(":");

    const newDate = new Date();
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));

    if (!isValid(newDate)) {
      return;
    }

    settings.update((settings) => ({
      ...settings,
      endTime: newDate,
    }));
  }
</script>

<div>
  <button
    class="fixed left-4 top-3 text-gray-400"
    on:click={() => (isOpen = true)}
  >
    Settings
  </button>
  <div
    class="fixed left-0 top-0 z-10 w-96 max-w-full h-full bg-gray-200 pb-3 overflow-auto translate transition flex flex-col {!isOpen
      ? '-translate-x-full'
      : ''}"
  >
    <div class="flex justify-between items-center px-4 py-3">
      <div class="font-bold text-gray-500 uppercase text-sm tracking-wide">
        Settings
      </div>

      <button class="text-gray-600" on:click={() => (isOpen = false)}>X</button>
    </div>

    <div class="px-4 space-y-4">
      <label class="block">
        <div class="font-bold text-sm text-gray-600 tracking-wide border">
          Countdown To
        </div>
        <input
          type="time"
          class="px-4 py-2 text-gray-600 rounded mt-1"
          bind:value={inputValue}
          on:change={(e) => onDateChange(e.currentTarget.value)}
        />
      </label>

      <form
        on:submit={(e) => {
          e.preventDefault();
          fetchReference();
        }}
      >
        <div class="font-bold text-sm text-gray-600 tracking-wide border">
          Reference
        </div>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            placeholder="e.g. 'John 3:16'"
            class="px-4 py-2 text-gray-600 rounded mt-1 flex-1 min-w-0"
            bind:value={reference}
          />
          <button
            class="hover:bg-gray-300 transition px-2 py-1 rounded"
            type="submit">Fetch</button
          >
        </div>
      </form>
    </div>
    <div class="text-xs text-gray-600 mt-auto px-4 py-2">
      Scripture quotations are from The ESV® Bible (The Holy Bible, English
      Standard Version®), copyright © 2001 by Crossway, a publishing ministry of
      Good News Publishers. Used by permission. All rights reserved
    </div>
  </div>
</div>
