<script>
  import { createEventDispatcher } from 'svelte'
  import { onMount } from 'svelte'

  export let timeType // 'start' or 'end'
  export let timeValue // full date and time
  
  // initialize date & time objects
  timeValue = new Date(timeValue)

  let date = {}
  {
    date.year = timeValue.getFullYear().toString()
    date.month = (timeValue.getMonth()+1).toString()
    date.day = timeValue.getDate().toString()
  }  
  let time = {}
  {
    let tmpHrs = timeValue.getHours()
    tmpHrs = (tmpHrs <= 12) ? tmpHrs : tmpHrs-12
    time.hour = tmpHrs.toString()
    time.minutes = padNum(timeValue.getMinutes())
    let tmpAmPm = (timeValue.getHours() > 12) ? 'pm' : 'am'
    time.ampm = tmpAmPm
  }

  // flag start time
  let isStartTime = (timeType === 'start')

  // custom event dispatcher
  const dispatch = createEventDispatcher()

  // minutes valid values
  const minuteVals = ['00', '15', '30', '45']


  $: dateFmt = `${date.month}/${date.day}/${date.year}`
  $: timeFmt = getFormattedTime()
  $: assembledDateTime = `${dateFmt} ${timeFmt}`
  $: hr = parseInt(time.hour)
  $: min = parseInt(time.minutes)
  
  // get formatted time, for watcher plus dispatcher
  function getFormattedTime()
  {
    return `${time.hour}:${time.minutes} ${time.ampm}`
  }
  function getAssembledDate()
  {
    return `${date.month}/${date.day}/${date.year} ${time.hour}:${time.minutes} ${time.ampm}`
  }

  // dispatch event to root component
  function changeTime()
  {
    let payload = {
      time: getAssembledDate(),
      type: timeType,
      // timeStamp: 
    }
    dispatch('change-time', payload)
  }


  // add 1 hour
  function plusHour()
  {
    if (hr < 12) {
      time.hour = (hr + 1).toString()
    } else if (hr === 12) {
      time.hour = '1'
    } else {
      time.hour = '12'
    }
    changeTime()
  }

  // remove 1 hour
  function minusHour()
  {
    if (hr > 1) {
      time.hour = (hr - 1).toString()
    } else if (hr === 1) {
      time.hour = '12'
    }
    changeTime()
  }

  // add 15 minutes
  function plusMinutes()
  {
    let idx = minuteVals.indexOf(time.minutes)
    if (idx === minuteVals.length-1) {
      time.minutes = minuteVals[0]
    } else {
      time.minutes = minuteVals[idx+1]
    }
    changeTime()
  }

  // remove 15 minutes
  function minusMinutes()
  {
    let idx = minuteVals.indexOf(time.minutes)
    if (idx === 0) {
      time.minutes = minuteVals[minuteVals.length-1]
    } else {
      time.minutes = minuteVals[idx-1]
    }
    changeTime()
  }

  // swap between am and pm
  function changeAmPm()
  {
    time.ampm =
      (time.ampm === 'am') ? 'pm' : 'am'
    changeTime()
  }

  // keyup event handler for hours
  function handleKeyUpHour(e)
  {
    if (e.key === 'ArrowUp') {
      plusHour()
    } else if (e.key === 'ArrowDown') {
      minusHour()
     } else if (e.key === 'ArrowRight') {
       focus('#fldMinutes')
     }
  }

  // keyup event handler for minnutes
  function handleKeyUpMins(e)
  {
    if (e.key === 'ArrowUp') {
      plusMinutes()
    } else if (e.key === 'ArrowDown') {
      minusMinutes()
    } else if (e.key === 'ArrowLeft') {
      focus('#fldHour')
    } else if (e.key === 'ArrowRight') {
      focus('#fldAmPm')
    }
  }

  // keyup event handler for ampm
  function handleAmPm(e)
  {
    if (['ArrowUp', 'ArrowDown'].includes(e.key) || e.type === 'click') {
      changeAmPm()
    }
    if (e.key === 'ArrowLeft') {
      focus('#fldMinutes')
    }
  }

  // make into 2-digit number
  function padNum(num)
  {
    num = num.toString()
    if (num.length < 2) {
      return '0' + num
    }
    return num
  }

  function focus(fld) {
    document.querySelector(fld).focus()
  }

</script>


<style>
  button {
    --selected: hsl(204, 70%, 83%);
    --pad-major: 0.5rem;
    --pad-minor: 0.25rem;
  }
  button {
    background-color: transparent;
    border: 0;
    min-width: 1.9rem;
    border-radius: none;
    cursor: pointer;
    padding: 0.5rem 0.4rem;
  }
  button:focus {
    background-color: var(--selected);
  }
  .hour {
    text-align: right;
  }
  .minutes {
    text-align: left;
  }
</style>

<!-- html -->
<div class="time-control">

  <button id="fldHour" class="hour"
    on:click="{plusHour}"
    on:keyup="{handleKeyUpHour}">
    {time.hour}
  </button>

  <span class="colon">:</span>

  <button id="fldMinutes" class="minutes"
    on:click="{plusMinutes}"
    on:keyup="{handleKeyUpMins}">
    {time.minutes}
  </button>

  <button id="fldAmPm" class="ampm"
    on:click="{handleAmPm}"
    on:keyup="{handleAmPm}">
    {time.ampm}
  </button>

  <input type="hidden" name="fldStartTime" id="fldStartTime" value={assembledDateTime}>
</div>