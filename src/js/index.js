import bootstrap from '../../node_modules/bootstrap/dist/js/bootstrap.min';
import material from '../../node_modules/bootstrap-material-design/dist/js/material.min';
import ripples from '../../node_modules/bootstrap-material-design/dist/js/ripples.min';
import moment from '../../node_modules/moment/moment';
import uk from '../../node_modules/moment/locale/uk';


$.material.init();

function getElement(selector) {
  return document.querySelector(selector);
}

// register
if(!localStorage.userName) {
    getElement('.register-form button').addEventListener("click", ()=>{
        let input = getElement('.register-form input');
        if(input.value.length == 0) {
            getAlert('Change a few things up</a> and try submitting again.', '.register-alert');
            return;
        }
        getElement('.register').classList.add('bounceOutLeft');
        localStorage.userName = input.value;
    })

    function getAlert(msg, to) {
        let coustomAlert = `<div class="alert alert-dismissible alert-danger bounceIn animated">
                                <button type="button" class="close" data-dismiss="alert">×</button>
                                <strong>Oh snap!</strong>
                                <a href="javascript:void(0)" class="alert-link">${msg}
                            </div>`;
        getElement(to).innerHTML = coustomAlert;
    }
} else {
    getElement('.register').style.display = 'none';
}

//Online time
let event = moment(new Date);
setInterval(function () {
    let now = moment();
  getElement('#tm').innerHTML = now.subtract(event.toObject()).format('HH:mm:ss');
}, 1000);

//Local-time
function getDate() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if(minutes < 10) {
        minutes = '0' + minutes;
    }
  getElement('#time-local').innerHTML = hours + ':' + minutes;
}
setInterval(getDate, 1000);

function getUsername(users, message) {

    let userName;

    users.forEach((user)=>{
    if (user.user_id == message.user_id) {
      userName = user.username;
    }
  });
  return userName;
}

//Send message button
var send = getElement('.send-message');
var text = getElement('#textArea');
var closeTab = getElement('.icon-close');
var now = moment();
var inputNick;
function sendMessage() {
    var msg = text.value;
    var containerChat = getElement('.active.tab-pane .list-group');
  let sendTime = new Date();
    containerChat.insertAdjacentHTML("beforeEnd",
            `<div class="list-group-item">
                <div class="row-content">
                    <div class="least-content">${moment().format("LT")}</div>
                        <h4 class="list-group-item-heading">${inputNick.value}</h4>
                        <p class="list-group-item-text">${msg}</p>
                    </div>
                </div>`);
    text.value = '';

    var data = 'name='+inputNick.value+'&message='+msg+'&time='+now.format("LT");
    getAjaxResponse('POST', 'https://main-workspace-juggerr.c9users.io:8081/user/register', data)
        .then(function(data){
            console.log(data);
        });

    document.querySelectorAll('.info li').forEach((el)=>{
        el.firstElementChild.innerHTML = "0";
    })
};

const ENTER = 13;
var myTextarea = getElement('#textArea');
myTextarea.addEventListener('keyup', function(e) {

    if(e.keyCode == ENTER) {
        e.preventDefault();
        sendMessage();
    }
    return false;
});

//Close tab button
var mainTextChat = getElement('#main-chat');

function closeTabChat() {
    this.parentElement.remove();
    var tabId = this.previousElementSibling.getAttribute("href");
    document.querySelector(tabId).remove();
    mainTextChat.classList.add('active');
}
closeTab.addEventListener('click', closeTabChat);
send.addEventListener('click', sendMessage);

var users;
//List people
// var users = [
//     {username: "John Snow", status: "Active"},
//     {username: "Andrew Simpson", status: "Active"},
//     {username: "Alison Black", status: "Active"},
//     {username: "Sasha Stuart", status: "Away"}
// ];
var listPeople = document.getElementById('list-people');

function getUsers (users) {
    var userItem = '';

    users.forEach(function(item) {
        if (item.status == 'Suspended') {
            userItem += `<li class="user-offline"><span class="glyphicon glyphicon-user"></span>${item.username}</li>`;
        } else {
            userItem += `<li><span class="glyphicon glyphicon-user"></span>${item.username}</li>`;
        }
    });
    listPeople.innerHTML = userItem;
  getElement('#onlineElem').innerHTML = users.length;
}

