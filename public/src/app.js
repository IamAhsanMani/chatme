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

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('../sw.js').then(function(registration) {
  
            // Registration was successful
            firebase.messaging().useServiceWorker(registration);
  
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
  
                    function saveMessagingDeviceToken() {
  
                        firebase.messaging().getToken().then(function(currentToken) {
                            if (currentToken) {
                                console.log('Got FCM device token:', currentToken);
                                // Saving the Device Token to the datastore.
                                firebase.database().ref('/fcmTokens').child(currentToken)
                                    .set(firebase.auth().currentUser.uid);
                            } else {
                                // Need to request permissions to show notifications.
                                requestforpermision()
                            }
                        }).catch(function(error) {
                            console.error('Unable to get messaging token.', error);
                        });
                    } //Savetoken ends here
  
                    function requestforpermision() {
                        firebase.messaging().requestPermission().then(function() {
                            // Notification permission granted.
                            saveMessagingDeviceToken();
                        }).catch(function(error) {
                            console.error('Unable to get permission to notify.', error);
                            alert("Your Notifications Are Disabled")
                        });
  
                    } //Req Permisison ends here
                    requestforpermision()
                }
            });
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
  }


firebase.messaging().onMessage(function(payload) {
console.log(payload.notification)
});


let userData = JSON.parse(localStorage.getItem('userProfile'));
console.log(userData)




