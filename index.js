const nameInput= document.querySelector("#nameInput");
const roleInput=document.querySelector("#roleInput");
const cityInput=document.querySelector("#cityInput");
const imgUrlInput=document.querySelector("#imgUrlInput");
const form=document.querySelector("form");
const usersEl=document.querySelector("#users")

form.addEventListener("submit", function(event){
    event.preventDefault()

    const cardEl=document.createElement("div");
    cardEl.classList.add("card");

    const role=roleInput.value;
    const city=cityInput.value;
    const name=nameInput.value;
    const imgUrl=imgUrlInput.value;

    if(name === '' || city === '' || role === '' || imgUrl === ''){
        alert ("Baardyk maalymattar bolush kerek");
        return;
    }

    const imgEl=document.createElement("img");
    imgEl.src=imgUrl;
    imgEl.classList.add("avatar");
    imgEl.alt=name;

    const infoEl=document.createElement("div");


    const nameEl=document.createElement("h3");

    nameEl.textContent=name;
nameEl.classList.add("name");


    const metaEl=document.createElement("p");
    metaEl.textContent=`${role}• ${city}`;
    metaEl.classList.add("meta");

    infoEl.append(nameEl,metaEl);

    const deleteBtn=document.createElement("button");
    deleteBtn.textContent="Delete";

    deleteBtn.addEventListener("click",function(event){
        cardEl.remove();
    })
    cardEl.append(imgEl,infoEl,deleteBtn);
    
    nameInput.value='';
    roleInput.value='';
    cityInput.value='';
    imgUrlInput.value='';

    usersEl.append(cardEl);
    
}
form.addEventListener("submit",createCard)

nameInput.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        createCard(event)
    }
});

usersEl.addEventListener("click, function(event"){
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
    }
 });
