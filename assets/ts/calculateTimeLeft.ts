import { Moment, unitOfTime } from 'moment';

function calculateTimeLeft(start: Moment, end: Moment) {
  let duration: string = '';
  const units: unitOfTime.Diff[] = ['days', 'hours', 'minutes'];

  for (let i = 0; i < units.length; i++) {
    let unit: unitOfTime.Diff | string = units[i];
    const difference = end.diff(start, unit as unitOfTime.Diff);

    if (difference <= 0) {
      if (i === 2) {
        duration = 'Overdue';
        break;
      }

      continue;
    }

    unit = unit === 'minutes' ? 'mins' : unit;
    const unitWithSingularForm =
      difference === 1 ? unit.slice(0, unit.length - 1) : unit;

    duration = `${difference} ${unitWithSingularForm}`;
    break;
  }

  return duration;
}

export default calculateTimeLeft;
