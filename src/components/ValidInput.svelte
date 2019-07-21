<script>
  import {onMount} from 'svelte'
  import axios from 'axios'

  export let name = 'fld'
  export let id = name
  export let label = 'Default field label'
  export let url = 'https://jsonplaceholder.typicode.com/users/'
  
  let message = 'Fetching data…'
  let data = null

  function checkField(e) {
    console.log(data)
    // if (data.includes(e.target.value.trim())) {
    //   message = 'Value already exists'
    // }
  }

  onMount( () => {
    data = axios.get(url)
      .then(function(response) {
        return response.json()
      })
  })
</script>

<style>
  .message {
    font-size: 0.85rem;
    font-style: italic;
    color: red;
    margin-top: 0;
  }
  .tag {
    background-color: #e9e9e9;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
  }
</style>

<p>Try <span class="tag">Leanne Graham</span></p>
<label for={name}>{label}</label>
<input type="text" name={name} id={id} on:blur={checkField}>
{#if message}<p class="message">{message}</p>{/if}
