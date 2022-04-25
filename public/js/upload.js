
const uplForm = document.getElementById('uploads-form');

async function getProfile(){

    const userField = document.getElementById('user-name');

    const token = localStorage.getItem('token');

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
        userField.textContent = result.data.username;
        console.log(result.status);
        console.log(result.data);
    }else{
        alert(result.error);
    }
}

getProfile();

uplForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    // const questions = document.getElementById('questions').value;
    const quesFormData = new FormData();
    const ansFormData = new FormData();
    const formData = new FormData();
    const questions = document.getElementById('questions').files[0];
    const answers = document.getElementById('answers').files[0];

    quesFormData.append('questions', questions);
    ansFormData.append('answers', answers);

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

    const result = await fetch('/upload/csv', {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'text/csv'
        // },
        body: 
            formData
        
    }).then(res=>res.json());

    if(result.status === 'ok'){
        //everything went fine, connection made
        console.log(result.status);
        // console.log(result.data);
        
        // window.location.href = 'http://localhost:3001/jeopardy.html';
    }else{
        alert(result.error);
    }
});