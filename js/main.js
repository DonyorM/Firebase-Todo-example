//Todo list app by Afolabi Sheriff
//features
//store in localstorage of browser
//delete list items
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';

const auth = getAuth();
const addButton = document.getElementById('addButton');
const addInput = document.getElementById('itemInput');
const todoList = document.getElementById('todoList');
const signIn = document.getElementById('signIn');
const main = document.getElementById('main');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

var listArray = [];
var signedInUser = null;
//declare addToList function

function onSign() {
    // Remember to enable Username and Password sign up in the firebase console
    let email = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            signedInUser = userCredential.user;
        })
        .catch((error) => {
            if (error.code === "auth/user-not-found") {
                createUserWithEmailAndPassword(auth, email, password).catch(e => {
                    console.log(e.code);
                });
            } else {
                console.log(error.code);
            }
        });
}

function onSignOut() {
    signOut(auth);
}

function listItemObj(content, status) {
    return {
        content: "",
        status: "incomplete"
    };
}
var changeToComp = function () {
    var parent = this.parentElement;
    console.log('Changed to complete');
    parent.className = 'uncompleted well';
    this.innerText = 'Incomplete';
    this.removeEventListener('click', changeToComp);
    this.addEventListener('click', changeToInComp);
    changeListArray(parent.firstChild.innerText, 'complete');

}

var changeToInComp = function () {
    var parent = this.parentElement;
    console.log('Changed to incomplete');
    parent.className = 'completed well';
    this.innerText = 'Complete';
    this.removeEventListener('click', changeToInComp);
    this.addEventListener('click', changeToComp);

    changeListArray(parent.firstChild.innerText, 'incomplete');

}

var removeItem = function () {
    var parent = this.parentElement.parentElement;
    parent.removeChild(this.parentElement);

    var data = this.parentElement.firstChild.innerText;
    for (var i = 0; i < listArray.length; i++) {

        if (listArray[i].content == data) {
            listArray.splice(i, 1);
            refreshLocal();
            break;
        }
    }


}

//function to change the todo list array
var changeListArray = function (data, status) {

    for (var i = 0; i < listArray.length; i++) {

        if (listArray[i].content == data) {
            listArray[i].status = status;
            refreshLocal();
            break;
        }
    }
}

//function to chage the dom of the list of todo list
var createItemDom = function (text, status) {

    var listItem = document.createElement('li');

    var itemLabel = document.createElement('label');

    var itemCompBtn = document.createElement('button');

    var itemIncompBtn = document.createElement('button');

    listItem.className = (status == 'incomplete') ? 'completed well' : 'uncompleted well';

    itemLabel.innerText = text;
    itemCompBtn.className = 'btn btn-success';
    itemCompBtn.innerText = (status == 'incomplete') ? 'Complete' : 'Incomplete';
    if (status == 'incomplete') {
        itemCompBtn.addEventListener('click', changeToComp);
    } else {
        itemCompBtn.addEventListener('click', changeToInComp);
    }


    itemIncompBtn.className = 'btn btn-danger';
    itemIncompBtn.innerText = 'Delete';
    itemIncompBtn.addEventListener('click', removeItem);

    listItem.appendChild(itemLabel);
    listItem.appendChild(itemCompBtn);
    listItem.appendChild(itemIncompBtn);

    return listItem;
}

var refreshLocal = function () {
    var todos = listArray;
    localStorage.removeItem('todoList');
    localStorage.setItem('todoList', JSON.stringify(todos));
}

var addToList = function () {
    var newItem = new listItemObj();
    newItem.content = addInput.value;
    listArray.push(newItem);
    //add to the local storage
    refreshLocal();
    //change the dom
    var item = createItemDom(addInput.value, 'incomplete');
    todoList.appendChild(item);
    addInput.value = '';
}

//function to clear todo list array
var clearList = function () {
    listArray = [];
    localStorage.removeItem('todoList');
    todoList.innerHTML = '';

}

window.onload = function () {
    var list = localStorage.getItem('todoList');

    if (list != null) {
        var todos = JSON.parse(list);
        listArray = todos;

        for (var i = 0; i < listArray.length; i++) {
            var data = listArray[i].content;

            var item = createItemDom(data, listArray[i].status);
            todoList.appendChild(item);
        }

    }

    onAuthStateChanged(auth, (user) => {
        signedInUser = user;

        if (user) {
            signIn.classList.add("hidden");
            main.classList.remove("hidden");
        } else {
            main.classList.add("hidden");
            signIn.classList.remove("hidden");
        }
    });

};
//add an event binder to the button
addButton.addEventListener('click', addToList);
clearButton.addEventListener('click', clearList);
signInBtn.addEventListener('click', onSign);
signOutBtn.addEventListener('click', onSignOut);
