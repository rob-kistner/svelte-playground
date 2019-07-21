<script>
  let promise = null

  async function getData() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/')
    const data = await res.json()
    if(res.ok) {
        console.log(data)
        return data
    }
  }

  function handleClick() {
    promise = getData()
  }
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    padding: 0.25rem 0.5rem;
    border-bottom: 1px solid var(--light-gray);
  }
  li:last-child {
    border-bottom: none;
  }
</style>

<button on:click="{handleClick}">Get Data</button>

<div>
  {#if promise !== null}
    {#await promise}
      <p>
        Waiting…
      </p>
    {:then data}
      <ul>
      {#each data as person}
        <li>
          <a href="mailto:{person.email}">
            {person.name}
          </a>
        </li>
      {/each}
      </ul>
    {/await}
  {/if}
</div>