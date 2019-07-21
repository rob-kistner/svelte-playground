<script>
	import Dispatcher from './Dispatcher.svelte';

	function handleMessage(event) {
		alert(event.detail.text);
	}
</script>

<Dispatcher on:message={handleMessage}/>