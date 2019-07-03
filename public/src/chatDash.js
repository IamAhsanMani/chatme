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


var userId = localStorage.getItem("userId");
console.log(userId)



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
    },1000)
    await ShowUSer()
})

function ShowUSer() {
    var key = []
    var array = []
    firebase.database().ref("chat/").once("value",(data)=>{
        var data = data.val();
        for(var i in data) {
            console.log('i',i)
            for(var j in data[i]) {
                console.log('j',j)
                if(j === userId) {
                    array.push(i)
                }
            }
        }
        console.log(array)
            firebase.database().ref("chat/"+userId).once("value",(data)=>{
                var q = data.val()
                for(var b in q) {
                    if(array.indexOf(b) === -1) {
                        array.push(b)
                    }
                }
                console.log(array)
                if(array.length === 0) {
                    document.getElementById('chatDash').innerHTML = `
                    <div class='noMsj'>
                    <i class="far fa-comment-dots"></i> <h2>no Chats</h2>
                    </div>`
                }
                // else{
                    array.map(value=>{
                        console.log("value",value)
                        firebase.database().ref("user/"+value).once("value",(data)=>{
                            console.log(data.val().fullName)
                            var contact = data.val()
                                document.getElementById("chatDash").innerHTML += `
                                <li id=${value} onClick="chat(this)">
                                    <img src=${contact.profilePic} />
                                    <span>${contact.fullName.charAt(0).toUpperCase()+contact.fullName.slice(1)}</span>
                                </li>`
            
                            // console.log(contact)
                        })
                    })
                // }
            })
            
        console.log(array)
    })
}



function chat(e) {
    var id = e.getAttribute("id");

    console.log('id',id)
    if(!navigator.onLine) {
        toast('we are offline!')
    }
    else{
    localStorage.setItem("chatWith",JSON.stringify(id))
    location='../pages/chat.html'
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