In this lab, I learned to integrate APIs into websites. Prior to this lab, I had some REST API experience. Reading the API documentation and endpoints from OpenWeatherMap helped a lot with the integration. I also had to do research on other sources online to implement it into my JavaScript file. I was able to display the current weather, hourly weather, and daily weather using OpenWeatherMap. One challenge I faced was that I wanted to show more days in my daily weather chart but could not get the API calls to work and realize it was because the 16 day forecast requires you to pay. I decided to use the 5 day forecast, which is free. I looked at other free weather APIs online and saw that the National Weather Service (NWS) API allowed me to get data about severe weather alerts, so I added that box on my web app as well. For the cretivity element, I decided to change the background color of the app based on the three most common conditions (clear = light yellow background, rain = light blue background, and clouds = gray background). The default for all other conditions is a light gray background. Below are the resources I used to complete this lab.

Resources:

https://api.openweathermap.org/data/2.5/weather?q=Troy,US&appid=cbd49bc6ee5d2b6eb33c1b6aa0fc0375&units=imperial
https://api.openweathermap.org/data/2.5/forecast?q=Troy,US&appid=cbd49bc6ee5d2b6eb33c1b6aa0fc0375&units=imperial
https://forecast.weather.gov/MapClick.php?lat=42.7277&lon=-73.6911

https://openweathermap.org/current
https://openweathermap.org/api/hourly-forecast
https://openweathermap.org/forecast5 
https://api.weather.gov/

https://www.w3schools.com/js/js_api_intro.asp
https://www.w3schools.com/js/js_ajax_http.asp