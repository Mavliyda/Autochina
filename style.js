const taskList= document.getElementById("taskList");
const todoForm=document.getElementById("todoForm");
const taskInput=document.getElementById("taskInput");
const statsText=document.getElementById("statsText");
const emptyState=document.getElementById("emptyState");
const filters=document.querySelector('.filters');
const btns=document.querySelectorAll("[data-filter]");
const clearCompletedBtn=document.getElementById("clearCompletedBtn");

const STORAGE_KEY="todo.tasks.v1";

const storage={
    load(){
        try{
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        }catch{
            return[];
        }
    },
    save(tasks){
        localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks))
    }
}

const state={
    tasks: storage.load(),
    filter:"all"
}


function getFiltered(){
    if(state.filter === "active"){
        return state.tasks.filter(task => !task.completed)
    }else if(state.filter === "completed"){
        return state.tasks.filter(task => task.completed);
    }
    return state.tasks;
}

function render() {
    const filteredTasks= getFiltered();
    taskList.innerHTML=filteredTasks.map(task => `<li class="item ${task.completed ? "is-completed": ""}"data-id="$task.id}">
        <input class="checkbox" type="checkbox" ${task.completed ? "checked" : ""} data-action="toggle"/>
        <p class="item__text">${task.text}</p>
        <button class="icon-btn danger" data-action="delete">Ochuruu</button>
        </li`).join("");
         emptyState.hidden=filteredTasks.length !== 0;

         const total = state.tasks.length;
         const completed = state.tasks.filter(task => task.completed).length;
         statsText.textContent =`Baary:${total} * Atkarulgan:${completed}`
         clearCompletedBtn.disabled = completed === 0;
}


function toggleTask(id) {
    state.tasks=state.tasks.map(task => task.id === id ? {... task, completed: !task.completed}:task);
   storage.save(state.tasks);
    render();
}
function deleteTask(id){
    state.tasks=state.tasks.filter(task => task.id !== id);
    storage.save(state.tasks);
    render();
}

todoForm.addEventListener("submit",function(event){
event.preventDefault();
const task= taskInput.value;
if(!task.trim()){
    return;
}
state.tasks.unshift({text:task,id:Date.now(),completed: false});
storage.save(state.tasks);
render();
taskInput.value="";
});

taskList.addEventListener("click", function(e){
    const id = Number(e.target.parentElement.dataset.id);
    const action= e.target.dataset.action;
    if(action === "toggle"){
        toggleTask(id);
    }else if(action === "delete")
    {
        deleteTask(id)
    }
});


filters.addEventListener("click",function(e){
    const active = e.target.dataset.filter;
    state.filter= active;
    btns.forEach(btn =>{
        btn.classList.toggle("is-active",state.filter === btn.dataset.filter)
    });
    render();
})

clearCompletedBtn.addEventListener("click", function(){
    state.tasks=state.tasks.filter(task => !task.completed);
storage.save(state.tasks);
render();
})

render();