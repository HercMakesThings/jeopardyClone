const logForm = document.querySelector('#login-form');

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
        console.log('Logged in! Token info: ' + result.data);
        //store jwt token into client localstorage
        localStorage.setItem('token', result.data);
        //redir to csv upload page (TEST)
        window.location.href = 'http://localhost:3001/new.html';
    }else{
        alert(result.error);
    }

});