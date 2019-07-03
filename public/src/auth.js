  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyBPtUCquiLSFvBloxY391zEpuVpejpY7l0",
    authDomain: "chatme-786.firebaseapp.com",
    databaseURL: "https://chatme-786.firebaseio.com",
    projectId: "chatme-786",
    storageBucket: "chatme-786.appspot.com",
    messagingSenderId: "344769746267",
    appId: "1:344769746267:web:e75010194d34246a"
  };
  firebase.initializeApp(config);


window.addEventListener('offline', function() {
    M.Toast.dismissAll();
    M.toast({html: 'We are offline!'});
});
window.addEventListener('online', function() {
    M.Toast.dismissAll();
    M.toast({html: '<span>Hey we are back Online! </span><button class="btn-flat toast-action" onclick="location.reload()">RELOAD</button>'});    
});


window.addEventListener("load",async ()=>{
  await navigateUser()
})




function navigateUser() {
  var id = localStorage.getItem('userId')

  if(id) {
    firebase.auth().onAuthStateChanged(function(user) {
      console.log(user)
      if(!user.emailVerified) {
        location = '../pages/verify.html'
          // user.sendEmailVerification().then(()=>{
          //     console.log('verification send sucess fully')
          // })
          // .catch(error =>{
          //     console.log('error',error.message)
          // }); 
      }
      else{
        location = '../pages/allUser.html'
      }
});
  }
  // console.log()
  // if(id) {
  // }
  // else{
  //   console.log('not login')
  // }
}

