console.log('jeopardy!');

let tableCells = document.getElementsByTagName('td');
// console.log(tableCells);

let switcher = document.getElementById('checker');
let team1Turn = true;

let modal = document.getElementById('modal');
let popup = document.getElementById('popup');
let modalA = document.getElementById('modalA');
let popupA = document.getElementById('popupA');

let btn1 = document.getElementById('btn-1');
let btn2 = document.getElementById('btn-2');

let score1 = 0;
let score2 = 0;

let questionArr = [];
let answerArr = [];



async function getQuestions(){
  const data = await fetch('csv/questions.csv');
  const questions = await data.text();
  const rows = questions.split(/\n/).slice(1);
  rows.forEach(elt =>{
    const row = elt.split(',');
    // console.log(row);
    questionArr.push(row);
  });
  // console.log(questionArr[0][2]);
}

async function getAnswers(){
  const data = await fetch('csv/answers.csv');
  const answers = await data.text();
  const rows = answers.split(/\n/).slice(1);
  rows.forEach(elt =>{
    const row = elt.split(',');
    // console.log(row);
    answerArr.push(row);
  });
}

getQuestions();
getAnswers();

// let value1 = document.getElementById('score1-input').value;

switcher.addEventListener('change', ()=>{
  if(!team1Turn){
    team1Turn = true;
  }else if(team1Turn){
    team1Turn = false;
  }
});

for(let i=0; i<tableCells.length; i++){
  tableCells[i].addEventListener('click', ()=>{
    let currentCell = tableCells[i].textContent;
    let parsedCell = parseInt(currentCell);
    let currentRow = parsedCell/100;
    

    console.log('click!');
    console.log(tableCells[i].innerHTML);
    console.log(i);

    if(team1Turn){
      tableCells[i].style.backgroundColor = 'cyan';
      // score1 += parseInt(currentCell);
      score1 += parsedCell;
      document.getElementById('t1-score').textContent = score1;
    }else if(!team1Turn){
      tableCells[i].style.backgroundColor = 'lime';
      // score2 += parseInt(currentCell);
      score2 += parsedCell;
      document.getElementById('t2-score').textContent = score2;
    }

    console.log(questionArr[currentRow-1][i%5]);
    // console.log(currentRow);


    modal.style.display = 'block';
    popup.textContent = questionArr[currentRow-1][i%5];
    popupA.textContent = answerArr[currentRow-1][i%5];

  });//end eventListener
}//end for loop


modal.addEventListener('click', ()=>{
  modal.style.display = 'none';
  modalA.style.display = 'block';
});

modalA.addEventListener('click', ()=>{
  modalA.style.display = 'none';
  
});

// console.log(questionArr);
