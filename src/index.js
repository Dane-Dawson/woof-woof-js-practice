const url = 'http://localhost:3000/pups/'
let allDogs = []

function el(id){
    return document.createElement(id)
}

function qSelect(input){
    return document.querySelector(input)
}

document.addEventListener("DOMContentLoaded", () => {
    fetchDogData()
    qSelect('#good-dog-filter').addEventListener('click', () => {
        filterGoodDogs()
    })
})


function fetchDogData(){
    fetch(url)
    .then(res=>res.json())
    .then(dogArray=>{
        allDogs = dogArray
        dogArray.forEach(dog=>addDogSpan(dog))
    })
    // .then(dogArray=>dogArray.forEach(addDogSpan))
}


function addDogSpan(dog){
    let dogBar = qSelect("#dog-bar")
    let span = el('span')
    span.innerText = dog.name
    span.addEventListener('click', () => {
        showDogInfo(dog)
    })
    dogBar.append(span)
}

function showDogInfo(dog){
    let dogContainer = qSelect("#dog-info")
    dogContainer.innerHTML = ''

    let img = el('img')
    img.src = dog.image

    let h2 = el('h2')
    h2.innerText = dog.name

    let button = el('button')
    button.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
    
    // if (dog.isGoodDog  == true ) {
    //     button.innerText = "Good Dog!"
    // } else {
    //     button.innerText = "Bad Dog!"
    // }
    button.addEventListener('click', () => {
        toggleGoodDog(dog)
    })

    dogContainer.append(img, h2, button)
}

function toggleGoodDog(dog){

    let updatedGoodDogStatus = {
        isgoodDog: !dog.isGoodDog
    }

    let options = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(updatedGoodDogStatus)
    }

    fetch(url+dog.id, options)
    .then(res => res.json())
    .then(updatedDog => {
        showDogInfo(updatedDog)
        allDogs.forEach(dog=>{
            if (dog.id == updatedDog.id){
                dog.isGoodDog = updatedDog.isGoodDog
            }
        })
    })
}

function filterGoodDogs(){
    qSelect("#dog-bar").innerHTML = ''

    let button = qSelect('#good-dog-filter')
    let filterStatus = button.innerText.split(' ').pop()
    if (filterStatus == "OFF"){
        button.innerText = "Filter good dogs: ON"
        let filteredDogs = allDogs.filter(dog => dog.isGoodDog == true)
        filteredDogs.forEach(dog=>addDogSpan(dog))
    } else {
        button.innerText = "Filter good dogs: OFF"
        allDogs.forEach(dog=>addDogSpan(dog))
    }
    // console.log(buttonWordArray, filterStatus)
}