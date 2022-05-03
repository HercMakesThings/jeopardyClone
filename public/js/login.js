const logForm = document.querySelector('#login-form');


async function getProfile(){

    const token = localStorage.getItem('jeopardy-token');
    //check if token exists
        const result = await fetch('/login/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token
            })
        }).then(res=>res.json());
   

    if(result.status === 'logged in!'){
        // if user is already logged in, send them to upload page
        window.location.href = window.location.origin + '/new';
    }else if(result.status === 'not logged in!'){

        console.log(result.status);
    }
}

getProfile();


logForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log(username);

    const result = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then(res => res.json());

    //throw error alert popup if result throws an error
    if(result.status === 'ok'){
        //everything went fine, connection made
        // console.log('Logged in! Token info: ' + result.data);
        //store jwt token into client localstorage
        localStorage.setItem('jeopardy-token', result.data);
        //redir to csv upload page (TEST)
        window.location.href = window.location.origin + '/new';
        // window.location.href = 'http://localhost:3001/new';
    }else{
        alert(result.error);
    }

});