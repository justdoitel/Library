//TODO: Sorting (reverse)
//TODO: shorten code somehow
let counter = 0;
let books = [];
let rot = 0;
let overlay = document.getElementById("overlay")
let mainform = document.getElementById("mainform")
let mainsubmit = document.querySelector("#mainform .submit-button")
let title = document.querySelector("#mainform>input[name=title]")
let author = document.querySelector("#mainform>input[name=author]")
let read = document.querySelector("#mainform>input[name=read]")
let total = document.querySelector("#mainform>input[name=total]")

let pageform = document.getElementById("pageform")
let newpagenum = document.querySelector("#pageform>input[name=read]")
let pagesubmit = document.querySelector("#pageform .submit-button")

let editingid = null;
let editingCard = null;

// let sortbtn = document.getElementById("sort");
// sortbtn.addEventListener("click", function() {
//     rot=rot+180;
//     sortbtn.style = `transform: rotate(${rot}deg)`;
// });

window.addEventListener('storage',()=>{location.reload()});

let stored = JSON.parse(localStorage.getItem("books"));
if(stored){
    books=stored;
    for (book of books){
        appendToDisplay(makeCard(book));
    }
}
if(localStorage.getItem("counter")){
    counter = localStorage.getItem("counter");
}

function attemptEdit(card,id){
    editingid = id;
    editingCard = card;
    pageform.classList.add("active");
    overlay.classList.add("active");
}

function getIndexFromId(id) {
    id=parseInt(id)
    let x = 0;
    for (book of books){
        if(book.id===id){
            return x;
        }
        x++;
    }
    return null;
}

pagesubmit.addEventListener("click", function(event){
    event.target.setCustomValidity('');
    if(pagesubmit.checkValidity()) {
        event.preventDefault();
        let currBook = books[getIndexFromId(editingid)];
        if(parseInt(newpagenum.value)>currBook.read&&parseInt(newpagenum.value)<=currBook.total){
            currBook.read=parseInt(newpagenum.value);
            localStorage.setItem("books",JSON.stringify(books))
            editingCard.querySelector('progress').value=parseInt(newpagenum.value)
            editingCard.querySelector('.read').innerText=newpagenum.value;
            overlay.click()
        } else if (parseInt(newpagenum.value)<=currBook.read) {
            if(parseInt(newpagenum.value)<currBook.read) event.target.setCustomValidity("Huh :0 you reading backwards or smth?");
            else event.target.setCustomValidity(`You've already reported that you're on page ${currBook.read} :)`);
            event.target.reportValidity()
        } else if (parseInt(newpagenum.value)>currBook.total){
            event.target.setCustomValidity('Hmm, you read more than the number of pages in the book?');
            event.target.reportValidity()
        }
    }
})

let add = document.getElementById("add");
add.addEventListener("click", function() {
    overlay.classList.add("active")
    mainform.classList.add("active")
});

overlay.addEventListener('click', (event) => {
    overlay.classList.remove("active")
    mainform.classList.remove("active")
    pageform.classList.remove("active")
    title.value="";
    author.value="";
    read.value="";
    total.value="";
    newpagenum.value="";
    editingid=null;
    editingCard=null;
    
});

mainsubmit.addEventListener ('click',(event)=>{
    if(mainform.checkValidity()) {
        event.preventDefault();
        if(title.value&&author.value&&!isNaN(parseInt(read.value))&&!isNaN(parseInt(total.value))) {
            if(parseInt(read.value)>parseInt(total.value)){
                let temp = read.value
                read.value=total.value
                total.value=temp;
            }
            appendToDisplay(makeCard(storeBook(new Book (title.value,author.value,parseInt(read.value),parseInt(total.value)))))
        }
        overlay.click();
    }
})



function Book(title, author, read, total) { //make the book object and return it
    this.title = title;
    this.author = author;
    this.read=read;
    this.total=total;
    this.id=counter++;
    localStorage.setItem("counter",counter);
}

function storeBook(book){ //store the book in our array and return it
    books.push(book);
    localStorage.setItem("books",JSON.stringify(books))
    return book;
}

function makeCard(book){ //make the card of the book and return it
    let title = document.createElement('p');
    title.classList.add("title");
    title.innerText = book.title;
    let author = document.createElement('p');
    author.classList.add("author");
    author.innerText = book.author;
    let progress = document.createElement('progress');
    progress.classList.add("progress");
    progress.value = book.read;
    progress.max = book.total;
    let ratio = document.createElement('p');
    ratio.classList.add("ratio");
    let readspan = document.createElement('span');
    readspan.classList.add("read")
    readspan.innerText=book.read;
    let slash = document.createTextNode("/");
    let totalspan = document.createElement('span');
    totalspan.classList.add("total")
    totalspan.innerText=book.total;
    ratio.appendChild(readspan)
    ratio.appendChild(slash)
    ratio.appendChild(totalspan)
    let editbtn = document.createElement('button');
    editbtn.classList.add("edit-btn")
    editbtn.innerText = "Edit pages read"
    let delbtn = document.createElement('button');
    delbtn.classList.add("del-btn")
    delbtn.innerText = "Remove book"
    let card = document.createElement('div');
    card.classList.add("book");
    card.dataset.id = book.id;
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(progress);
    card.appendChild(ratio);
    card.appendChild(editbtn);
    card.appendChild(delbtn);
    card.addEventListener("click",function(event){
        let id = event.currentTarget.dataset.id;
        if(event.target.classList.contains("del-btn")){
            event.currentTarget.remove();
            books.splice(getIndexFromId(id),1)
            localStorage.setItem("books",JSON.stringify(books))
        } else if (event.target.classList.contains("edit-btn")){
            attemptEdit(event.currentTarget,id);
        }
    })
    return card;
}

function appendToDisplay(card){
    document.querySelector(".books").insertAdjacentElement("beforeend",card); 
}