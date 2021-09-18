

// to add the item entered in text field to database---------------
function addItem(event) {
    event.preventDefault();
    // console.log('item added')
    let text = document.querySelector('#todo-input')
    // console.log(text.value)
    db.collection('todo-items').add({
        text: text.value,
        status: 'Active'
    })

    text.value = ""

}


//to get all the items from db------------------------------
function getItems() {
    db.collection('todo-items').onSnapshot((snapshot) => {
        // console.log(snapshot);
        let itemsToRender = [];
        snapshot.docs.forEach((doc) => {
            itemsToRender.push({
                id: doc.id,
                ...doc.data()
            })
        })
        // console.log(itemsToRender)
        genereateItems(itemsToRender)


    })
}


// to generate the html from the fetched items-----------------------
function genereateItems(items) {
    itemsHtml = "";
    items.forEach(item => {
        itemsHtml += `
        <div class="todo-item">
          <div class="check">
            <div data-id="${item.id}" class="check-mark ${item.status == 'completed' ? 'checked' : ""}">
              <img src="/images/icon-check.svg" alt="">
            </div>

          </div>
          <div class="todo-text ${item.status == 'completed' ? 'checked' : ""}">
            ${item.text}
          </div >
        </div >
            `
    })

    document.querySelector('.todo-items').innerHTML = itemsHtml;
    createEventListners()

}


//to create event listner on the each of the checkboxes-------------------------
function createEventListners() {
    let todoCheckMarks = document.querySelectorAll('.todo-item .check .check-mark')
    // console.log(todoCheckMarks)

    todoCheckMarks.forEach(checkMark => {
        checkMark.addEventListener('click', function () {
            markCompleted(checkMark.dataset.id);
        })
    })

}

//to mark complete or Active in the notes--------------------
function markCompleted(id) {
    // console.log(id)
    let item = db.collection('todo-items').doc(id);

    item.get().then(function (doc) {
        if (doc.exists) {
            // console.log("here is doc", doc.data())
            let status = doc.data().status;
            if (status == 'Active') {
                item.update({
                    status: 'completed',
                })
            }
            else if (status == 'completed') {
                item.update({
                    status: 'Active'
                })
            }

        }
        else {

        }
    })

}


getItems()

