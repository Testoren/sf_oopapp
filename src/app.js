import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { generateTestUser } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";
import { authAdmin } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");

generateTestUser(User);

let arr_backlog=[];
let arr_ready=[];
let arr_inprogress=[];
let arr_finished=[];
class Users{
  constructor(id, name, tasks){
    this.id = id;
    this.name = name;
    this.tasks = tasks;
  }
}
const user = new Users('user', 'UserName', ['task1', 'task2'] );
const admin = new Users('admin', 'nameOfAdmin', 'to enter a tasks for developing');

let content = document.querySelector("#content");
let ul_task_backlog = document.querySelector(".ul-task-backlog");
let ul_task_ready = document.querySelector(".ul-task-ready");
let ul_task_inprogress = document.querySelector(".ul-task-inprogress");
let ul_task_finished = document.querySelector(".ul-task-finished");
let btn_backlog = document.querySelector("#btn-backlog");
let btn_ready = document.querySelector("#btn-ready");
let btn_inprogress = document.querySelector("#btn-inprogress");
let btn_finished = document.querySelector("#btn-finished");
let btn_task_submit = document.querySelector(".btn-task_submit");
let p_task_active = document.querySelector(".task-footer__active");
let p_task_finished = document.querySelector(".task-footer__finished");
let p_backlog_add_task = document.querySelector(".input_add_task");
let p_content_account = document.querySelector("#content-account");
let p_content_tasks = document.querySelector("#content-tasks");
let p_kanban_board = document.querySelector("#kanban-board");
let resAdmin = false;

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  let res = authUser(login, password);
  if (res){
    document.querySelector("#content").innerHTML = taskFieldTemplate; 
    resAdmin = authAdmin(login, password);
    document.querySelectorAll('.form-control').forEach(e =>{e.value = ''})

    onload();    
  }
  else  
  {
    document.querySelector("#content").innerHTML = noAccessTemplate;  
  } 
});

/*при старте страницы заполняем все значения*/ 
function onload()
{
  content = document.querySelector("#content");
  ul_task_backlog = document.querySelector(".ul-task-backlog");
  ul_task_ready = document.querySelector(".ul-task-ready");
  ul_task_inprogress = document.querySelector(".ul-task-inprogress");
  ul_task_finished = document.querySelector(".ul-task-finished");
  btn_backlog = document.querySelector("#btn-backlog");
  btn_ready = document.querySelector("#btn-ready");
  btn_inprogress = document.querySelector("#btn-inprogress");
  btn_finished = document.querySelector("#btn-finished");
  btn_task_submit = document.querySelector(".btn-task_submit");
  p_task_active = document.querySelector(".task-footer__active");
  p_task_finished = document.querySelector(".task-footer__finished");
  p_backlog_add_task = document.querySelector(".input_add_task");
  p_content_account = document.querySelector("#content-account");
  p_content_tasks = document.querySelector("#content-tasks");
  p_content_account.textContent = resAdmin?admin.name:user.name;
  p_content_tasks.textContent = resAdmin?admin.tasks:user.tasks;
  p_kanban_board = document.querySelector("#kanban-board");
  p_kanban_board.textContent = 'Kanban Board for ';
  p_kanban_board.textContent += resAdmin?admin.name:user.name;
  onInit();
};
 
/*функция заполнения карточки из localstorage*/ 
const onInit = () => {
  clearList(ul_task_backlog);
  fullList(ul_task_backlog, arr_backlog);
 
  clearList(ul_task_ready);
  fullList(ul_task_ready, arr_ready);
 
  clearList(ul_task_inprogress);
  fullList(ul_task_inprogress, arr_inprogress);
  
  clearList(ul_task_finished);
  fullList(ul_task_finished, arr_finished);
  
  setButtonStyle(btn_ready, arr_backlog);
  setButtonStyle(btn_inprogress, arr_ready);
  setButtonStyle(btn_finished, arr_inprogress);
  setButtonStyleBacklog(btn_backlog);

  fullActiveFinishedTasks();
};
 
/*устанавливаем для конпки значения disable*/
function setButtonStyle(btn, arr){
  if (arr.length == 0 || resAdmin)
    btn.className = 'dropbtn_disable';
  else
    btn.className = 'dropbtn';
}
 
/*устанавливаем для кнопки значения disable*/
function setButtonStyleBacklog(btn){
  if (!resAdmin)
    btn.className = 'dropbtn_disable';
  else
    btn.className = 'dropbtn';
}
 
/*очищаем список*/
function clearList(my_ul){
  while (my_ul.firstChild) {
    my_ul.removeChild(my_ul.firstChild);
  }
};
 
/*заполняем список*/
function fullList(my_ul, arr ){
  for (let i = 0; i< arr.length; i++)
  {
      const newLi = document.createElement('li');
      newLi.className = 'li'; 
      newLi.textContent = arr[i];
      my_ul.appendChild(newLi);      
  }                 
};
 
