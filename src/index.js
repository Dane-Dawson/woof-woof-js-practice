//labeling the url I target for my fetches, adding a / at the end to add ids later
const url = "http://localhost:3000/pups/";
//setting up an empty local storage array to hold all my dogs once I fetch them
let allDogs = [];
//Helper function to create elements quickly
function el(id) {
  return document.createElement(id);
}
//Same thing but for querySelector
function qSelect(input) {
  return document.querySelector(input);
}

//After dom has loaded we run two things
document.addEventListener("DOMContentLoaded", () => {
  //1st the fetchDogData function
  fetchDogData();
  //then adding the event listener to the filter button, firing our filterGoodDogs function
  qSelect("#good-dog-filter").addEventListener("click", () => {
    filterGoodDogs();
  });
});

//fetchDogData is our primary GET fetch
function fetchDogData() {
  fetch(url)
    .then((res) => res.json())
    .then((dogArray) => {
      //this is to store the data locally in our local allDogs array
      allDogs = dogArray;
      //Here we iterate through the dogArray and make a span with each
      dogArray.forEach(addDogSpan);
    });
}

//This functions sole purpose is to add a single span when given a dog object
function addDogSpan(dog) {
  //next two lines demonstrate our helper functions defined above well
  let dogBar = qSelect("#dog-bar");
  let span = el("span");
  //set inner value of span, and add an event listener
  span.innerText = dog.name;
  span.addEventListener("click", () => {
    //passing our dog down into this function makes it easier to access the information about the dog directly in the showDogInfo function
    showDogInfo(dog);
  });
  //Don't forget to add it to the DOM!
  dogBar.append(span);
}

//This functions sole purpose is to render the dog info on the DOM
function showDogInfo(dog) {
  //Grab, label and empty the container div. We want the div to show only 1 dogs info!
  let dogContainer = qSelect("#dog-info");
  dogContainer.innerHTML = "";

  //Create elements and add appropriate properties/attributes
  let img = el("img");
  img.src = dog.image;

  let h2 = el("h2");
  h2.innerText = dog.name;

  //This is called a ternary, we'll learn more about it soon
  let button = el("button");
  button.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
  //but functionally ln 66 does the same as listed below
  // if (dog.isGoodDog  == true ) {
  //     button.innerText = "Good Dog!"
  // } else {
  //     button.innerText = "Bad Dog!"
  // }
  //We have to add an event listener so our button click actually does something
  button.addEventListener("click", () => {
    //I give it the dog object as well, there are many ways to do this
    toggleGoodDog(dog);
  });
  //Don't forget to append this stuff too!
  dogContainer.append(img, h2, button);
}

//This function handles toggling a dog's isGoodDog status
function toggleGoodDog(dog) {
  //First wrap up the object, defining which attribute you are updating and what the new value is
  let updatedGoodDogStatus = {
    isgoodDog: !dog.isGoodDog,
  };
  //Create our options package with appropriate values
  let options = {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(updatedGoodDogStatus),
  };

  //Send our patch request out
  fetch(url + dog.id, options)
    .then((res) => res.json())
    //Our recieved data will be the newly updated dog object
    .then((updatedDog) => {
      //Instead of targeted a single button, I simply invoke showDogInfo with the new dog to re-render the whole info panel
      showDogInfo(updatedDog);
      //I then go through my local array and make sure I update that dog as well. Alternatively I could do another GET fetch, but this minimized DB interaction
      allDogs.forEach((dog) => {
        if (dog.id == updatedDog.id) {
          dog.isGoodDog = updatedDog.isGoodDog;
        }
      });
    });
}

function filterGoodDogs() {
  //Clear out our span collector, as we want to have a new array of buttons with each click
  qSelect("#dog-bar").innerHTML = "";

  let button = qSelect("#good-dog-filter");
  //Get the last word of the button for my if/else
  let filterStatus = button.innerText.split(" ").pop();
  //if the button says "off" when I click it, I want it to turn on
  if (filterStatus == "OFF") {
    //set text to on
    button.innerText = "Filter good dogs: ON";
    //create a filtered array of only good dogs
    let filteredDogs = allDogs.filter((dog) => dog.isGoodDog == true);
    //add spans for each of those filtered dogs
    filteredDogs.forEach((dog) => addDogSpan(dog));
  } else {
    //If we don't filter, we already have that allDogs array stored and up to date for reference.
    button.innerText = "Filter good dogs: OFF";
    allDogs.forEach((dog) => addDogSpan(dog));
  }
}
