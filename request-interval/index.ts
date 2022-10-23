// set of interval types (can be extend in depends on needs)
export enum Interval {
  TEST
}

class RequestInterval {
  private intervals: Map<Interval, number> = new Map();

  public toggle = (key: Interval, value: boolean, timer?: number, callback?: () => void) => {
    if (value && !this.intervals.has(key)) {
      this.intervals.set(key, setInterval(callback, timer));
      return;
    }

    if (!value && this.intervals.has(key)) {
      this.clearInterval(key);
    }
  };

  public clearInterval = (key: Interval) => {
    if (this.intervals.has(key)) {
      clearInterval(this.intervals.get(key));
      this.intervals.delete(key);
    }
  };
}

// usage
const interval = new RequestInterval();

interval.toggle(Interval.TEST, true, 1000, () => {
  console.log('ping');
});
// stop interval
interval.clearInterval(Interval.TEST);
// or
interval.toggle(Interval.TEST, false);
