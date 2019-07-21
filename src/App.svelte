<script>
  // import TS from './components/TransitionSamples.svelte'
  // import Checkbox from './components/Checkbox.svelte'
  // import Debounce from './components/Debounce.svelte'
  import Autocomplete from './components/Autocomplete.svelte'
</script>


<div class="container">

  <Autocomplete
    label="State"
    id="state-search"
    placeholder="Search for states"
    minChars={1}
    fromStart={false}
    />

</div>