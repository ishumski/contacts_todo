/*HEADER BUTTONS*/
const addContactBtn = document.querySelector('#add-contact');
const addGroupBtn = document.querySelector('#add-group')

/*CLOSE SIDEBAR BUTTON*/
const closeButton = document.querySelectorAll('.btn-close')

/*CONTACT SIDEBAR BUTTON*/
const saveContactBtn = document.getElementById('save-btn')
const updateBtn = document.getElementById('update-btn')

/*GROUPS SIDEBAR BUTTONS*/
const addGroupButton = document.getElementById('add-group-btn')
const saveGroupBtn = document.getElementById('save-group-button')

/*SCREENS*/
const addContactSidebar = document.querySelector('.add-contact-sidebar')
const addGroupSidebar = document.querySelector('.add-group-sidebar')
const opacityTemplate = document.getElementById('opacity-template')
const contactsListView = document.getElementById('content-container')
const groupsList = document.getElementById('groups-list')

const noContacts = `<div class="no-contacts-wrapper">
                        <div class="no-contacts">
                           Список контактов пуст
                        </div>
                     </div>`

/*UNIQUE ID GENERATOR*/
const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

let groups = ['Друзья', "Коллеги"]
let contacts = []

/*SHOW AND HIDE SIDEBAR FUNCTIONS*/
const showSidebar = () => {
    addContactSidebar.style.display = 'block'
    opacityTemplate.style.display = 'block'
}

const hideSidebar = () => {
    addContactSidebar.style.display = 'none'
    addGroupSidebar.style.display = 'none'
    opacityTemplate.style.display = 'none'
    window.location.reload()
}

addContactBtn.addEventListener('click', showSidebar)
closeButton.forEach(elem => elem.addEventListener('click', hideSidebar))

addGroupBtn.onclick = () => {
    addGroupSidebar.style.display = 'block'
    opacityTemplate.style.display = 'block'
}

document.onload = filteredContactsByGroups()
document.onload = setDefaultGroups()
document.onload = showGroups()

/*ACCORDION*/
const contactsAccordion = (contacts) => {
    let html = ''
    contacts.forEach((elem) => {
        html += `<li class="contact" data-id=${elem.id}>
          <span class="contact__name">${elem.userName}</span>
          <span class="contact__number">${elem.phoneNumber}</span>
          <button
            type="button"
            id='${elem.id}'
            class="btn btn-primary action-button action-button_edit edit"
            >
          </button>
          <button
            type="button"
            id='${elem.id}'
            class="btn btn-danger action-button action-button_remove delete"
            >
            </button>
        </li>`
    })
    return html
}


/*SHOW DATA*/
function showData() {
    let contactsList
    let html = ''

    let filteredContacts = filteredContactsByGroups()
    if (localStorage.getItem('contacts') == null) {
        contactsList = []
    } else {
        contactsList = JSON.parse(localStorage.getItem('contacts'))
    }

    filteredContacts.forEach((elem, index) => {
        const preparedContactsList = contactsAccordion(elem.contacts)

        html += `<div class="accordion-item">
    <h2 class="accordion-header" id="heading_${index}">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${index}" aria-expanded="true" aria-controls="collapse_${index}">
        ${elem.group}
      </button>
    </h2>
    <div id="collapse_${index}" class="accordion-collapse collapse show" aria-labelledby="collapse_${index}">
      <ul class="accordion-body prepared-contacts-list" id="prepared-contacts-list">
        ${preparedContactsList}
      </ul>
    </div>
  </div>`
    })

    contactsList.length === 0
        ? contactsListView.innerHTML = noContacts
        : contactsListView.innerHTML = html
}

//LOAD ALL DATA WHEN DOCUMENT OR PAGE LOADED
document.onload = showData()

function validateInputValue(inputValue) {
    if (inputValue.value === '') {
        inputValue.classList.add('is-invalid')
        return false
    } else {
        inputValue.classList.remove('is-invalid')
        return true
    }
}


/* ADD CONTACT DATA */
function addContact() {
    let formData = {}
    let contactsList
    const userName = document.getElementById('userName')
    const phoneNumber = document.getElementById('phoneNumber')

    formData["userName"] = userName.value
    formData["phoneNumber"] = phoneNumber.value
    formData["group"] = document.getElementById('group').value
    formData["id"] = uuidv4()

    if (localStorage.getItem('contacts') == null) {
        contactsList = []
    } else {
        contactsList = JSON.parse(localStorage.getItem('contacts'))
    }

    if (validateInputValue(userName) & validateInputValue(phoneNumber)) {
        localStorage.setItem('contacts', JSON.stringify([...contactsList, formData]));
        showData()
        hideSidebar()
        userName.value = ''
        phoneNumber.value = ''
        return true
    }
}

saveContactBtn.addEventListener('click', addContact)

