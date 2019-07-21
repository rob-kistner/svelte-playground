<script>
  let user = {
    firstname: 'Ada',
    lastname: 'Lovelace'
  };
  let howdy = 'Howdy'
</script>

<input bind:value={user.firstname}>
<input bind:value={user.lastname}>


<h1>Hello {user.firstname}!</h1>

<!-- comma separated list of variables to debug -->
{@debug user, howdy}