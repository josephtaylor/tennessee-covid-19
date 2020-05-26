
export class TimeUtil {
  public static toDate(serial: number): Date {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const date = new Date(utcValue * 1000);

    const fractionalDay = serial - Math.floor(serial) + 0.0000001;

    let totalSeconds = Math.floor(86400 * fractionalDay);

    const seconds = totalSeconds % 60;

    totalSeconds -= seconds;

    const hours = Math.floor(totalSeconds / (60 * 60));
    const minutes = Math.floor(totalSeconds / 60) % 60;

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      seconds);
  }
}
