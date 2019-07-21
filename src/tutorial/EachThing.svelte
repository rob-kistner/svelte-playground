<script>
  export let id;
  export let title;
  export let description;
</script>

<style>
  div {
    border: 1px solid #ccc;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 2px 1px rgba(0,0,0,0.08);
  }
  small {
    display: inline-block;
    color: midnightblue;
    background-color: #eaeaea;
    margin: 0 0 0.25rem;
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
  }
  h4 {
    color: darkblue;
    font-size: 1.4rem;
    margin: 0 0 0.5rem;
  }
  p {
    color: grey;
    margin: 0;
  }
</style>

<div>
  <small>{id}</small>
  <h4>{title}</h4>
  <p>{description}</p>
</div>
