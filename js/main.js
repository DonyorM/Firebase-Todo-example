// Todo list app by Afolabi Sheriff
// Firebase integration by Daniel Manila

// Remember to enable Username and Password sign up in the firebase console
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';
// Remember to enable firestore in the firebase console and set the rules to those set in the "firebase.rules" file
import { getFirestore, doc, setDoc, collection, onSnapshot, getDocs, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js';


const auth = getAuth();
const db = getFirestore();

const addButton = document.getElementById('addButton');
const addInput = document.getElementById('itemInput');
const todoList = document.getElementById('todoList');
const signIn = document.getElementById('signIn');
const main = document.getElementById('main');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

var listArray = [];
var signedInUser = null;

var currentSnapshotUnsubscribe = null;

function onSign() {
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
var changeToComp = async function () {
    var parent = this.parentElement;
    const content = parent.firstChild.innerText;

    const ref = doc(db, "app/todos", signedInUser.uid, content);
    await updateDoc(ref, {
        status: "complete"
    });

    this.removeEventListener('click', changeToComp);
    this.addEventListener('click', changeToInComp);
}

var changeToInComp = async function () {
    var parent = this.parentElement;
    const content = parent.firstChild.innerText;

    const ref = doc(db, "app/todos", signedInUser.uid, content);
    await updateDoc(ref, {
        status: "incomplete"
    });

    this.removeEventListener('click', changeToInComp);
    this.addEventListener('click', changeToComp);
}

var removeItem = function () {
    var parent = this.parentElement.parentElement;

    var content = this.parentElement.firstChild.innerText;    
    const ref = doc(db, "app/todos", signedInUser.uid, content);
    deleteDoc(ref);
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

var addToList = async function () {
    var newItem = listItemObj();
    newItem.content = addInput.value;

    const userId = signedInUser.uid;
    await setDoc(doc(db, "app/todos", userId, newItem.content), newItem);
}

//function to clear todo list array
var clearList = async function () {
    const userId = signedInUser.uid;
    const col = collection(db, "app/todos", userId);
    const querySnapshot = await getDocs(col);
    querySnapshot.forEach(doc => {
        deleteDoc(doc.ref);
    });
}

function loadTodos() {
    if (currentSnapshotUnsubscribe) {
        currentSnapshotUnsubscribe();
    }
    const userId = signedInUser.uid;
    const col = collection(db, "app/todos", userId);
    currentSnapshotUnsubscribe = onSnapshot(col, (querySnapshot) => {
        todoList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const dom = createItemDom(data.content, data.status);
            todoList.appendChild(dom);
        });
    });
}

window.onload = function () {

    if (signedInUser) {
        loadTodos();
    }

    onAuthStateChanged(auth, (user) => {
        signedInUser = user;

        if (user) {
            signIn.classList.add("hidden");
            main.classList.remove("hidden");
            loadTodos();
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
