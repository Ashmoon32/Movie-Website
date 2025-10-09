fetch('http://localhost:3001/movies')
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:',error));