function getNick(e) {
    if(e.keyCode == ENTER) {
        e.preventDefault();
        inputNick = getElement('#focusedInput1');
        users.push({username: inputNick.value, status: "Active"});
        getUsers(users);
        inputNick.disabled = true;
    }
    return false;
}
var inputNick = getElement('#focusedInput1');
inputNick.addEventListener('keydown', getNick);

//Messages
var messages;
// var messages = [
//     {nick: "John Snow", content: 'Donec id elit non mi porta gravida at eget metus.', time: '10:45'},
//     {nick: "Andrew Simpson", content: 'Donec id elit non mi porta gravida at eget metus.', time: '10:47'},
//     {nick: "Alison Black", content: 'Donec id elit non mi porta gravida at eget metus.', time: '10:49'}
// ];
var listMessages = getElement('.list-group');
function getMessages (messages, users) {
    var messagesItem = '';
    messages.forEach((item)=> {
        messagesItem += `<div class="list-group-item">
                            <div class="row-content">
                                <div class="least-content">${now.format("LT")}</div>
                                <h4 class="list-group-item-heading">${getUsername(users, item)}</h4>
                                <p class="list-group-item-text">${item.message}</p>
                            </div>
                        </div>`;
    });
    listMessages.insertAdjacentHTML("beforeEnd", messagesItem);
}
// getMessages (messages);

// Count characters
var area = getElement('#textArea');

function counter(elem, regexp) {
    let char = elem.value;
    if(regexp) {
        return char.split(regexp).length-1;
    }
    return char.length;
}
area.addEventListener('keyup', ()=> {
    getElement('#allCharCount').innerHTML = counter(area);
    getElement('#txtCharCount').innerHTML = counter(area, /[^\.,!;:\-\?\s]/g);
    getElement('#whitespaceCharCount').innerHTML = counter(area, /\s/g);
    getElement('#punctuationCharCount').innerHTML = counter(area, /[\.,!;:\-\?]/g);
});

function validatePhone() {
  const regex = /\+(38\s)?(\([0-9]{3}\))((\s[0-9]{2}\-[0-9]{2}\-[0-9]{3})|(\s[0-9]{2}\s[0-9]{2}\s[0-9]{3}))/g;

  var area = getElement('#textArea');
  var  result = area.value.match(regex);
  if(result != undefined) {
    getElement('#phonenumbers').innerHTML = result.length;
  }
}
area.addEventListener('keyup', validatePhone);

// Text formatting buttons
var getSelectedText = function() {
    var text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection) {
        text = document.selection.createRange().text;
    }
    selectedText = text;
};
var selectedText = '';
function wrapElement(elem, text, textformat) {
    if (text == 0) {
        return text;
    }
    if (textformat == 'a') {
        elem.value = elem.value.replace(text, '<' + textformat + ' href="#">' + text + '</' + textformat + '>');
    } else {
        elem.value = elem.value.replace(text, '<' + textformat + '>' + text + '</' + textformat + '>');
    }
}
var btnBold = getElement('.btn-bold');
var btnItalic = getElement('.btn-italic');
var btnUnderline = getElement('.btn-underline');
var btnLink = getElement('.btn_link');

area.addEventListener('mouseup', getSelectedText);
btnBold.addEventListener('click', function (e) {
    e.preventDefault();
    wrapElement(area, selectedText, 'b');
});
btnItalic.addEventListener('click', function (e) {
    e.preventDefault();
    wrapElement(area, selectedText, 'i');
});
btnUnderline.addEventListener('click', function (e) {
    e.preventDefault();
    wrapElement(area, selectedText, 'u');
});
btnLink.addEventListener('click', function (e) {
    e.preventDefault();
    wrapElement(area, selectedText, 'a');
});

// Выполняется AJAX запрос к внешнему ресурсу
function getAjaxResponse(method, url, body) {
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open(method, url, true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Обработчик успещного ответа
                var users = JSON.parse(request.responseText);
                resolve(users);
            } else {
                // Обработчик ответа в случае ошибки
                reject(new Error("Request failed: " + request.statusText));
            }
        };
        if(body) {
            request.send(body);
        } else {
            request.send();
        }
    })
};
var usersData;
getAjaxResponse('GET', 'https://main-workspace-juggerr.c9users.io:8081/user')
    .then((data) => {
      usersData = data;
       getUsers(data);
       users = data;
       console.log(users);
    })
    .then(() => {
getAjaxResponse('GET', 'https://main-workspace-juggerr.c9users.io:8081/messages')
  .then(function(data) {
    getMessages (data, usersData);
    messages = data;
    console.log(messages);
  })
});
