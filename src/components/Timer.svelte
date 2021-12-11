<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { settings } from "../stores";

  let currentDate = new Date();

  let timeRemaining = new Date(
    $settings.endTime.getTime() - currentDate.getTime()
  );

  let animationFrame = null;

  function render() {
    currentDate = new Date();
    timeRemaining = new Date(
      $settings.endTime.getTime() - currentDate.getTime()
    );

    animationFrame = window.requestAnimationFrame(render);
  }

  onMount(() => {
    render();
  });

  onDestroy(() => {
    window.cancelAnimationFrame(animationFrame);
  });
</script>

<div
  class="text-9xl font-semibold text-gray-800 tabular-nums flex items-center justify-center"
>
  <div>{timeRemaining.getMinutes()}</div>
  :
  <div>{timeRemaining.getSeconds().toString().padStart(2, "0")}</div>
</div>
