window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Tabs
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');
   
    function hideTabContent(a) {
        for ( let i = a; i < tabContent.length; i++ ) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    function showTabContent(b) {
        if ( tabContent[b].classList.contains('hide') ) {
            tabContent[b].classList.add('show');
            tabContent[b].classList.remove('hide');
        }
    }

    hideTabContent(1);

    info.addEventListener('click', function(e) {
        let target = e.target;

        if (target && target.classList.contains('info-header-tab')) {
            for ( let i = 0; i < tabContent.length; i++ ) {
                if ( target == tab[i] ) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    // Timer
    let deadline = '2021-01-01';
    
    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse( new Date() ),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60) % 60),
            hours = Math.floor((t/(1000*60*60)));

            return {
                total: t,
                hours,
                minutes,
                seconds,
            };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);
            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;
        
            if( t.total <= 0 ) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('timer', deadline);


    // Modal widnow

    let  more = document.querySelector('.more'),
         overlay = document.querySelector('.overlay'),
         close = document.querySelector('.popup-close');

    more.addEventListener('click', windowShow);
    close.addEventListener('click', windowClose);

    function windowShow() {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    }

    function windowClose() {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    }

    // Send form

    let message = {
        loading: 'Loading..',
        success: 'Thanks! We will contact you shortly!',
        failure: 'Something is wrong..',
    };

    let form = document.querySelector('.main-form'),
        input = form.querySelectorAll('input'),
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        let formData = new FormData(form);
        let obj = {};

        formData.forEach( (value, key) => obj[key] = value );

        let json = JSON.stringify(obj);

        request.send(json);

        request.addEventListener('readystatechange', function() {
            if(request.readyState < 4) {
                statusMessage.textContent = message.loading;

            } else if(request.readyState === 4 && request.status == 200) {
                statusMessage.textContent = message.success;
            } else {
                statusMessage.textContent = message.failure;
            }
        });

        for(let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
    });
});