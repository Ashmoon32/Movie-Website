const APILINK = 'http://localhost:3001/movies';
const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

// Load movies when page loads
returnMovies(APILINK);

function returnMovies(url) {
  fetch(url)
    .then(res => res.json())
    .then(function(data) {
      console.log(data);
      // Clear existing content
      main.innerHTML = '';
      
      data.forEach(element => {
        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'card');
        
        const div_row = document.createElement('div');
        div_row.setAttribute('class', 'row');
        
        const div_column = document.createElement('div');
        div_column.setAttribute('class', 'column');
        
        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        // For now, we'll use a placeholder image
        image.src = './placeholder.jpg';
        
        const title = document.createElement('h3');
        const year = document.createElement('p');
        const rating = document.createElement('p');
        
        title.innerHTML = `${element.title}`;
        year.innerHTML = `Year: ${element.year}`;
        rating.innerHTML = `Rating: ${element.rating}`;
        
        const center = document.createElement('center');
        center.appendChild(image);
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_card.appendChild(year);
        div_card.appendChild(rating);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);
        
        main.appendChild(div_row);
      });
    });
}

// Search functionality
form.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = '';
  
  const searchItem = search.value;
  
  if (searchItem) {
    // For now, we'll filter on the frontend
    // Later we can implement backend search
    returnMovies(APILINK)
      .then(() => {
        // Filter results on client side
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
          const title = card.querySelector('h3').textContent.toLowerCase();
          if (!title.includes(searchItem.toLowerCase())) {
            card.parentElement.parentElement.style.display = 'none';
          }
        });
      });
    search.value = "";
  } else {
    // If search is empty, show all movies
    returnMovies(APILINK);
  }
});