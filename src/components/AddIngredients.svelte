<script>
  import { onMount } from 'svelte'

  const URL = './data/users-short.json'

  let ingredients = [{item0: ""}]
  let users = null
  let isLoading = false

  onMount(() => {
    fetch(URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to GET')
        return res.json() // returns a promise, move to next .then
      })
      // data received ok, process it
      .then(data => {
        
        let keys = Object.keys(data)
        // for in loop to test
        for (let key in data) {
          console.log(key, data[key])
        }
        users = data
        console.log(users)
      })
      // print error info
      .catch(err => {
        console.log(err)
      })
  })

</script>

{#each ingredients as ingredient}
  <select>
    {#if users}
    <option value=""></option>
    {#each users as user}
    <option value={user.id}>{user.name}</option>
    {/each}
    {/if}
  </select>
{/each}