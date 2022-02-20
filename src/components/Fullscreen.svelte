<script lang="ts">
  import ArrowsExpand from "./icons/ArrowsExpand.svelte";

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen({
        navigationUI: "hide",
      });
    }
  };
</script>

<button
  class="fixed top-3 right-4 text-gray-400 cursor-pointer"
  on:click={() => toggleFullscreen()}
>
  <ArrowsExpand />
</button>
