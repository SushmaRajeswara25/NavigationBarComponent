const slider = document.querySelector('.slider');
const currentTime = document.querySelector('.city-time');

const cityTimeZoneMap = {
  "Cupertino": "America/Los_Angeles",
  "New York City": "America/New_York",
  "London": "Europe/London",
  "Amsterdam": "Europe/Amsterdam",
  "Tokyo": "Asia/Tokyo",
  "Hong Kong": "Asia/Hong_Kong",
  "Sydney": "Australia/Sydney"
};

//fetch data from json file
function fetchData() {
    fetch('../navigation.json')
    .then(response => response.json())
    .then(data => {
        getNavItems(data.cities);
    })
    .catch(error => console.log('Error fetching JSON data: ', error));
}

fetchData();


//create links for each city
function getNavItems(cities) {
    const ul = document.getElementById('navbar');
    cities.map((city) => {
    const navItem = document.createElement("li");
    const navLink = document.createElement("a");
    navLink.textContent = city.label;
    navLink.href = '#';
    navLink.classList.add('nav-link');
    navLink.setAttribute('aria-label', city.label);
    const slider = document.querySelector('.slider');
    navItem.appendChild(navLink);
    ul.insertBefore(navItem, slider);
  });

  const navItems = document.querySelectorAll('.nav-link');
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
        document.querySelector('.nav-link.active')?.classList.remove('active');
        item.classList.add('active');
        positionSlider(item);
        currentTime.innerHTML = `Current time in ${item.textContent}` + `<h1>${getCurrentTimeInCity(item.innerText)}</h1>`;
    });
  });
}

function positionSlider(item) {
  const { offsetLeft, offsetWidth } = item;
  slider.style.left = `${offsetLeft}px`;
  slider.style.width = `${offsetWidth}px`;
}

window.addEventListener('resize', () => {
  const activeItem = document.querySelector('.nav-link.active');
  if (activeItem) {
    positionSlider(activeItem);
  }
});

function getCurrentTimeInCity(city) {
  try {
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: cityTimeZoneMap[city],
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    return timeFormatter.format(now);
  } catch (error) {
    return `Could not find timezone information for ${city}.`;
  }
}