import Dates from './dates.json';

export default function getDates(isAmerican = false) {
  if (isAmerican) {
    return Dates.map(d => {
      const [day, month] = d.split('-');
      return `${month}-${day}`;
    })
  } else {
    return Dates;
  }
}