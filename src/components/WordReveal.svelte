<script lang="ts">
  import { state, settings } from "../stores";
  $: currentWord = $settings.keywords[$state.currentWord];
</script>

{#if currentWord}
  <div>{currentWord}</div>
{/if}
