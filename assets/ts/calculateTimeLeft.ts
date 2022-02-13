import { Moment, unitOfTime } from 'moment';

function calculateTimeLeft(start: Moment, end: Moment) {
  let duration: string = '';
  const units: unitOfTime.Diff[] = ['days', 'hours', 'minutes'];

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    const difference = end.diff(start, unit);

    if (difference === 0) {
      if (i === 2) {
        duration = 'Overdue';
        break;
      }

      continue;
    }

    duration = `${difference} ${unit === 'minutes' ? 'mins' : unit}`;
    break;
  }

  return duration;
}

export default calculateTimeLeft;
