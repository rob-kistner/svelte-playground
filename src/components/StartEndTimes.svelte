<script>
  import TimeInput from './TimeInput.svelte'
  import * as DateUtils from '../js/dateutils.js'

  export let startDate
  // let entryDate = DateUtils.convertDate(startDate)
  let entryDate = new Date()
  export let startTime = extractDate(entryDate) + ' 9:00 am'
  export let endTime = extractDate(entryDate) + ' 10:30 am'

  $: datediff = DateUtils.compareDates(startTime, endTime)
  $: diffmins = DateUtils.diffMinutes(startTime, endTime)
  $: diffhrs = DateUtils.diffHours(startTime, endTime)

  function extractDate(theDate)
  {
    return (theDate.getMonth()+1) + '/' + theDate.getDate() + '/' + theDate.getFullYear()
  }

  function changeTime(e)
  {
    if (DateUtils.compareDates(startTime, endTime) === 1) {
      endTime = startTime
      return
    }
    if (e.detail.type === 'start') {
      startTime = e.detail.time
    } else if (e.detail.type === 'end') {
      endTime = e.detail.time
    }
  }
</script>


<style>
</style>


<div>
  <p>Entry Date: {entryDate}</p>
  <p>Start Time: {startTime}</p>
  <p>End Time: {endTime}</p>
  <p>Difference: {datediff}</p>
  <p>Difference in Minutes: {diffmins}</p>
  <p>Difference in Hours: {diffhrs}</p>
</div>

<div class="form-control">
  <label>Start Time</label>
  <TimeInput
    timeType="start"
    entryDate={entryDate}
    on:change-time={changeTime}
    timeValue={startTime}
    />
</div>
<div class="form-control">
  <label>End Time</label>
  <TimeInput
    timeType="end"
    entryDate={entryDate}
    on:change-time={changeTime}
    timeValue={endTime}
    />
</div>