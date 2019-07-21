<script>

import {onMount} from 'svelte'

export let placeholder = 'Enter search text'
export let id = 'autocomplete'
export let label = null
export let exact = false // search must fall within the data list
export let minChars = 2
export let maxMatches = 7
export let fromStart = false

let search = ''
let matches = []
let data = null
let arrowCounter = -1

const URL = '../data/states.json'

onMount(async () => {
  const res = await fetch(URL)
  data = await res.json()
})

// search states.json and filter it
async function searchStates() {
  if (search.length < minChars) {
    matches = []
    return
  }

  // * Customize as needed for data set,
  // * get matches to current text input
  const searchString = (fromStart) ?  `^${search}` : `${search}`

  matches = data.filter(item => {
    const regex = new RegExp(searchString, 'gi')
    return item.name.match(regex) || item.abbr.match(regex)
  })

  // if search is empty, don't show anything
  // (otherwise would show all data)
  if (search.length === 0) matches = []
}

function setSearch(index, clearMatches = false) {
  search = matches[index].name
  if (clearMatches) {
    matches = []
    arrowCounter = -1
  }
}

// key events
function onKeyDown (event) {
  // ArrowDown
  if (event.keyCode === 40 && arrowCounter < matches.length-1) {
    arrowCounter = arrowCounter + 1
    setSearch(arrowCounter)
  // ArrowUp
  } else if (event.keyCode === 38 && arrowCounter > -1) {
    arrowCounter = arrowCounter - 1
    setSearch(arrowCounter)
  // Enter
  // TODO: do nothing if there isn't a match list, this isn't working
  } else if (event.keyCode === 13) {
    event.preventDefault()
    if (arrowCounter === -1) {
      arrowCounter = 0 // Default select first item of list
      setSearch(arrowCounter, true)
    } else if(matches.length > 0) {
      setSearch(arrowCounter, true)
    }
  // Escape
  } else if (event.keyCode === 27) {
    event.preventDefault()
    matches = []
    arrowCounter = -1
  }
}

</script>

<style>

  input[type="text"] {
    width: 100%;
  }
  .result-list {
    position: absolute;
    width: auto;
    margin-top: -5px;
    z-index: 100;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
  }
  .result {
    padding: 0.5rem 1rem;
    background-color: #fff;
    border: solid 1px #ddd;
  }
  .result h3,
  .result h4,
  .result h5,
  .result h6 {
    margin: 0 0 0.25rem;
  }
  .result p {
    margin: 0;
  }
  .is-active {
    background-color: #dedede !important;
  }

</style>


{#if label}
  <label for={id}>{label}</label>
{/if}
<input
  type="text"
  id={id}
  placeholder={placeholder}
  bind:value={search}
  on:input={searchStates}
  on:keydown={onKeyDown}
  on:click={()=>arrowCounter=-1}
  >

<div class="result-list">
  {#if (matches.length > 0)}
    {#each matches as match, i}
      {#if i < maxMatches}
        <div
          on:click={()=>setSearch(i, true)}
          class="result{ i === arrowCounter ? ' is-active' : '' }"
          >
          <h4 data={match.name}>{match.name} ({match.abbr})</h4>
          <small>Capital: <strong>{match.capital}</strong></small>
        </div>
      {/if}
    {/each}
  {/if}
</div>
