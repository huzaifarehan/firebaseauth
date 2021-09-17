
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8qkJeGz8sC7Xmgia388oHCRWjE_sAC-E",
  authDomain: "practiceauth-f6087.firebaseapp.com",
  projectId: "practiceauth-f6087",
  storageBucket: "practiceauth-f6087.appspot.com",
  messagingSenderId: "1096562116175",
  appId: "1:1096562116175:web:c2c96b655553c8066b8c3a",
  measurementId: "G-24YGP47LZM"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();


//  sign in function connect with firebase

function signInFormFunc(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // window.location.href = './ui.html';
      window.location.replace("./ui.html");
      signInForm.reset();
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      let wrong = document.getElementById('wrong');
      wrong.innerHTML = `<div class="alert alert-warning" role="alert">
    ${error.message}
                                                    </div>`;
      setTimeout(() => {
        wrong.innerHTML = "";
      }, 5000);
    });
}

// get sign in form from DOM

let signInForm = document.getElementById('signInForm');
(signInForm) ? signInForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  signInFormFunc(email, password);

}) : console.log(signInForm);


//  sign up function connect with firebase

function signUpFormFunc(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // window.location.href = './ui.html';
      window.location.replace("./ui.html");
      signUpForm.reset();
      var user = userCredential.user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}

// // get sign up from DOM

let signUpForm = document.getElementById('signUpForm');
(signUpForm) ? signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let userName = document.getElementById('fullNames').value;
  let email = document.getElementById('emails').value;
  let password = document.getElementById('passwords').value;
  signUpFormFunc(email, password);

}) : console.log(signUpForm);



// logout the user

function logOut() {
  auth.signOut().then(() => {
    // window.location.href = 'index.html';
    window.location.replace("./index.html");
  }).catch((error) => {
  });
}


// observer of user and messages

auth.onAuthStateChanged((user) => {
  if (user) {
    database.ref("users/" + user.uid).update({
      email: user.email
    });
    setMessages();
  } else {
    console.log("signed out");
  }
});

// set messages function

const setMessages = () => {
  const databaseRef = database.ref('messages');
  databaseRef.on('child_added', (data) => {
    createElementsForMessages(data.val());
  });
};

//  send messeage by on click of send button in ui.html

const sendMessages = () => {
  let message = document.getElementById('message').value;
  console.log(message);
  const user = auth.currentUser.email;
  const databaseRef = database.ref('messages');
  databaseRef.push({
    user, message
  });

}

// set messages in dom

const createElementsForMessages = (childData) => {

  const messages = document.getElementById('messages');
  const messageBox = document.createElement('div');
  const senderChildDiv = document.createElement('div');
  const text = document.createElement('div');
  text.innerHTML = childData.message;
  const currentUser = document.createElement('div');
  const userEmail = auth.currentUser.email;
  if (childData.user === userEmail) {
    currentUser.innerHTML = "you";
    messageBox.classList.add('senderBox');
    text.classList.add('sender');
    currentUser.classList.add('senderUser');

  }
  else {
    currentUser.innerHTML = childData.user;
    messageBox.classList.add('receiverBox');
    text.classList.add('receiver');
    currentUser.classList.add('receiverUser');

  }
  senderChildDiv.appendChild(text);
  senderChildDiv.appendChild(currentUser);
  messageBox.appendChild(senderChildDiv);
  messages.appendChild(messageBox);
}