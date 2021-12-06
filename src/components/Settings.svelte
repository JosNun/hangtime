<script lang="ts">
  let isOpen = true;
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
  </div>
</div>