/*DELETE CONTACTS*/
function deleteContact(index) {
    let contactsList
    if (localStorage.getItem('contacts') == null) {
        contactsList = []
    } else {
        contactsList = JSON.parse(localStorage.getItem('contacts'))
    }
    const filteredContactList = contactsList.filter(item => item.id != index)
    localStorage.setItem('contacts', JSON.stringify(filteredContactList));
    showData()
}

document.querySelectorAll('.delete')
    .forEach((elem) => {
        elem.onclick = function (event) {
            deleteContact(event.target.id)
            window.location.reload()
        }
    })

/* UPDATE CONTACT*/
function updateContact(contactId) {
    let contactsList
    let userName = document.getElementById('userName')
    let phoneNumber = document.getElementById('phoneNumber')
    let group = document.getElementById('group')

    if (localStorage.getItem('contacts') == null) {
        contactsList = []
    } else {
        contactsList = JSON.parse(localStorage.getItem('contacts'))
    }

    updateBtn.style.display = 'block'
    saveContactBtn.style.display = 'none'
    const existingItem = contactsList.find(contact => contact.id == contactId)

    if (existingItem) {
        showSidebar()
        userName.value = existingItem.userName
        phoneNumber.value = existingItem.phoneNumber
        group.value = existingItem.group
    }
    updateBtn.onclick = () => {
        if (validateInputValue(userName) && validateInputValue(phoneNumber)) {
            existingItem.userName = userName.value
            existingItem.phoneNumber = phoneNumber.value
            existingItem.group = group.value
            localStorage.setItem('contacts', JSON.stringify(contactsList));
            showData()
            hideSidebar()
        }
    }
}

const updateButtonNode = document.querySelectorAll('.edit')
updateButtonNode.forEach((item) => {
    item
        .addEventListener('click',
            function (event) {
                showSidebar()
                showData()
                updateContact(event.target.id)
            })
})

/*SET DEFAULT GROUPS TO LOCAL STORAGE*/
function setDefaultGroups() {
    const localStorageGroups = JSON.parse(localStorage.getItem('groups'))
    const isGroupsNotExist = localStorageGroups === null || localStorageGroups.length === 0

    if (isGroupsNotExist) {
        localStorage.setItem('groups', JSON.stringify(groups));
    }
}

/* GROUP SELECTOR */
const groupsSelector = document.getElementById('group')

/*PREPARE GROUP OPTIONS*/
const groupsOptions = () => {
    let html = ''
    JSON.parse(localStorage.getItem('groups')).forEach(group => {
        html += `<option value=${group}>${group}</option>`;
    })
    groupsSelector.innerHTML = html
}
groupsOptions()

/*GROUP TEMPLATE WRAPPER*/
function groupTemplate(group) {
    const li = document.createElement('li')
    li.classList.add('group-item', 'd-flex')

    const input = document.createElement('input')
    input.classList.add('form-control', 'form-item', 'group-input', 'mr-12')
    input.placeholder = 'Введите название'
    input.value = group

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('btn', 'btn-danger', 'action-button', 'action-button_remove')
    deleteButton.addEventListener('click', function () {
        li.remove()
    })
    li.appendChild(input)
    li.appendChild(deleteButton)
    groupsList.appendChild(li)
}

/*SHOW GROUPS*/
function showGroups() {
    JSON
        .parse(localStorage.getItem('groups'))
        .forEach((group) => groupTemplate(group))
}

/*CREATE NEW GROUP*/
addGroupButton.addEventListener('click', function () {
    const groupInputs = document.querySelectorAll('.group-input')
    let groupIndex
    groupInputs.forEach((elem, index) => {
        groupIndex = index
    })
    groupTemplate('', groupIndex)
})

/* SAVE GROUP */
function saveGroup() {
    const groupInputValues = document.querySelectorAll('.group-input')
    const updatedValues = Array.from(groupInputValues)
        .map(elem => elem.value)
        .filter(elem => elem !== '')
    localStorage.setItem('groups', JSON.stringify(updatedValues))
}

saveGroupBtn.addEventListener('click', function () {
    saveGroup()
    groupsOptions()
    hideSidebar()
})

/*PREPARE DATA CONTACTS SORTED BY GROUPS*/
function filteredContactsByGroups() {
    let contactsList
    let group = ''
    contactsList = JSON.parse(localStorage.getItem('contacts')) || []

    let map = new Map(
        contactsList
            .map((item) => {
                let filteredList = contactsList.filter((elem) => item.group === elem.group)
                return [item['group'], [...filteredList]]
            }));
    let groupModel = {
        group,
        contacts
    }
    let preparedData = []
    const keys = map.keys()

    for (let key of keys) {
        const contactValues = map.get(key)
        groupModel = {
            ['group']: key,
            ['contacts']: contactValues
        }
        preparedData.push(groupModel)
    }
    return preparedData
}
