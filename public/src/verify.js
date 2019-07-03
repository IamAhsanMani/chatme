  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBPtUCquiLSFvBloxY391zEpuVpejpY7l0",
    authDomain: "chatme-786.firebaseapp.com",
    databaseURL: "https://chatme-786.firebaseio.com",
    projectId: "chatme-786",
    storageBucket: "chatme-786.appspot.com",
    messagingSenderId: "344769746267",
    appId: "1:344769746267:web:e75010194d34246a"
  };
  firebase.initializeApp(firebaseConfig);

let userData = JSON.parse(localStorage.getItem('userProfile'));



window.addEventListener("load",async ()=>{
    document.getElementById("userEmail").innerHTML = userData.email
    
    firebase.auth().onAuthStateChanged(function(user) {
        console.log(user)
        if(user.emailVerified) {
            location = '../pages/allUser.html'
        }
        if(!user.emailVerified) {
            console.log('not verified')
            user.sendEmailVerification().then(()=>{
                console.log('verification send sucess fully')
            })
            .catch(error =>{
                console.log('error',error.message)
            }); 
        }
    });
    // await getUser()
})


function toast(text) {
    var x = document.getElementById("snackbar");
    x.innerHTML = text
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}

window.addEventListener('offline', function() {
    toast('we are offline!')   
});

window.addEventListener('online', function() {
    toast('<span>we are back Online! </span><button class="reloadBtn" onclick="location.reload()">RELOAD</button>')
});



function sendEmailVerification() {
    if(!navigator.onLine) {
        toast('we are offline!')
    }
    else{
        firebase.auth().onAuthStateChanged(function(user) {
            console.log(user)
            if(user.emailVerified) {
                location = '../pages/allUser.html'
            }
            if(!user.emailVerified) {
                console.log('not verified')
                user.sendEmailVerification().then(()=>{
                    console.log('verification send sucess fully')
                })
                .catch(error =>{
                    console.log('error',error.message)
                }); 
            }
        });
    }
}



function checkNet(loc) {
    if(!navigator.onLine) {
        toast('we are offline!')
    }
    if(navigator.onLine){ 
        location = loc
    }
}


function logOut() {
    // var loginMethod = localStorage.getItem('loginVia')
    // if(loginMethod === 'fb') {
      if(!navigator.onLine) {
        toast('we are offline!')
    }
    else{
      firebase.auth().signOut()
      .then(()=>{
        localStorage.clear()
        console.log('sign logout')
        location = '../index.html'
      }).catch(e =>{
        console.log(e.message)
      })
    }
  }