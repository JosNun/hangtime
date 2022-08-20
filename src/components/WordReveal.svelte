<script lang="ts">
  import { settings } from "../stores";
  $: text = $settings.passage.text;
  $: reference = $settings.passage.reference;
  let changeTimeout;
  let showAgainTimeout;

  const wordRegex = /[a-zA-Z0-9]/;
  const defaultCharacterTimeout = 5_000;
  let characterTimeout = defaultCharacterTimeout;

  let wordGroups;
  let shownLetters;

  $: getShownLetters = (wordGroups) => {
    const letters = new Array(
      wordGroups.reduce((acc, word) => word.letters.length + acc, 0)
    ).fill(false) as boolean[];

    for (let group of wordGroups) {
      for (let i = 0; i < group.letters.length; i++) {
        if (!wordRegex.test(group.letters[i])) {
          letters[group.offset + i] = true;
        }
      }
    }

    return letters;
  };

  const initWordGroups = () => {
    wordGroups = text
      .split(/\s/g)
      .filter(Boolean)
      .map((word, i, arr) => {
        const offset = arr
          .slice(0, i)
          .reduce((acc, word) => acc + word.length, 0);

        return {
          offset,
          letters: word,
        };
      });

    const wordGroupOffset = wordGroups.reduce((acc, wordGroup) => {
      return acc + wordGroup.letters.length;
    }, 0);

    const referenceGroups = reference
      .split(/\s/g)
      .filter(Boolean)
      .map((word, i, arr) => {
        const offset =
          wordGroupOffset +
          arr.slice(0, i).reduce((acc, word) => acc + word.length, 0);

        return {
          isReferenceStart: i === 0,
          offset,
          letters: word,
        };
      });

    wordGroups = [...wordGroups, ...referenceGroups];
  };

  const initShownLetters = () => {
    shownLetters = getShownLetters(wordGroups);
  };

  $: init = () => {
    initWordGroups();
    initShownLetters();

    const charCount = (text + reference)
      .split("")
      .filter((char) => wordRegex.test(char)).length;
    const timeRemaining = new Date(
      $settings.endTime.getTime() - new Date().getTime()
    ).getTime();

    const iterationTime = charCount * characterTimeout;

    if (iterationTime > timeRemaining) {
      characterTimeout = (timeRemaining - 10_000) / charCount;
    } else {
      characterTimeout = defaultCharacterTimeout;
    }

    onWordChange();
  };

  const clearTimer = () => {
    clearTimeout(changeTimeout);
    clearTimeout(showAgainTimeout);
  };

  $: $settings.endTime, text, clearTimer(), init();

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
      } else if (wordGroups.length) {
        showAgainTimeout = setTimeout(showAgain, 10_000);
      }
    }, characterTimeout);
  }

  function showAgain() {
    const timeRemaining = new Date(
      $settings.endTime.getTime() - new Date().getTime()
    ).getTime();

    const iterationTime =
      (text + reference).split("").filter((char) => wordRegex.test(char))
        .length * characterTimeout;

    if (iterationTime < timeRemaining) {
      shownLetters = getShownLetters(wordGroups);
      onWordChange();
    }
  }
</script>

{#if wordGroups}
  <div class="flex gap-5 text-3xl max-w-full flex-wrap justify-center mx-8">
    {#each wordGroups as group, i}
      {#key group.letters + i}
        {#if group.isReferenceStart}
          <div class="w-full" />
        {/if}
        <span class="flex space-x-1 {group.isReferenceStart ? 'ml-auto' : ''}">
          {#each group.letters.split("") as letter, i}
            {@const isSymbol = !wordRegex.test(letter)}
            <div
              class="w-7 uppercase text-center {!isSymbol
                ? 'border-b-2 border-gray-300 '
                : ''} font-semibold text-gray-700"
            >
              <div
                class="transition transform duration-700 {!isSymbol &&
                !shownLetters[group.offset + i]
                  ? 'opacity-0 -translate-y-2 scale-75'
                  : 'opacity-100'}"
              >
                {letter}
              </div>
            </div>
          {/each}
        </span>
      {/key}
    {/each}
  </div>
{/if}
