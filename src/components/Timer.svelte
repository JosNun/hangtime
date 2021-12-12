<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { settings } from "../stores";

  let currentDate = new Date();

  let timeRemaining = new Date(
    $settings.endTime.getTime() - currentDate.getTime()
  );

  let animationFrame = null;
  $: isComplete = timeRemaining.getTime() <= 0;

  function render() {
    currentDate = new Date();
    timeRemaining = new Date(
      $settings.endTime.getTime() - currentDate.getTime()
    );

    animationFrame = window.requestAnimationFrame(render);
  }

  const unsubscribeSettings = settings.subscribe((s) => {
    if (s.endTime < new Date()) {
      isComplete = true;
    } else {
      isComplete = false;
    }
  });

  onMount(() => {
    render();
  });

  onDestroy(() => {
    unsubscribeSettings();
    window.cancelAnimationFrame(animationFrame);
  });
</script>

<div
  class="text-9xl font-semibold text-gray-800 tabular-nums flex items-center justify-center"
>
  <div>{isComplete ? "0" : timeRemaining.getMinutes()}</div>
  :
  <div>
    {isComplete ? "00" : timeRemaining.getSeconds().toString().padStart(2, "0")}
  </div>
</div>
