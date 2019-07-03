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


let userData = JSON.parse(localStorage.getItem('userProfile'));

  window.addEventListener("load",async ()=>{
    setTimeout(()=>{
        document.getElementById('loader').style.display = 'none';
        document.getElementById('asd').style.display = 'block'
    },500)
    await getFrnd()
})


function getFrnd() {
    firebase.auth().onAuthStateChanged(function (user) {
        if(user) {
            var uid = firebase.auth().currentUser.uid;
            console.log(uid)
        }

        firebase.database().ref("user/"+uid).child("friends")
        .on("value", (data)=>{
            var frndData = data.val()
            console.log(frndData)

            if(frndData === null || frndData === "undefined" || frndData === "") {
                document.getElementById('friend').innerHTML = ''
                document.getElementById("friend").innerHTML = `
                <div class="pendingCard shadow-lg p-3 rounded text-center">
                <div>
                    <img class="noRequestImg" src="../images/request.png"/>
                </div>
                <br />
                <h1 class="noRequest">No Friend Yet</h1>
                </div>`
            }

            else{
                document.getElementById('friend').innerHTML = ''
                for(var i in frndData) {
                    console.log(i)
                document.getElementById("friend").innerHTML += `
                <div class="pendingCard shadow-lg p-3 rounded" key="${i}">
                    <div>
                        <img class="userImg shadow p-2 text-center" src="${frndData[i].profilePic}"/>
                        </div>
                        <div>
                        <span class="badge badge2 shadow-lg"><img src="../images/fr.png"/> Friend</span>
                        <br />
                        <h3 class="userName">${frndData[i].fullName.charAt(0).toUpperCase()+frndData[i].fullName.slice(1)}</h3>
                    </div>
                        <button class="btn first" onClick="chat(this)"><i class="far fa-comment"></i> chat</button>
                </div>`
                }
            }
        })

    })
}



function chat(e) {
    var id = e.parentNode.getAttribute("key");
    var uid = firebase.auth().currentUser.uid;
        
    if(uid) {
        firebase.auth().onAuthStateChanged(function(user) {
            console.log(user)
            if(!user.emailVerified) {
                user.sendEmailVerification().then(()=>{
                    console.log('verification send sucess fully')
                })
                .catch(error =>{
                    console.log('error',error.message)
                }); 
            }
        });
        
    }
    
    if(!navigator.onLine) {
        toast('we are offline!')
    }
    else{
        localStorage.setItem("chatWith",JSON.stringify(id))
        location='../pages/chat.html'
    }
    // if(!userData.emailVerified) {
        // console.log('not verfied')
    // }

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


