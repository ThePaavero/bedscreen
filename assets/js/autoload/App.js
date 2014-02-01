Project.App = function (){

	var running;
	var hours;
	var minutes;
	var seconds;
	var player;

	var alarm = {
		year   : new Date().getFullYear(),
		month  : new Date().getMonth() + 1,
		day    : new Date().getDate(),
		hours  : 7,
		minutes: 45,
		seconds: 0
	};

	var weekdays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	this.init = function()
	{
		console.log('Project initializing...');

		player = document.getElementById('alarm_audio_file');

		doOnDayChange();
		getWeather();
		tick();

		setInterval(getWeather, 1800000); // 30 minutes

		doDebugToolListeners();
		setStyle();
		doControls();
	};

	var tick = function()
	{
		var now = new Date();

		hours   = now.getHours();
		minutes = now.getMinutes();
		seconds = now.getSeconds();

		updateOnSecondChange();

		running = setTimeout(tick, 1000);
	};

	var updateOnSecondChange = function()
	{
		if(hours === 23 && minutes === 59 && seconds === 59)
		{
			doOnDayChange();
		}

		updateClock();
		updateNextAlarm();

		// Alarm?
		if(alarm.hours === hours && alarm.minutes === minutes && alarm.seconds === seconds)
		{
			doAlarm();
		}
	};

	var doOnDayChange = function()
	{
		var now = new Date();
		var weekday_key = now.getDay();
		var new_weekday = weekdays[weekday_key];
		$('#weekday').html(new_weekday);
	};

	var updateClock = function()
	{
		var formatted_seconds = seconds < 10 ? '0' + seconds : seconds;

		$('#clock .hours').html(hours + ':');
		$('#clock .minutes').html(minutes);
		$('#clock .seconds').html(':' + formatted_seconds);
	};

	var doAlarm = function()
	{
		console.log('ALARM!');
		$('body').addClass('day');
		playMp3();
	};

	var doDebugToolListeners = function()
	{
		$('#debug_tools .setoffalarm').on('click.debugtools', function()
		{
			doAlarm();
			return false;
		});

		$('#debug_tools .switchdaynightmode').on('click.debugtools', function()
		{
			var str = $('body').hasClass('night') ? 'day' : 'night';
			switchDayNightMode(str);
			return false;
		});
	};

	var updateNextAlarm = function()
	{
		// var next_alarm = moment([alarm.year, alarm.month, alarm.date]).fromNow();
		// console.log([alarm.year, alarm.month, alarm.day]);
		// console.log(next_alarm);
	};

	var updateWeather = function(data)
	{
		console.log(data);

		var container           = $('#weather');
		var temp_indicator      = container.find('.temp');
		var condition_indicator = container.find('.condition');

		var temp = data.main.temp;
		var condition = data.weather[0].main;

		temp_indicator.html(temp + '° C');
		condition_indicator.html(condition);
	};

	var getWeather = function()
	{
		console.log('Getting weather...');

		$.ajax({
			url: 'http://api.openweathermap.org/data/2.5/weather?q=Espoo,fi&units=metric',
			dataType: 'json',
			success: function(response)
			{
				console.log('Got weather.');
				updateWeather(response);
			}
		});
	};

	var playMp3 = function()
	{
		var vol    = 50;

		player.volume = vol / 100;
		player.play();

		setTimeout(function()
		{
			player.volume = 1;
		}, 10000);
	};

	var setStyle = function()
	{
		var set_day = false;

		if(hours > 7 && hours < 21)
		{
			set_day = true;
		}

		if(set_day)
		{
			$('body').addClass('day');
		}
	};

	var doControls = function()
	{
		$(document).on('keydown', function(e)
		{
			if(e.keyCode === 32)
			{
				// Space
				shutDownAlarm();
			}
		});

		$(document).on('dblclick', promptForAlarmTime);

		$(document).on('click', shutDownAlarm);
	};

	var shutDownAlarm = function()
	{
		console.log('Alarm stopped');
		player.pause();
	};

	var switchDayNightMode = function(set_mode_to)
	{
		$('body').removeClass();
		$('body').addClass(set_mode_to);
	};

	var promptForAlarmTime = function()
	{
		var set_to = {
			hours  : parseInt(window.prompt('Hour'), 10),
			minutes: parseInt(window.prompt('Minute'), 10)
		};

		if(isNaN(set_to.hours) || isNaN(set_to.hours))
		{
			alert('NaN problem, not setting new values for alarm time.');
			return false;
		}

		alarm.hours   = set_to.hours;
		alarm.minutes = set_to.minutes;

		console.log(alarm);
	};

};
