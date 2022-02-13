<script lang="ts">
  import { isValid } from "date-fns";
  import { settings } from "../stores";
  let isOpen = true;

  const inputHour = $settings.endTime.getHours().toString().padStart(2, "0");
  const inputMinute = $settings.endTime
    .getMinutes()
    .toString()
    .padStart(2, "0");

  $: inputValue = inputHour + ":" + inputMinute;

  $: keywords = $settings.keywords;

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
    class="fixed left-0 top-0 w-96 max-w-full h-full bg-gray-200 pb-3 overflow-auto translate transition {!isOpen
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
      <div class="font-bold text-sm text-gray-600 tracking-wide border">
        Keywords
      </div>
      {#each keywords as keyword, i}
        <div class="flex space-x-2 items-center justify-between">
          <input
            type="text"
            class="px-4 py-2 text-gray-600 rounded mt-1 min-w-0"
            value={keyword}
            on:input={(e) => {
              const value = e.currentTarget.value;

              const newKeywords = [...keywords];

              newKeywords[i] = value;

              settings.update((settings) => ({
                ...settings,
                keywords: newKeywords,
              }));
            }}
          />
          <button
            class="text-gray-500 text-xs font-semibold"
            on:click={() =>
              settings.update((settings) => ({
                ...settings,
                keywords: settings.keywords.filter((_, j) => i !== j),
              }))}>Remove</button
          >
        </div>
      {/each}
      <button
        class="underline text-gray-700 text-sm"
        on:click={() => {
          settings.update((settings) => ({
            ...settings,
            keywords: [...settings.keywords, ""],
          }));
        }}>+ Add another</button
      >
    </div>
  </div>
</div>
