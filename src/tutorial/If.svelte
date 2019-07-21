<script>
  let user = {
    loggedIn: false
  }

  function toggle() {
    user.loggedIn = !user.loggedIn
  }
</script>

{#if !user.loggedIn}
  <p>You are logged in.</p>
  <button on:click={toggle}>
    Log In
  </button>
{:else}
  <button on:click={toggle}>
    Log Out
  </button>
{/if}

{#if user.loggedIn}
  <hr>
  <h2>Here's Yer Stuff</h2>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non deleniti quisquam necessitatibus aliquid a eius fugit magni nulla saepe quas nemo dolore soluta, ratione illo ducimus officiis quidem. Hic, ipsa?</p>
  <ul>
    <li>Dolores eum earum</li>
    <li>Voluptatibus repellendus</li>
    <li>Voluptatem officia blanditiis</li>
    <li>Fugiat voluptas</li>
    <li>Temporibus molestias</li>
  </ul>
{/if}