<script>
  let name = 'world'
  let greeting = 'Hello'

  $: greeting = ((name.toLowerCase().includes('rob')) ? 'Howdy' : 'Hello')
</script>

<input bind:value={name}>

<h1>{greeting} {name}!</h1>