console.log('jeopardy!');

//initialize global variables for board manipulation
let tableCells = document.getElementsByTagName('td');
// console.log(tableCells);
let tableHeaders = document.getElementsByTagName('th');
console.log(tableHeaders);

let switcher = document.getElementById('checker');
let team1Turn = true;

let modal = document.getElementById('modal');
let popup = document.getElementById('popup');
let modalA = document.getElementById('modalA');
let popupA = document.getElementById('popupA');
let popupAnswer = document.getElementById('popupA-text');
let popupQuestion = document.getElementById('popup-text');
let correctA = document.getElementById('a-correct');
let incorrectA = document.getElementById('a-incorrect');

let logoutBtn = document.getElementById('logout');
let resetBtn = document.getElementById('reset-btn');

let btn1 = document.getElementById('btn-1');
let btn2 = document.getElementById('btn-2');

let score1 = 0;
let score2 = 0;

let scoreTemp = 0;

let questionArr = [];
let answerArr = [];

let loggedUser;

//check if user is logged in
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
      console.log(result.status);
      // console.log(result.data);
      let {username} = result.data;
      loggedUser = username;
      console.log(username);
  }else if(result.status === 'not logged in!'){
      // alert(result.error);
      // //redirect to login page on error
      window.location.replace('/');
      // console.log(result.status);
  }
}

// getProfile();

//fetch questions from questions csv
async function getQuestions(){
  const data = await fetch(`csv/${loggedUser}/questions.csv`);
  const questions = await data.text();
  const rows = questions.split(/\n/).slice(1);
  const headers = questions.split(/\n/).slice(0, 1).toString();
  // console.log(rows);
  rows.forEach(elt =>{
    const row = elt.split(',');
    // console.log(row);
    questionArr.push(row);
  });
  const newHeaders = headers.split(',');
  // console.log(newHeaders);
  for(let i=0; i<tableHeaders.length; i++){
    tableHeaders[i].textContent = newHeaders[i];
  }
  // console.log(questionArr[0][2]);
}

//fetch answers from answers csv sheet
async function getAnswers(){
  const data = await fetch(`csv/${loggedUser}/answers.csv`);
  const answers = await data.text();
  const rows = answers.split(/\n/).slice(1);
  rows.forEach(elt =>{
    const row = elt.split(',');
    // console.log(row);
    answerArr.push(row);
  });
}
// setTimeout(getQuestions, 500);
// setTimeout(getAnswers, 500);
// getQuestions();
// getAnswers();
getProfile()
  .then(getQuestions)
  .then(getAnswers)
  .catch(err=>console.log(err));

//switch between teams with event listener
switcher.addEventListener('change', ()=>{
  if(!team1Turn){
    team1Turn = true;
  }else if(team1Turn){
    team1Turn = false;
  }
});

//adds event listener for each table cell on board
for(let i=0; i<tableCells.length; i++){
  tableCells[i].addEventListener('click', ()=>{
    //parses the row the clicked cell is on by looking at the text content
    let currentCell = tableCells[i].textContent;
    let parsedCell = parseInt(currentCell);
    let currentRow = parsedCell/100;
    scoreTemp = parsedCell;

  
    //updates scoreboard depending on which team is currently active
    if(team1Turn){
      tableCells[i].style.backgroundColor = 'cyan';

      // score1 += parsedCell;
      // document.getElementById('t1-score').textContent = score1;
    }else if(!team1Turn){
      tableCells[i].style.backgroundColor = 'lime';

      // score2 += parsedCell;
      // document.getElementById('t2-score').textContent = score2;
    }

    //makes modal window visible and fills text content
    // with the right question and answer
    modal.style.display = 'block';
    popupQuestion.textContent = questionArr[currentRow-1][i%5];
    popupAnswer.textContent = answerArr[currentRow-1][i%5];

  });//end eventListener
}//end for loop

//event listener to make question view disappear 
// and answer view to appear when clicking the page
modal.addEventListener('click', ()=>{
  modal.style.display = 'none';
  modalA.style.display = 'block';
});

//handle scores depending on which team got it and if the answer was right or not
correctA.addEventListener('click', ()=>{

  //updates scoreboard depending on which team is currently active
  if(team1Turn){
    score1 += scoreTemp;
    document.getElementById('t1-score').textContent = score1;
  }else if(!team1Turn){
    score2 += scoreTemp;
    document.getElementById('t2-score').textContent = score2;
  }
  //hides modal popup
  modalA.style.display = 'none';
});

//hides modal popup if answer was incorrect
incorrectA.addEventListener('click', ()=>{
  modalA.style.display = 'none';
});

//resets board and scores on button click
resetBtn.addEventListener('click', ()=>{
  //loop through each table cell to change its bg back to normal
  for(let i=0; i<tableCells.length; i++){
    tableCells[i].style.backgroundColor = '#760355';
    tableCells[i].classList.add('hover-td');
  }
  document.getElementById('t1-score').textContent = '000';
  document.getElementById('t2-score').textContent = '000';
  score1 = 0;
  score2 = 0;
});

//removes jwt token from localstorage 
// and logs out user, bringing them back to login screen
logoutBtn.addEventListener('click', ()=>{
  // console.log('logout!');
  localStorage.removeItem('jeopardy-token');
  window.location.replace('/');
});

