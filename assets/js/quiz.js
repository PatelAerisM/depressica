/*
 * js file for quiz
*/

// variable declarations
let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


// set up content variables
let textAreaEl = document.createElement("textarea")


// building questions
// response types
let responseType = { // an object with distinct types
    yesNo: ["Yes", "No"],
    weekday: weekdays,
    frequency: ["Not at all", "Not frequently", "A couple times a month", "A couple times a week", "Every Day"],
    userInput: textAreaEl,
}


/*  Questions in this format
    {question: "",
    response: responseType.frequency},
*/

let depressionQuestions = [ // an array of objects depressionQuestions[0].question, depressionQuestions[1].response
    {question: "How difficult have these problems made it for you to work, at home, or with others?",
    response: responseType.frequency},
    {question: "How often are you having thoughts that you would be better off dead, or of hurting yourself?",
    response: responseType.frequency},
    {question: "How often are you moving or speaking so slowly that other people have noticed",
    response: responseType.frequency},
    {question: "How often are you having trouble concentrating on things such as reading the newspaper or watching TV?",
    response: responseType.frequency},
    {question: "How often are you feeling bad about yourself (feel like a failure or let your family down)",
    response: responseType.frequency},
    {question: "How often do you have a poor appetite or overeating?",
    response: responseType.frequency},
    {question: "How often are you feeling tired or having little energy?",
    response: responseType.frequency},
    {question: "How often are you having trouble falling or staying asleep, or sleeping too much?",
    response: responseType.frequency},
    {question: "How often are you feeling down, depressed, or hopeless?",
    response: responseType.frequency},
    {question: "Do you have little interest or please in doing things?",
    response: responseType.frequency},
]

let otherQuestions = [ // an array of objects
      {question: "Are the happy thoughts speeding up your thought process?", response: responseType.yesNo},
      {question: "Are the sad thoughts slowing down your thought process?", response: responseType.yesNo},
      {question: "How much brain fog are you experiencing?", response: responseType.frequency},
      {question: "Have you had any grandiose thoughts?", response: responseType.frequency}
    ];

let impairmentQuestions = [ // an array of objects
      {question: "What is the Weekday?", response: responseType.userInput},
      {question: "Type in the first three things you see", response: responseType.userInput},
      {questionName: "What is the year?", response: responseType.userInput}
    ];

let anxietyQuestions = [  // an array of objects
    {question: "How often have you been feeling nervous, anxious, or on edge",
    response: responseType.frequency},
    {question: "How often have you been not able to stop or control worrying",
    response: responseType.frequency},
    {question: "How often have you been worrying too much about different things",
    response: responseType.frequency},
    {question: "How often have you been having trouble relaxing",
    response: responseType.frequency},
    {question: "How often have you been so restless that it is hard to sit still",
    response: responseType.frequency},
    {question: "How often have you been easily annoyed or irritable",
    response: responseType.frequency},
    {question: "How often have you been feeling as if something awful might happen?",
    response: responseType.frequency},
];

let titleDivEl = document.createElement("div")
let titleTextEl = document.createElement("h1")

for (let i = 0; i < depressionQuestions.length; i++) {
    let contentDivEl = document.querySelector("#content");
    console.log("hi")
    let a = document.createElement("li");
    a.textContent = depressionQuestions[i].question;
    contentDivEl.appendChild(a)

    //console.log(depressionQuestions[i].response.length)
    for (let j = 0; j < depressionQuestions[i].response.length; j++) {
        let b = document.createElement("li");
        b.textContent = depressionQuestions[i].response[j]
        contentDivEl.appendChild(b)
    }
}



