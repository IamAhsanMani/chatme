var firebaseConfig = {
  apiKey: "AIzaSyBPtUCquiLSFvBloxY391zEpuVpejpY7l0",
  authDomain: "chatme-786.firebaseapp.com",
  databaseURL: "https://chatme-786.firebaseio.com",
  projectId: "chatme-786",
  storageBucket: "chatme-786.appspot.com",
  messagingSenderId: "344769746267",
  appId: "1:344769746267:web:e75010194d34246a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


window.addEventListener('offline', function() {
    toast('we are offline!')   
});

window.addEventListener('online', function() {
    toast('<span>we are back Online! </span><button class="reloadBtn" onclick="location.reload()">RELOAD</button>')
});


window.addEventListener("load",async ()=>{
    setTimeout(()=>{
        // document.getElementById('loader').style.display = 'none';
        // document.getElementById('asd').style.display = 'block'
    },1000)

    await getProfile()
})


function getProfile() {
    var localData = localStorage.getItem('userProfile');
    var userProfile = JSON.parse(localData)
    console.log(userProfile)
    document.title = userProfile.fullName.charAt(0).toUpperCase() + userProfile.fullName.slice(1)
    document.getElementById('proImg').setAttribute('src',userProfile.profilePic)
    document.getElementById('proName').innerHTML = userProfile.fullName
    var time = getTime(userProfile.joinDate)
    time = time.replace(/[/]/g,'-')
    console.log(time)
    document.getElementById('joinDate').innerHTML += moment(userProfile.joinDate).format('LL');;
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


function toast(text) {
  var x = document.getElementById("snackbar");
  x.innerHTML = text
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}


function checkNet(loc) {
  if(!navigator.onLine) {
      toast('we are offline!')
  }
  if(navigator.onLine){ 
      location = loc
  }
}


function deactivateAccount() {
  var uid = firebase.auth().currentUser.uid;
  // console.log(user)

  if(!navigator.onLine) {
    toast('we are offline!')
  }
  else{
  firebase.auth().onAuthStateChanged(function(user) {
    user.delete().then(suc => {
      firebase.database().ref('user/'+uid).remove()
      toast("account deleted sucessfully")
      setTimeout(()=>{
        logOut()
      },2000)
      // User deleted.
    }).catch(function(error) {
      // An error happened.
    }) 
  });

  }


    // user.delete().then(function() {
    //   toast("account deleted sucessfully")
    //   // User deleted.
    // }).catch(function(error) {
    //   // An error happened.
    // });
}


function getTime(t) {
  if (t !== undefined) {
      var myDate = new Date(t).toLocaleString('en-us');
  } else if (t === undefined) {
      var myDate = new Date().toLocaleString('en-us');
  }
  return myDate
}