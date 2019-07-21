<script>
  import { slide } from 'svelte-transitions'
  import { cubicInOut } from 'svelte/easing'

  let visible = false
</script>

<style>
  label {
    margin-bottom: 0;
  }
  .transin *:first-child { margin-top: 0; }
  .transin *:last-child { margin-bottom: 0; }
  .transin {
    background-color: darkred;
    color: white;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 6px;
  } 
</style>


<label>
  <input type='checkbox' bind:checked={visible}> Show Me
</label>

{#if visible}
  <div
    transition:slide={{duration: 500, easing: cubicInOut}}
    class="transin"
    >
    <h3>What's up mutherfuckers…</h3>
    <p>Numquam molestias repudiandae fugiat consequatur eligendi, quod maiores cum recusandae ullam perspiciatis! Doloribus minus soluta atque laborum totam officia impedit voluptatum. Aspernatur!</p>
  </div>
{/if}

<div>
Culpa odio sequi laudantium nobis a repudiandae impedit, fuga nam illo alias omnis voluptate exercitationem est assumenda sed tenetur nesciunt odit veritatis eius, nisi facilis accusamus sint molestias.
</div>