window.addEventListener("load",async ()=>{
    setTimeout(()=>{
        document.getElementById('loader').style.display = 'none';
        document.getElementById('asd').style.display = 'block'
    },500)

    await getUser()
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


function getUser() {
    var idArray = [];
    firebase.auth().onAuthStateChanged(function (user) {
        if(user) {
            var uid = firebase.auth().currentUser.uid;
            console.log(uid)
            idArray.push(uid)
        }

        firebase.database().ref("user/").once("value",(data)=>{
            var userData = data.val()
            // console.log('timespan===',userData)
            var key = Object.keys(userData)
            console.log(key)

            for(var i in key) {
                // console.log(key[j])
                firebase.database().ref("user/"+key[i]).on("value",(data)=>{
                    var allData = data.val()
                    
                    var pendingData = allData.pending;
                    console.log(pendingData)
                    
                    for(var j in pendingData) {
                        console.log(j)
                        if(j === uid) {

                            idArray.push(allData.uid)
                            console.log(console.log(allData.uid))
                            localStorage.setItem("ids", JSON.stringify(idArray))
                            console.log("agr request bejhi hai us ki pending dekh raha")
                        }
                    }
                    
                })
            }
            })
            .then(()=>{
                        console.log(uid)
                        firebase.database().ref("user/"+uid).on("value",(data)=>{
                            var allData = data.val()
                            
                            var pendingData = allData.pending;
                            console.log(pendingData)
                            
                            for(var j in pendingData) {
                                console.log(j)
                                // if(j === uid) {
                                    console.log("true")
                                    idArray.push(j)
        
                                    localStorage.setItem("ids", JSON.stringify(idArray))
                                    console.log("apni pending list ma user dekh raha hai")
                                // }
                            }
                            
                        })
                    // }
                    // })
            })
            .then(()=>{
                        console.log(uid)
                        firebase.database().ref("user/"+uid).on("value",(data)=>{
                            var allData = data.val()
                            console.log('timespan=========',allData.joinDate)
                            var pendingData = allData.friends;
                            console.log(pendingData)
                            
                            for(var q in pendingData) {
                                console.log(q)
                                // if(j === uid) {
                                    console.log("true")
                                    idArray.push(q)
        
                                    localStorage.setItem("ids", JSON.stringify(idArray))
                                    console.log("apne friends dekh raha hai")
                                // }
                            }
                            
                        })
                    // }
                    // })
            })

            .then((sucess)=>{
                console.log(sucess)
                firebase.database().ref("user/").on("value",(data)=>{
                    var againUserData = data.val();
                    console.log()
                    
                    var localData = localStorage.getItem("ids")
                    var keyFromLocal = JSON.parse(localData)
                    // console.log(asa)
                    
                    for(var k in againUserData) {
                        // console.log(q[i])
                        delete againUserData[uid]
                        // console.log(q)
                        for(var m in keyFromLocal) {
                            // console.log(asa[j])
                            delete againUserData[keyFromLocal[m]]
        
                            // console.log(q)
                        }
                        // console.log(q)
                    }
                    console.log('again',againUserData)
                    // if(!againUserData) {
                        document.querySelector('.container-flux').innerHTML = ''
                        if(!isEmpty(againUserData) === false) {
                            // Object is empty (Would return true in this example)
                        document.querySelector('.container-flux').innerHTML = `
                        <div class="pendingCard shadow-lg p-3 rounded text-center">
                            <div>
                                <img class="noRequestImg" src="../images/noUser.png"/>
                            </div>
                            <br />
                            <h1 class="noRequest">No new user!</h1>
                        </div>`
                    }
                    
                    else{
                    console.log(!againUserData)
                    document.querySelector('.container-flux').innerHTML = ''
                        for(var n in againUserData) {
                            document.querySelector(".container-flux").innerHTML += `
                                <div class="userCard shadow-lg p-3 rounded" key="${n}">
                                    <div>
                                    <img class="userImg shadow p-2 text-center" src="${againUserData[n].profilePic}"/>
                                    </div>
                                    <div>
                                    <span class="badge shadow-lg"><img src="../images/hand.png"/> New member</span>
                                    <br />
                                    <h3 class="userName">${againUserData[n].fullName.charAt(0).toUpperCase()+againUserData[n].fullName.slice(1)}</h3>
                                    </div>
                                        <button class="btn first" onClick="sendReq(this)">send request</button>
                                </div>`
                        }
                    }
            })
        })
    })
}


function sendReq(e) {
    var uid = firebase.auth().currentUser.uid;
    var id = e.parentNode.getAttribute("key");
    console.log('e.parentNode====>',e.parentNode)
    

    console.log(e.parentNode.getAttribute("key"))

    // if(uid) {
    //     firebase.auth().onAuthStateChanged(function(user) {
    //         console.log(user)
    //         if(!user.emailVerified) {
    //             console.log('not verified')
    //             user.sendEmailVerification().then(()=>{
    //                 console.log('verification send sucess fully')
    //             })
    //             .catch(error =>{
    //                 console.log('error',error.message)
    //             }); 
    //         }
    //     });
        
    // }
    if(!navigator.onLine) {
        toast('we are offline!')
      }

    else{
        firebase.database().ref("user/"+id).child("pending/"+uid).once("value",(data)=>{
            var checkCurrUserData = data.val()
            console.log(data.val())
            if(checkCurrUserData === null) {

                firebase.database().ref("user/"+ uid).once("value", (data)=>{
                    var currentUser = data.val()
                    console.log(currentUser)

                    var senderName = currentUser.fullName.charAt(0).toUpperCase() + currentUser.fullName.slice(1)


                // console.log(data)
                
                firebase.database().ref("user/"+ id).child("pending/").child(uid).set(currentUser)
                .then(()=>{
                    e.innerHTML = 'Request sent'
                    // e.parentNode.style.display = 'none'
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
                                            "body": `${senderName} send you a friend request.`,
                                            "icon": currentUser.profilePic,
                                            "badge": '../images/favicon.png',
                                            "click_action": '../pending.html' //Notification Click url notification par click honay k bad iss url par redirect hoga
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
                })

                localStorage.removeItem("ids")
                getUser()

            })
            }
            else{
                Swal.fire({
                    title: 'Custom animation with Animate.css',
                    animation: false,
                    customClass: 'animated fadeInUpBig'
                })

                // alert("already send request")
               console.log("data pehla se hi tha")
            }
        })
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


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}





