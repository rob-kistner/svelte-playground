<script>
  export let id
  let isChecked = false

  function updateChecked(e) {
    isChecked = e.target.checked
  }
</script>

<style>
  input[type="checkbox"] {
    opacity: 0;
  }
  label {
    font-size: 1.2rem;
    color: #aaa;
  }
  .checked-label {
    color: #000;
  }
  input[type="checkbox"] + span {
    position: relative;
    display: inline-block;
    width: 25px;
    height: 25px;
    top: 2px;
    background-image: url("data:image/svg+xml,%3Csvg enable-background='new 0 0 23 23' version='1.1' viewBox='0 0 23 23' xml:space='preserve' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:none;%7D .st1%7Bfill:%23FFFFFF;%7D .st2%7Bfill:%23A6A6A6;%7D%0A%3C/style%3E%3Crect class='st0' width='23' height='23'/%3E%3Crect class='st1' x='.5' y='5.5' width='17' height='17'/%3E%3Cpath class='st2' d='M17,6v16H1V6H17 M18,5H0v18h18V5L18,5z'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: left bottom;
  }
  input[type="checkbox"]:checked + span {
    background-image: url("data:image/svg+xml,%3Csvg enable-background='new 0 0 23 23' version='1.1' viewBox='0 0 23 23' xml:space='preserve' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:none;%7D .st1%7Bfill:%23FFFFFF;stroke:%23231F20;stroke-miterlimit:10;%7D .st2%7Bfill:%23231F20;%7D%0A%3C/style%3E%3Crect class='st0' width='23' height='23'/%3E%3Cpolyline class='st1' points='17.5 11 17.5 22.5 0.5 22.5 0.5 5.5 18 5.5'/%3E%3Cpolygon class='st2' points='9 20 2.07 9.28 5.44 9.04 9 15 19.3 0.27 23 0.27'/%3E%3C/svg%3E%0A");
  }
</style>

<label class={isChecked ? "checked-label" : ""}>
  <input type="checkbox" id={id} name={id} checked={isChecked} on:change={updateChecked} />
  <span></span>
  <slot></slot>
</label>
