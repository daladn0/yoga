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

    // Slider

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = dotsWrap.querySelectorAll('.dot');

    showSlides(slideIndex);

    function showSlides(n) {
        if( n > slides.length ) slideIndex = 1;
        if( n < 1 ) slideIndex = slides.length;

        slides.forEach(item => item.style.display = 'none');
        dots.forEach(item => item.classList.remove('dot-active'));
        
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        slideIndex += n;
        showSlides(slideIndex);
    }

    function currentSlide(n) {
        slideIndex = n
        showSlides(slideIndex);
    }

    prev.addEventListener('click', () => {
        plusSlides(-1);
    });

    next.addEventListener('click', () => {
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function(e){
        let tg = event.target;

        for(let i = 0; i < dots.length + 1; i++) {
            if(tg.classList.contains('dot') && tg == dots[i-1]) {
                currentSlide(i);
            }
        }
    });


    // Calculator
    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        
        personsSum = 0,
        daysSum = 0,
        total = 0;

    totalValue.textContent = '0';

    persons.addEventListener('change', function(){
        personsSum = +this.value;
        total = (daysSum + personsSum) * 4000;

        if(restDays.value == '') {
            totalValue.textContent = 0;
        } else {
            totalValue.textContent = total;
        }
    });

    restDays.addEventListener('change', function(){
        daysSum = +this.value;
        total = (daysSum + personsSum) * 4000;

        if(daysSum.value == '') {
            totalValue.textContent = 0;
        } else {
            totalValue.textContent = total;
        }
    });

    place.addEventListener('change', function() {
        if(daysSum.value == '' || restDays.value == '') {
            totalValue.textContent = 0;
        } else {
            let a = total;
            totalValue.textContent = a * this.options[this.selectedIndex].value;
        }


    });

});