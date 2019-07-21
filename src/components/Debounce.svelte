<script>
  import {debounce} from '../js/debounce.js'

  export let time = 500
  let currVal = 0
  let typedTextOrig = 'Type above to change this value'
  let typedText = typedTextOrig

  function changeVal() {
    currVal++
  }

  function changeText(e) {
    typedText = (e.target.value.trim() === "") ?
      typedTextOrig :
      e.target.value
  }
</script>

<h2>Debounce Imported Example</h2>

<p>( click these fast )</p>
<button on:click={debounce(changeVal, time, true)}>Debounced, Run Immediately</button>
<button on:click={debounce(changeVal, time)}>Debounced</button>
<button on:click={changeVal}>Not Debounced</button>

<p>The current value is: <strong>{currVal}</strong></p>

<hr>

<h2>Debounce Typing Example</h2>

<input on:keyup={debounce(changeText, time)} placeholder="Debounced Text">
<p>{typedText}</p>
