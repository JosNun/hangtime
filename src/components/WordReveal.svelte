<script lang="ts">
  import { state, settings } from "../stores";
  $: currentWord = $settings.keywords[$state.currentWord];
  let changeTimeout;

  $: shownLetters = new Array(currentWord?.length ?? 0).fill(
    false
  ) as boolean[];

  $: currentWord, clearTimeout(changeTimeout), onWordChange();

  function onWordChange() {
    changeTimeout = setTimeout(() => {
      const hidden = shownLetters
        .map((letter, i) => !letter && i)
        .filter((idx: false | number) => {
          return idx !== false;
        });

      if (hidden.length) {
        const toShow = hidden[Math.floor(Math.random() * hidden.length)];

        shownLetters[toShow] = true;

        onWordChange();
      } else {
        showNextWord();
      }
    }, 10_000);
  }

  function showNextWord() {
    state.update((current) => ({
      ...current,
      currentWord:
        current.currentWord + 1 > $settings.keywords.length
          ? 0
          : current.currentWord + 1,
    }));
  }
</script>

{#if currentWord}
  <div class="flex space-x-2 text-3xl">
    {#each currentWord as letter, i}
      <div
        class="w-8 uppercase text-center border-b-2 border-gray-300 font-semibold text-gray-700"
      >
        <span class="opacity-0" class:opacity-100={shownLetters[i]}
          >{letter}</span
        >
      </div>
    {/each}
  </div>
{/if}
