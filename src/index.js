const url = 'http://localhost:3000/pups/'
let allDogs = []

function el(id){
    return document.createElement(id)
}
function qSelect(input){
    return document.querySelector(input)
}

document.addEventListener("DOMContentLoaded", ()=>{
    fetchAndRenderDogData()
    qSelect('#good-dog-filter').addEventListener('click', () => filterDogs())
})

function fetchAndRenderDogData(){
    fetch(url)
    .then(res => res.json())
    .then(dogArray=>{
        allDogs = dogArray
        dogArray.forEach(dog=>addDogSpan(dog))
    })
}

function addDogSpan(dog){
    let spanContainer = qSelect('#dog-bar')
    dogSpan = el('span')
    dogSpan.innerText = dog.name
    dogSpan.addEventListener("click",() => showDogInfo(dog))
    spanContainer.append(dogSpan)
}

function showDogInfo(dog){
    infoContainer = qSelect("#dog-info")
    infoContainer.innerHTML = ''
    dogImg = el('img')
    dogImg.src = dog.image
    
    dogName = el('h2')
    dogName.innerText = dog.name
    
    dogButton = el('button')
    dogButton.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"

    dogButton.addEventListener("click", () => toggleGoodDog(dog))

    infoContainer.append(dogImg, dogName, dogButton)
}

function toggleGoodDog(dog){
    let updatedGoodDogStatus = {
        isGoodDog: !dog.isGoodDog
    }
    let options = {
        method: 'PATCH',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(updatedGoodDogStatus)
    }
    fetch(url+dog.id, options)
    .then(res => res.json())
    .then(updatedDog => {
        showDogInfo(updatedDog)
        allDogs.forEach(dog => {
            if (dog.id == updatedDog.id){
                dog.isGoodDog = updatedDog.isGoodDog
            }
        })
    })
}


function filterDogs(){
    qSelect('#dog-bar').innerHTML = ''
    let buttonWordArray = qSelect('#good-dog-filter').innerText.split(' ')
    let filterStatus = buttonWordArray.pop()
    if (filterStatus == "OFF"){
        qSelect('#good-dog-filter').innerText = "Filter good dogs: ON"
        let filteredDogs = allDogs.filter(dog => dog.isGoodDog)
        filteredDogs.forEach(dog=> addDogSpan(dog))}
    else{
        qSelect('#good-dog-filter').innerText = "Filter good dogs: OFF"
        allDogs.forEach(dog=>addDogSpan(dog))
    }
}
