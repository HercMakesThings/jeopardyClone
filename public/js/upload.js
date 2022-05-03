
const uplForm = document.getElementById('uploads-form');

const token = localStorage.getItem('jeopardy-token');
const parsedToken = JSON.stringify(token);
const tokenArr = parsedToken.split('.');
// const userInfo = buffer.from(tokenArr[1], 'base64');
const userInfo = atob(tokenArr[1]);
const parsedUser = JSON.parse(userInfo);
const myUser = JSON.stringify(parsedUser.username);
console.log(myUser);

let loggedUser;


async function getProfile(){

    // const userField = document.getElementById('user-name');
    

    // const token = localStorage.getItem('jeopardy-token');

    const result = await fetch('/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token
        })
    }).then(res=>res.json());

    if(result.status === 'ok'){
        // userField.textContent = result.data.username;
        console.log(result.status);
        // console.log(result.data);
        let {username} = result.data;
        loggedUser = username;
    }else{
        alert(result.error);
        //redirect to login page on error
        window.location.replace(result.redirectURL);
    }
}

getProfile();

uplForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    // const questions = document.getElementById('questions').value;
    // const quesFormData = new FormData();
    // const ansFormData = new FormData();
    const formData = new FormData();
    const questions = document.getElementById('questions').files[0];
    const answers = document.getElementById('answers').files[0];

    // quesFormData.append('questions', questions);
    // ansFormData.append('answers', answers);

    formData.append('questions', questions);
    formData.append('answers', answers);

    // const request = new XMLHttpRequest();

    // request.open('POST', '/upload/csv', true);
    // // request.setRequestHeader('Content-type', 'multipart/form-data');

    // request.onreadystatechange = function (){
    //     if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
    //     console.log("yey");
    //     }
    // }
    
    // request.send(quesFormData);

    // console.log(questions);
    // console.log(answers);

    const result = await fetch(`/upload/csv/${loggedUser}`, {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'text/csv'
        // },
        body: formData, myUser 
    }).then(res=>res.json()).catch((err)=>console.error(err));

    if(result.status === 'ok'){
        //everything went fine, connection made
        console.log(result.status);
        // console.log(result.data);
        window.location.href = window.location.origin + '/jeopardy';
    }else{
        alert(result.error);
        window.location.reload();
    }
});