function fullActiveFinishedTasks(){
  p_task_active.textContent = "Active tasks: " + arr_backlog.length;
  p_task_finished.textContent = "Finished tasks: " + arr_finished.length;
}

/*заполняем список*/
function fullList_ul(my_ul, arr, my_ul_list, arr_list ){
  for (let i = 0; i< arr.length; i++)
  {
      const newLi = document.createElement('li');
      newLi.className = 'li';
      const newButton = document.createElement('button');
      newButton.type = 'button';
      newButton.textContent = arr[i];
      newButton.className = 'btn-list';
      newButton.onclick = ()=>{
        arr_list.push(arr[i]);
        arr.splice(i, 1);
        clearList(my_ul_list);
        fullList(my_ul_list, arr_list);
        onInit();
      }
      newLi.appendChild(newButton);
      my_ul.appendChild(newLi);      
  }                 
};
 
/*нажимаем на кнопку add card у Backlog*/
window.myFunction_backlog = function(){   
  if (!resAdmin)
    return;
  btn_backlog.className =  'hide';
  btn_task_submit.className = 'show btn-task_submit';
  p_backlog_add_task.className = 'show input_add_task font-task';
};

/*нажимаем на кнопку submit card у Backlog*/
window.submit_task = function(){
  clearList(ul_task_backlog);
  let val = p_backlog_add_task.value;
  if (val !== '')
    arr_backlog.push(p_backlog_add_task.value);
  fullList(ul_task_backlog, arr_backlog);  
  onInit();
  btn_backlog.className = 'show dropbtn';
  btn_task_submit.className = 'hide';
  p_backlog_add_task.className = 'hide';
  p_backlog_add_task.value = "";
}

/*нажимаем на кнопку add card у Ready*/
window.myFunction_ready = function() {    
  if (resAdmin)
    return;
  document.getElementById("myDropdown-ready").classList.toggle("show");
  let ul_ready = document.querySelector(".ul-ready");
  console.log(ul_ready);
  clearList(ul_ready);
  fullList_ul(ul_ready, arr_backlog, ul_task_ready, arr_ready);      
};
 
/*нажимаем на кнопку add card у In Progress*/
window.myFunction_inprogress = function (){    
  if (resAdmin)
    return;
  document.getElementById("myDropdown-inprogress").classList.toggle("show");
  let ul_progress = document.querySelector(".ul-progress");
  clearList(ul_progress);
  fullList_ul(ul_progress, arr_ready, ul_task_inprogress, arr_inprogress);           
};
 
/*нажимаем на кнопку add card у Finished*/
window.myFunction_finished = function() { 
  if (resAdmin)
    return;
  document.getElementById("myDropdown-finished").classList.toggle("show");
  let ul_finished = document.querySelector(".ul-finished");
  clearList(ul_finished);
  fullList_ul(ul_finished, arr_inprogress, ul_task_finished,arr_finished);           
};

 /*нажимаем на кнопку меню пользователя*/
window.myFunction_avatar = function(){
  let openDropdown = document.querySelector("#myDropdown-avatar");
  if (openDropdown.classList.contains('show')) {
     openDropdown.className = 'hide';
     document.querySelector("#img_down").src = "../src/files/arrow-down.svg";
  } 
  else
  {
    openDropdown.className = 'show div-avatar';
    document.querySelector("#img_down").src = "../src/files/arrow-up.svg";
  }  
}

/* нажимаем на кнопки в меню пользователя */
window.myFunction_account = function(){
  document.querySelector("#my-main").className = 'hide';
  document.querySelector("#my-tasks").className = 'hide';
  document.querySelector("#my-account").className = 'container show';
  document.querySelector(".account-task").className = 'account-task show';
  document.querySelector("#myDropdown-avatar").className = 'hide';
  document.querySelector("#img_down").src = "../src/files/arrow-down.svg";
}

/* нажимаем на кнопки в меню пользователя */
window.myFunction_tasks = function(){
  document.querySelector("#my-main").className = 'hide';
  document.querySelector("#my-account").className = 'hide';
  document.querySelector("#my-tasks").className = 'container show';
  document.querySelector(".account-task").className = 'account-task show';
  document.querySelector("#myDropdown-avatar").className = 'hide';
  document.querySelector("#img_down").src = "../src/files/arrow-down.svg";
}

/* нажимаем на кнопки в меню пользователя */
window.myFunction_logout = function(){
  document.querySelector("#content").innerHTML = 'Please Sign In to see your tasks!';
}

/* нажимаем выход в меню пользователя */
window.myFunction_exit = function(){
  document.querySelector("#my-main").className = 'show container main';
  document.querySelector("#my-tasks").className = 'hide';
  document.querySelector("#my-account").className = 'hide';  
}

// Закройте выпадающее меню, если пользователь щелкает за его пределами
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
  
    var dropdowns = document.getElementsByClassName("dropdown-content");    
    
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};