function fblogin() {
    var provider = new firebase.auth.FacebookAuthProvider();
    // let joinDate = firebase.database.ServerValue.TIMESTAMP;
    let joinDate = firebase.database.ServerValue.TIMESTAMP;
    if(!navigator.onLine) {
      M.Toast.dismissAll();
      return M.toast({html: 'We are offline!'});
    }
    document.getElementById('fontLoader').style.visibility = 'visible'
    provider.setCustomParameters({
      'display': 'popup'
    });

    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("Result==>", result)
      var uid = result.user.uid;
      var fullName = result.user.displayName;
      var email = result.user.email;
      var profilePic = result.user.photoURL;
      var mobile = result.user.phoneNumber;
      var emailVerified = result.user.emailVerified;
      console.log(mobile)
      let obj = {
        uid,
        fullName,
        email,
        profilePic,
        mobile,
        joinDate,
        emailVerified
      }
      firebase.database().ref("user/"+uid).once("value",(data)=>{
        var data = data.val()
        if(data === null || data === "undefined" || data === "") {
          firebase.database().ref("user/"+uid).set(obj)
          .then((sucess)=>{
          localStorage.setItem('userId',uid)
          localStorage.setItem('loginVia','fb')
          localStorage.setItem('userProfile',JSON.stringify(obj))
          if(!emailVerified) {
            location = "../pages/verify.html"

          }
          else{
          location = "../pages/allUser.html"
          console.log(sucess)
        }
          })
        }
        else{
          localStorage.setItem('userProfile',JSON.stringify(obj))
          localStorage.setItem('userId',uid)
          localStorage.setItem('loginVia','fb')
          if(!emailVerified) {
            location = "../pages/verify.html"

          }
          else{
          location = "../pages/allUser.html"
          console.log("all have data")
        }
        }
      
    }).catch(function(error) {
      console.log("Error==>", error)
    })
  })
  .catch((err)=>{
    document.getElementById('fontLoader').style.visibility = 'hidden'
    if(err.message === 'The popup has been closed by the user before finalizing the operation.') {
      M.Toast.dismissAll();
      M.toast({html: 'You close the popup screen'});

    }
    if(err.message === 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.') {
      M.Toast.dismissAll();
      M.toast({html: 'internet connection lost!'});

    }
    console.log(err.message)

  })
  }

  let email_patt = /^[a-zA-Z]+\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
  function signup() {

      var fullName = document.getElementById("fName").value;  
      var email = document.getElementById("email").value;
      var profilePic = document.getElementById("upload").files[0];
      var pwd = document.getElementById("pwd").value;
      let joinDate = firebase.database.ServerValue.TIMESTAMP;
        var userInfo={
          // uid,
          fullName,
          email,
          joinDate
        }
        if(!navigator.onLine) {
          M.Toast.dismissAll();
          return M.toast({html: 'We are offline!'});
        }
        if(fullName === "" || fullName === undefined || fullName === null || fullName.length < 3) {
          M.Toast.dismissAll();
          M.toast({html: 'invalid fullname!'});
        }
        else if(!email.match(email_patt)) {
          M.Toast.dismissAll();
          M.toast({html: 'The email address is badly formatted.'});
        }
        else if(pwd.length < 8) {
          M.Toast.dismissAll();
          M.toast({html: 'invalid password!'});
        }
        else if(profilePic == null) {
          M.Toast.dismissAll();
          M.toast({html: 'please select profile picture!'});
          // document.getElementById('errProfile').innerHTML = "please select profile picture";
        }
        else{
          document.getElementById('fontLoader').style.visibility = 'visible'
        firebase.auth().createUserWithEmailAndPassword(email, pwd)
        .then((success)=>{
          userInfo.uid = success.user.uid
          // console.log()  
          let storageRef = firebase.storage().ref().child(`profile/${profilePic.name}`)
            storageRef.put(profilePic) 
            
            .then((url) =>{
                url.ref.getDownloadURL()
                .then((refUrl) =>{
                userInfo.profilePic = refUrl
                    firebase.database().ref('user/' + success.user.uid).set(userInfo)
                    .then((succ) =>{
                      M.Toast.dismissAll();
                      M.toast({html: 'Account created successfully'});
                        console.log(succ)
                      location = "../index.html"
                      })
                    .catch((err) =>{
                        var errMessage = err.err.message
                        // console.log(errMessage)
                    })
                })
            })
        })
      .catch((er)=>{
        document.getElementById('fontLoader').style.visibility = 'hidden'
          console.log(er.message)
          if(er.message === 'The email address is already in use by another account.') {
            M.Toast.dismissAll();
            M.toast({html: 'This email is already taken.'});
          }
          if(er.message === 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.') {
            M.Toast.dismissAll();
            M.toast({html: 'Internet Disconnected!'});
          }
      })
    }
  }



  function signin() {
    var signinEmail = document.getElementById("email").value;
    var signinPwd = document.getElementById("pwd").value;
    if(!navigator.onLine) {
      M.Toast.dismissAll();
      return M.toast({html: 'We are offline!'});
    }
    if(!signinEmail.match(email_patt)) {
      M.Toast.dismissAll();
      M.toast({html: 'The email address is badly formatted.'});
    }
    else if(signinPwd.length < 8) {
      M.Toast.dismissAll();
      M.toast({html: 'invalid password!'});
    }
    else{
      document.getElementById('fontLoader').style.visibility = 'visible'
    firebase.auth().signInWithEmailAndPassword(signinEmail, signinPwd)
    .then((suc)=>{
      firebase.database().ref('user/'+suc.user.uid).once("value",(data)=>{
        var data = data.val()
        data.emailVerified = suc.user.emailVerified
        localStorage.setItem('loginVia','signIn')
        localStorage.setItem('userProfile',JSON.stringify(data))
        localStorage.setItem('userId',suc.user.uid)
        if(!suc.user.emailVerified) {
          location = "../pages/verify.html"

        }
        else{
        location = "../pages/allUser.html"
        console.log(sucess)
        }
      })
      console.log(suc)
    })
    .catch((error)=>{
      document.getElementById('fontLoader').style.visibility = 'hidden'
      console.log(error.message)
      if(error.message === 'The password is invalid or the user does not have a password.') {
        M.Toast.dismissAll();
        M.toast({html: 'invalid password!'});        
      }
      if(error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
        M.Toast.dismissAll();
        M.toast({html: 'No user found!'});
      }
      if(error.message === 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.') {
        M.Toast.dismissAll();
        M.toast({html: 'Internet Disconnected!'});
      }
    })
  }
  }


  function checkNet(loc) {
    if(!navigator.onLine) {
        M.Toast.dismissAll();
        return M.toast({html: 'We are offline!'});
    }
    else{
        location = loc
    }
}