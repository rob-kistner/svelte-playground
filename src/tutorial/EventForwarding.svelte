<script>
  import EventForwardingButton from './EventForwardingButton.svelte'

  function handleClick() {
    alert('clicked on component')
  }

</script>

<p>on:click is forwarded from the child component through the parent.</p>

<EventForwardingButton on:click="{handleClick}" />