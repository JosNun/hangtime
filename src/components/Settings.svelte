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
    class="fixed left-0 top-0 w-96 h-full bg-gray-200 trnasform translate transition {!isOpen
      ? '-translate-x-full'
      : ''}"
  >
    <div class="flex justify-between items-center px-4 py-3">
      <div class="font-bold text-gray-500 uppercase text-sm tracking-wide">
        Settings
      </div>

      <button class="text-gray-600" on:click={() => (isOpen = false)}>X</button>
    </div>

    <div class="px-4">
      <label>
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
    </div>
  </div>
</div>
