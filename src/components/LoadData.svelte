<script>
  
  const url = '../data/users.json'
  let users = null

  // async fetch
  async function getUsersAsync() 
  {
    let response = await fetch(url)
    let data = await response.json()
    return data;
  }
  // run async fetch and stuff into users variable
  function runGetUsersAsync()
  {
    getUsersAsync()
      .then(data => users = data)
  }

  // reformat phone number
  function formatPhone(num)
  {
    // get extension
    let re = /x[0-9]+/g
    let x = re.exec(num)
    x = !x ? null : x[0]
    num = num.replace(/[ ]*x[0-9]+/g, '')

    // strip parens
    num = num.replace(/\(/g, '')
    num = num.replace(/\) */g, ' ')

    // replace dashes and periods with spaces
    num = num.replace(/\.|-/g, ' ')

    // remove 1 from phone number at beginning if it's there
    let numArray = [...num.split(' ')]
    if (numArray[0] == "1") numArray.shift()

    // assemble new phone number and return it
    let s = `(${numArray[0]}) ${numArray[1]}-${numArray[2]}`
    if (x !== null) s += ` ${x}`

    return s
  }

  function assembleUserAddress(user)
  {
    return `${user.address.street}\n${user.address.suite}\n${user.address.city}\n${user.address.zipcode}`
  }

  // promise for on-load fetch
  let promise = loadUsers()

  // on-load fetch users
  async function loadUsers()
  {
    const res = await fetch(url)
    const json = await res.json()

    if (res.ok) {
      return json
    } else {
      throw new Error(json)
    }
  }
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    background-color: #fff;
    padding: 1rem 1.5rem;
    border-bottom: 1px dotted #aaa;
  }
  li:last-child {
    border-bottom: none;
  }
  h4 {
    font-size: 1.3rem;
    margin: 0 0 0.375rem;
  }
  p {
    margin: 0;
  }
  .contact-grid {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .contact-grid li {
    width: 49%;
  }
  @media (min-width: 768px) {
    .contact-grid li {
      width: 32%;
    }
  }
  .spacer {
    display: block;
    width: 100%;
    height: 100px;
  }
</style>

<h2>Loading data with Async/Await at Startup</h2>
<section>
  <div>
    <ul class="contact-grid">
    {#await promise}
      <p>Loading…</p>
    {:then users}
      {#each users as user, i (user.id)}
        <li title={assembleUserAddress(user)}>
          <h4>
            {user.name}
          </h4>
          <p>{formatPhone(user.phone)}</p>
          <p><a href="mailto:{user.email}">{user.email}</a></p>
        </li>
      {/each}
    {/await}
    </ul>
  </div>
</section>

<!-- output users on button click -->
<h2>Loading data with Async/Await on demand</h2>
<section>
  <button on:click={runGetUsersAsync}>Get Users</button>
  {#if users}
    <h4>{users.length} total users…</h4>
    <ul>
      {#each users as user, i (user.id)}
      <li>
        <a href="mailto:{user.email}">{user.name}</a>
      </li>
      {/each}
    </ul>
  {/if}
</section>

<div class="spacer"></div>