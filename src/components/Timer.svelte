<script lang="ts">
  import { onMount } from "svelte";
  import { settings } from "../stores";

  let currentDate = new Date();

  let timeRemaining = new Date(
    $settings.endTime.getTime() - currentDate.getTime()
  );

  function render() {
    currentDate = new Date();
    timeRemaining = new Date(
      $settings.endTime.getTime() - currentDate.getTime()
    );

    window.requestAnimationFrame(render);
  }

  onMount(() => {
    render();
  });
</script>

<div class="text-3xl flex items-center justify-center">
  <div>{timeRemaining.getMinutes()}</div>
  :
  <div>{timeRemaining.getSeconds().toString().padStart(2, "0")}</div>
</div>
