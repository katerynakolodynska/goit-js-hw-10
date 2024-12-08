
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";



const datePicker = document.querySelector("#datetime-picker");
const btnStart = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondEl = document.querySelector("[data-seconds]");

let selectedDate = null;
let myTimer = null;
btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      console.log(selectedDates[0]);
      if (new Date().getTime() > selectedDates[0].getTime()) {
          iziToast.error({
              title: 'Error',
              message: `Please choose a date in the future`,
              position: 'topRight',
              color: '#ef4040',
              messageColor: '#fff',
          });
      } else {
         selectedDate = selectedDates[0];
         btnStart.disabled = false;
      }
  },
};

btnStart.addEventListener('click', () => {
    if (selectedDate) {
        btnStart.disabled = true;
        myTimer = setInterval(() => {
            const difference = selectedDate.getTime() - new Date().getTime();
            if (difference < 1000) {
                clearInterval(myTimer);
                secondEl.textContent = '00';
            } else {
                daysEl.textContent = addZero(convertMs(difference).days);
                hoursEl.textContent = addZero(convertMs(difference).hours);
                minutesEl.textContent = addZero(convertMs(difference).minutes);
                secondEl.textContent = addZero(convertMs(difference).seconds);
            }
        }, 1000);
    }
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addZero(value) {
    return value.toString().padStart(2, '0');
}

flatpickr(datePicker, options);

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}


