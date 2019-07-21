<script> 

// props
export let itemList = ['one', 'two', 'three']

// watchers
$: itemListVals = itemList.map(i => `'${i}'`).join(',')

// methods
function handleSubmit() {
  const fld = document.querySelector('#item-to-add')
  if(fld.value !== '') {
    // spread operator updates the variable
    // whereas push only adds a value, so the DOM won't update
    itemList = [...itemList, fld.value]
    fld.value = ''
  }
}

function deleteListItem() {
  const itemIdx = this.getAttribute('href')
  itemList.splice(itemIdx, 1)
  // interface refresh
  itemList = [...itemList]
}

</script>

<style>

  ul {
    list-style-type: none;
    padding-left: 0;
  }
  li { 
    padding: 0.5rem 0;
    border-bottom: 2px dotted var(--light-gray);
  }
  li:last-child {
    border-bottom: none;
  }
  li a {
    background-color: var(--link);
    color: white;
    padding: 0 0.4rem;
    margin-right: 0.5rem;
    border-radius: 3px;
    font-size: 1.2rem;
    line-height: 0.25rem;
    text-align: center;
    transition: all 0.2s;
  }
  li a:hover {
    text-decoration: none;
    background-color: var(--focus);
    transition: all 0.2s;
  }

</style>

<!-- Page -->

{#if itemList.length === 0}
<p>No items in the list, yet. Add something below.</p>
{:else}
<p>{itemList.length} item in the list.</p>
{/if}

<ul>
{#each itemList as item, i (item)}
  <li>
    <a class="delete-link" href="{i}" on:click|preventDefault="{deleteListItem}">
      &times;
    </a>
    <span>
      {item}
    </span>
  </li>
{/each}
</ul>

<input type="hidden" name="myvals" bind:value="{itemListVals}">

<div>
  <form on:submit|preventDefault="{handleSubmit}">
    <input type="text"
      id="item-to-add" 
      placeholder="Enter an item to add"
      >
</div>

<div>
  <p>Your list values are:</p>
  <p>{itemList.join('::')}</p>
</div>
