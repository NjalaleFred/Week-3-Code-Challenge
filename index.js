//Declare variables that I will use oftenly.
const baseURL = 'http://localhost:3000';

const headers = {
    'Content-Type' : 'application/json'
}

//Load your content to the dome
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    
    fetchFilm1();
    fetchFilms();
})

//Describe a function fetchFilms1 that will fetch the first film.
//In it is another function that renders the first character.

function fetchFilm1(){
    fetch(`${baseURL}/films/1`, {
        method : 'GET',
        headers,
    })
    .then((resp) => resp.json())
    .then(renderFilm)
    .catch((error) => {
        console.log(error);
    });
}

let f1 = document.querySelector('#f1_details')

//The function that renders the film is described. 
function renderFilm(film){
    const card = document.createElement('div')
    card.className = "card"

    card.innerHTML = `
    <h2> ${film.title} </h2>
    <p> ${film.description} </p>
    <img id="image" src ='${film.poster}' ></img>
    <p> Runtime : ${film.runtime} min </p>
    <p> Showtime : ${film.showtime} </p>
    `
//Available tickets is calculated.
   let AvailableTickets = `${film.capacity}` - `${film.tickets_sold}`

   const p = document.createElement('p')
   p.innerText =  `Available tickets : ${AvailableTickets}`

   const btn = document.createElement('button')
   btn.innerText = 'Buy Ticket'
   btn.type = 'button'

   //Here the btn receives a callback function that is executed when it is clicked.
    btn.addEventListener('click', () => {

        if (`${film.capacity}`>`${film.tickets_sold}`){
            film.tickets_sold+=1;
            AvailableTickets-=1;
            if (`${film.capacity}`=== `${film.tickets_sold}`){
                btn.innerHTML = 'Sold Out';
                btn.disabled = true;

            } else {
                btn.innerHTML = 'Buy Ticket'
            }
        }

    //Call a function that will update the number of tickets sold in the server.
        updateTicket(film)
        p.textContent = `Available tickets : ${AvailableTickets}`
    })
    //Append the created elements.
    f1.innerHTML = '';
    f1.append(card,p, btn,);
}

//The function is described and the server is updated using put.
function updateTicket(film) {
    fetch(`${baseURL}/films/${film.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(film)
  })
  .then(response => response.json())
  .then(updatedFilm => {
    console.log(updatedFilm);
  })
  .catch(error => {
    console.error(error);
  });
}

//Another function that fetches all films is described that will show a list of the films.
//It received a function that renders the films.
function fetchFilms(){
    fetch(`${baseURL}/films`, {
        method : 'GET',
        headers
    })
    .then((resp) => resp.json())
    .then(renderFilms)
    .catch((error) => {
        console.log(error);
    })
}

//The function that renders the films is described.
function renderFilms(film){

    const allFilms = document.querySelector('#all_films')
    allFilms.innerHTML = '<h2> MENU </h2>'

//A forEach loop is used to loop over the the films and then renders the film titles.
   film.forEach((film) => {
    const list = document.createElement('ul');
    list.className = "films"
    list.innerHTML = `
    <li> ${film.id} : ${film.title} </li>
   `
   if (film.tickets_sold >= film.capacity) {
    list.classList.add('sold-out');
}

/*Instead of creating another get request you just pass the renderFilm
as a callback function as it is reusable.*/ 

    list.addEventListener('click', ()=> {
        renderFilm(film);
    })

   //Created elements are then appended.
   allFilms.append(list);
});
}
