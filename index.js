let clear = document.querySelector(".to-do__clear");
let date = document.querySelector("#date");
let list = document.querySelector("#list");
let input = document.querySelector("input");
let plus = document.querySelector(".to-do_plus");
let progressBar = document.querySelector(".to-do__progress-bar-inner")

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

let format = {weekday: "long", month: "short", day:"numeric"};
let todayDate = new Date();
date.innerHTML = todayDate.toLocaleDateString("en-US", format);


let LIST, id, doneTasks = 0;

let tasks = localStorage.getItem("TASK");
if(tasks){
    LIST = JSON.parse(tasks);
    id = LIST.length;
    let inTrash = 0;
    for(let i = 0; i<LIST.length; i++){
        if(LIST[i].trash){
            inTrash++;
        }
    }

    for(let i = 0; i<LIST.length; i++){
        if(LIST[i].done && !LIST[i].trash){
            doneTasks++;
        }
    }
    doneTasks = doneTasks * 100 / (LIST.length - inTrash);
    progressBar.style.width = `${doneTasks}%`;
    loadList(LIST);
}else{
    progressBar.style.width = `${doneTasks}%`;
    LIST = [];
    id = 0;
}

function loadList(list){
    list.forEach((item) => {
        addToDO(item.task, item.id, item.done, item.trash);
    });
}

clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});

function addToDO(todo, id, done, trash){

    if(trash) { return; }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH: "";

    const item = `<li class="to-do__item">
                    <i class="fa ${DONE} co" data-job="complete" id="${id}"></i>
                    <p class="text ${LINE}"> ${todo} </p>
                    <i class="fa fa-trash-o de" data-job="delete" id="${id}"></i>
                  </li>`;

    let position = "beforeend";
    list.insertAdjacentHTML(position, item);
}

plus.addEventListener("click", function(event){
    const task = input.value;
    if(task){
        addToDO(task, id, false, false);
        input.value ="";
        LIST.push({
            task: task,
            id: id,
            done: false,
            trash: false
        });

        localStorage.setItem("TASK", JSON.stringify(LIST));
        location.reload();
        id++;
    }
});

function completeTask(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);

    LIST[element.id].done = !LIST[element.id].done;
    location.reload();

}

function deleteTask(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
    location.reload();
}

list.addEventListener("click", function(event){
    const element = event.target;
    const elementJob = element.attributes["data-job"].value;

    if(elementJob === "complete"){
        completeTask(element);
    }else{
        deleteTask(element);
    }

    localStorage.setItem("TASK", JSON.stringify(LIST));
});