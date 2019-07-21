// Source for convertDate, compareDates, dateInRange:
// http://stackoverflow.com/questions/497790

/**
 * Converts the date in d to a date-object. The input can be:
 * 
 *  a date object : returned without modification
 *  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
 *   a number     : Interpreted as number of milliseconds
 *                  since 1 Jan 1970 (a timestamp) 
 *   a string     : Any format supported by the javascript engine, like
 *                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
 *  an object     : Interpreted as an object with year, month and date
 *                  attributes.  **NOTE** month is 0-11.
 */
export function convertDate( d ) {
  return (
      d.constructor === Date ? d :
      d.constructor === Array ? new Date( d[0], d[1], d[2] ) :
      d.constructor === Number ? new Date(d) :
      d.constructor === String ? new Date(d) :
      typeof d === "object" ? new Date( d.year, d.month, d.date ) :
      NaN
  )
}

/**
 * Compare two dates (could be of any type supported by the convert
 * function above) and returns:
 *  -1 : if a < b
 *   0 : if a = b
 *   1 : if a > b
 * NaN : if a or b is an illegal date
 * 
 * NOTE: The code inside isFinite does an assignment (=).
 * 
 * Dep: convertDate
 */
export function compareDates(a, b) {
  return (
      isFinite( a = convertDate(a).valueOf() ) &&
      isFinite( b = convertDate(b).valueOf() ) ?
      ( a > b ) - ( a < b ) :
      NaN
  )
}

/**
 * Checks if date in d is between dates in start and end.
 * Returns a boolean or NaN:
 *    true  : if d is between start and end (inclusive)
 *    false : if d is before start or after end
 *    NaN   : if one or more of the dates is illegal.
 * 
 * NOTE: The code inside isFinite does an assignment (=).
 * 
 * Dep: convertDate
 */
export function dateInRange (d,start,end) {
  return (
      isFinite(d = convertDate(d).valueOf()) &&
      isFinite(start = convertDate(start).valueOf()) &&
      isFinite(end = convertDate(end).valueOf()) ?
      start <= d && d <= end :
      NaN
  )
}

/**
 * Returns integer of minutes given two datetimes
 * Dep: convertDate
 * 
 * @param String dt2 
 * @param String dt1 
 */
export function diffMinutes (dt2, dt1)
{
  dt1 = convertDate(dt1)
  dt2 = convertDate(dt2)
  var diff = (dt2.getTime() - dt1.getTime()) / 1000  // to seconds
  diff /= 60  // to minutes
  return Math.abs(Math.round(diff))
}

/**
 * Returns float of hours given two datetimes
 * Dep: diffMinutes
 * 
 * @param String dt2 
 * @param String dt1 
 */
export function diffHours (dt2, dt1)
{
  return diffMinutes(dt2, dt1) / 60
}