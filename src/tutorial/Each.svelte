<script>
  import Thing from './EachThing.svelte'
  import {uuid} from '../js/uuid.js'
  
  const seed = 'xxxx-xxxx'

  const things = [
    {
      "id": uuid(seed),
      "name": "Thing 1",
      "desc": "Asperiores, illo facilis laudantium nulla architecto obcaecati quidem optio."
    },
    {
      "id": uuid(seed),
      "name": "Thing 2",
      "desc": "Impedit ad debitis vel perspiciatis consequatur iusto voluptatum officiis. Architecto veritatis blanditiis minus."
    },
    {
      "id": uuid(seed),
      "name": "Thing 3",
      "desc": "Voluptas repudiandae, provident ipsum laboriosam assumenda rem cum perferendis! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero, exercitationem ut eius velit ab nam."
    },
    {
      "id": uuid(seed),
      "name": "Thing 4",
      "desc": "Corrupti, perspiciatis. Dolorum rem ipsum ab doloribus. Animi molestias hic quod dolores."
    },
    {
      "id": uuid(seed),
      "name": "Thing 5",
      "desc": "Harum fugiat accusantium illum quos beatae dicta consequatur iusto autem temporibus perferendis."
    }
  ]
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }

</style>

<ul>
{#each things as thing (thing.id)}
  <li>
    <Thing id="{thing.id}" title="{thing.name}" description="{thing.desc}" />
  </li>
{/each}
</ul>