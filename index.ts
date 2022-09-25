import { observable, Observable, Subject } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

const timerObservable = new Observable<number>((timerObservableFunc) => {
  let counter = 0;

  const timerCallback = () => {
    counter++;
    console.log(`[Observable] Debug: counter = ${counter}`)
    if (counter > 5) {
      timerObservableFunc.error('Hiba az emittált érték nagyobb 5!');
    } else {
      timerObservableFunc.next(counter);
    }
  };
  const timerId = setInterval(timerCallback, 500);

  return () => {
    clearInterval(timerId);
  };
}).pipe(
  tap((emitVal: number) => console.log(`[Observable] Info: counter = ${emitVal}`)),
  map((emitVal) => emitVal + 2),
);

const subject1 = new Subject<number>();
timerObservable.subscribe(subject1);

// Add subscribers
const subscription1 = subject1.pipe(filter((e) => e % 2 === 1)).subscribe(
  (res) => {
    console.log('[Subscriber 1] Info: observable emits', res)
    document.getElementById('subscriber1-list').innerHTML = document.getElementById('subscriber1-list').innerHTML + `<li>${res}</li>`;
  },
  (err) => console.error('[Subscriber 1] Error:', err),
);

const subscription2 = subject1.subscribe(
  (res) => {
    console.log('[Subscriber 2] Info: Observable emits', res)
    document.getElementById('subscriber2-list').innerHTML = document.getElementById('subscriber2-list').innerHTML + `<li>${res}</li>`;
  },
  (err) => console.error('[Subscriber 2] Error:', err)
);
