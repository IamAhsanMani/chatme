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



var userId = localStorage.getItem("userId");
   
var userB = JSON.parse(localStorage.getItem("chatWith"))
console.log(userId)

var textarea = document.querySelector('#input');



var userName = document.getElementById('userName');
var userImg = document.getElementById('userImg');

var curImg = "";
var name = ""
firebase.database().ref("user/"+userId).once("value",(data)=>{
    var data  = data.val()
    return curImg = data.profilePic
})

firebase.database().ref("user/"+userId).once("value",(data)=>{
    var data  = data.val()
    return name = data.fullName
})


window.addEventListener("load",async ()=>{
    setTimeout(()=>{
    },5000)
  await setUserData()
  await showMsj(userB)
})


function setUserData() {

firebase.database().ref("user/"+userB).once("value",(data)=>{
  var userData = data.val()
  // console.log(userData)
  document.getElementsByClassName("sendMsj")[0].setAttribute('id',userB)
  console.log(userData.profilePic)
    document.title = userData.fullName.charAt(0).toUpperCase()+userData.fullName.slice(1)
    userName.innerHTML += userData.fullName
    userImg.setAttribute('src',userData.profilePic);
})
}



function sendMsj(e) {
  var id = e.getAttribute("id")
  console.log(id)
  var msj = document.getElementById("input").value;
  let timeStamp = firebase.database.ServerValue.TIMESTAMP;
  var msjData = {
      msj,
      timeStamp
    }
    if(!navigator.onLine) {
        toast('we are offline!')
    }
    else{
    if(id) {
        if(msj !== null && msj !== undefined && msj !== "") {
            firebase.database().ref("chat/").child(id).child(userId).push(msjData)
            .then((sucess)=>{
                console.log('sucess',sucess)
                showMsj(userB)
                  firebase.database().ref("user/"+id).once("value",(data)=>{
                      var recData = data.val()
                      console.log(recData.fullName)
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
                                              "title": `${name.charAt(0).toUpperCase()+name.slice(1)} send you a message`,
                                              "body": msj,
                                              "icon": curImg, //Photo of sender
                                              "badge": '../images/favicon.png',
                                              "click_action": '../index.html' //Notification Click url notification par click honay k bad iss url par redirect hoga
                                          }
                                      }),
                                      success: function(response) {
                                          console.log(response);
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
                    document.getElementById('input').value = ""
                //   })
                })
            })
        }
    }
  }
}
  



  function showMsj(k) {

    var key = k;
    console.log(key)
    var keyImgUrl;
    firebase.database().ref(`user/${key}`).once('value', (e) => {
        let d = e.val();
        console.log(d)
        return keyImgUrl = d.profilePic;
    })
    firebase.database().ref(`chat/${userId}`).on('value', (a) => {

        var messegeObj = {
            recieveMessege: [],
            sendMessege: [],
        }
        var recieveMessegeKeyChecker = [];
        var sendMessageKeyCheker = [];
        firebase.database().ref(`chat/${userId}/${key}`).once('value', (l) => {
            console.log(l.val())
            firebase.database().ref(`chat/${key}/${userId}`).once('value', (e) => {
                let dta = l.val()
                // console.log(dta)
                for (var key in dta) {
                    if (recieveMessegeKeyChecker.indexOf(key) === -1) {
                        recieveMessegeKeyChecker.push(key)
                        messegeObj.recieveMessege.push(dta[key])
                    }
                }
                let data = e.val()
                console.log(data)
                for (var key in data) {
                    if (sendMessageKeyCheker.indexOf(key) === -1) {
                        sendMessageKeyCheker.push(key)
                        messegeObj.sendMessege.push(data[key])
                    }
                }
            }).then(() => {
                var mainArray = [];
                for (var key in messegeObj) {
                    for (var key2 in messegeObj[key]) {
                        if (key === 'recieveMessege') {
                            messegeObj[key][key2].recieve = 'done'
                            mainArray.push(messegeObj[key][key2])
                        }
                        else if (key === 'sendMessege') {
                            messegeObj[key][key2].send = 'done'
                            mainArray.push(messegeObj[key][key2])
                        }
                    }
                }
                return mainArray;
            }).then((mainArray) => {
                console.log(!mainArray.length)
                document.getElementById('msjDiv').innerHTML = ""
                if(mainArray.length == 0) {
                    document.getElementById('msjDiv').innerHTML = `
                    <div class='noMsj'>
                    <i class="far fa-comment-dots"></i> <h2>no message</h2>
                    </div>    `
                }
                mainArray.sort(function (a, b) {
                    return a.timeStamp - b.timeStamp;
                });
                for (var key in mainArray) {
                    for (var key2 in mainArray[key]) {
                        if (key2 === 'recieve') {
                            let time = getTime(mainArray[key].timeStamp)
                            document.getElementById('msjDiv').innerHTML +=`
                            <li class="message left appeared" id="msj-box" >
                              <div class="avatar"><img src=${keyImgUrl} width="40px" height="40px" style="border-radius:50%"/></div>
                              <div class="text" id="text"><span>${mainArray[key].msj}</span><span class="left-timeSpan" style="font-size:10px"><i class="far fa-clock time"></i> ${moment(mainArray[key].timeStamp).format('lll')}</span></div>
                            </li>
                        `;
                        } else if (key2 === 'send') {
                            let time = getTime(mainArray[key].timeStamp)
                            document.getElementById("msjDiv").innerHTML += `
                            <li class="message right appeared" id="msj-box">
                              <div class="avatar"><img src=${curImg}  width="40px" height="40px" style="border-radius:50%"/></div>
                              <div class="text2" id="text"><span>${mainArray[key].msj}</span><span class="right-timeSpan" style="font-size:10px"><i class="far fa-clock time" style="color:#30336b"></i> ${moment(mainArray[key].timeStamp).format('lll')}</span></div>
                            </li>
                            `
                        }

                    }

                }

            }).then(()=>{
                document.getElementById('input').autofocus
                var elem = document.querySelector('#msjDiv');
                elem.scrollTop = elem.scrollHeight;
                
                // var objDiv = document.getElementById("asd");
                // objDiv.scrollTop = objDiv.scrollHeight;
                // console.log('aaya')
            })
        })
    })
}





function getTime(t) {
  var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (t !== undefined) {
      var myDate = new Date(t);
  } else if (t === undefined) {
      var myDate = new Date();
  }
  // var day = days[myDate.getDay()]
  var hr = myDate.getHours();
  var min = myDate.getMinutes();
  var month = months[myDate.getMonth()]
  var date = myDate.getDate();
  var year = myDate.getFullYear();
//   if(hr === 0) {
//       hr = 1
//   }
  return time = `${date} ${month} ${year}, ${hr} : ${min}`
}





function btnToTop() {
    document.getElementById("msjDiv").style.scrollBehavior = 'smooth'
    var objDiv = document.getElementById("msjDiv");
    objDiv.scrollTop = objDiv.scrollHeight;
}




















textarea.addEventListener('keydown', autosize);
             
function autosize(){
  var el = this;
  console.log('elllllllllllllllll',el.value)
  if (event.keyCode === 13) {
    event.preventDefault();
  
  setTimeout(function(){
    el.style.cssText = 'height:auto; padding:0';
    // for box-sizing other than "content-box" use:
    // el.style.cssText = '-webkit-box-sizing:content-box';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  },0);
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


