// weather.js
const OPENWEATHERMAP_API_KEY = '4a46f47acf8b19c1f7f9b094f2ed76ae'; // Ganti dengan API key Anda

function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=id`;

    $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
            displayWeather(response);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching weather data:', error);
            $('#weatherInfo').text('Gagal memuat data cuaca').removeClass('hidden');
        }
    });
}

function displayWeather(data) {
    const weatherHtml = `
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mt-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Informasi Cuaca</h3>
            <p class="text-gray-700 dark:text-gray-300">
                <i class="fas fa-thermometer-half text-red-500 mr-2"></i>Suhu: ${data.main.temp}°C
            </p>
            <p class="text-gray-700 dark:text-gray-300">
                <i class="fas fa-tint text-blue-500 mr-2"></i>Kelembaban: ${data.main.humidity}%
            </p>
            <p class="text-gray-700 dark:text-gray-300">
                <i class="fas fa-cloud text-gray-500 mr-2"></i>Cuaca: ${data.weather[0].description}
            </p>
        </div>
    `;
    $('#weatherInfo').html(weatherHtml).removeClass('hidden');
}