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
        document.getElementById('loader').style.display = 'none';
        document.getElementById('asd').style.display = 'block'
    },500)
    await getReq()
})

function getReq() {
    firebase.auth().onAuthStateChanged(function (user) {
        if(user) {
            var uid = firebase.auth().currentUser.uid;
            console.log(uid)
        }

        firebase.database().ref("user/"+uid).child("pending")
        .on("value", (data)=>{
            document.getElementById('pending').innerHTML = ''
            var req = data.val()
            console.log(req)

            if(req === null || req === "undefined" || req === "") {
                document.getElementById("pending").innerHTML = `
                <div class="pendingCard shadow-lg p-3 rounded text-center">
                <div>
                    <img class="noRequestImg" src="../images/request.png"/>
                </div>
                <br />
                <h1 class="noRequest">No Request</h1>
                </div>`
            }

            else{
                for(var i in req) {
                    console.log(i)
                document.getElementById("pending").innerHTML += `
                <div class="pendingCard shadow-lg p-3 rounded" key="${i}">
                    <div>
                        <img class="userImg shadow p-2 text-center" src="${req[i].profilePic}"/>
                        </div>
                        <div>
                        <span class="badge badge2 shadow-lg"><img src="../images/fr.png"/> Friend Request</span>
                        <br />
                        <h3 class="userName">${req[i].fullName.charAt(0).toUpperCase()+req[i].fullName.slice(1)}</h3>
                    </div>
                        <button class="btn first" onClick="accept(this)">accept Request</button>
                </div>`
                }
            }
        })

    })
}



function accept(e) {
    var uid = firebase.auth().currentUser.uid;
    var id = e.parentNode.getAttribute("key");
    var currLocal = localStorage.getItem('userProfile')
    var currData = JSON.parse(currLocal)

    var accepterName = currData.fullName.charAt(0).toUpperCase() + currData.fullName.slice(1)
    console.log(e.parentNode.getAttribute("key"))
    if(!navigator.onLine) {
        toast('we are offline!')
    }
    else{
    firebase.database().ref("user/"+uid).child("pending/"+id).once("value",(data)=>{
        var data = data.val()

        firebase.database().ref("user/"+uid).child("friends/"+id)
        .set(data)
        .then(()=>{
            firebase.database().ref("/fcmTokens").once("value", function(snapshot) {
                snapshot.forEach(function(token) {
                    if (token.val() == id) { //Getting the token of the reciever using  if condition..!   
                        console.log(token.key)   
                        
                        $.ajax({
                            type: 'POST',
                            url: "https://fcm.googleapis.com/fcm/send",
                            headers: { Authorization: 'key=' + 'AIzaSyAWcwEYTSHk8Hk47vdgDZBB4BsH8KXT6lU' },
                            contentType: 'application/json',
                            dataType: 'json',
                            data: JSON.stringify({
                                "to": token.key,
                                "notification": {
                                    "title": 'Chatme',
                                    "body": `${accepterName} accept your friend request.`,
                                    "icon": currData.profilePic,
                                    "badge": '../images/favicon.png',
                                    "click_action": '../friend.html' //Notification Click url notification par click honay k bad iss url par redirect hoga
                                }
                            }),
                            success: function(response) {
                                console.log("response======>",response);
                                //Functions to run when notification is succesfully sent to reciever
                            },
                            error: function(xhr, status, error) {
                                //Functions To Run When There was an error While Sending Notification
                                console.log(xhr.error);
                            }
                        });
                    }
                });
            })
            firebase.database().ref("user/"+uid).child("pending/"+id).remove();
            firebase.database().ref("user/"+uid).once("value",(data)=>{
                var currData= data.val()
                firebase.database().ref("user/"+id).child("friends/"+uid).set(currData)
            })
            .then(()=>{
                getReq()
            })

            
        })

        
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