const endUrl = "https://retoolapi.dev/Ldd26I/data";

document.addEventListener("DOMContentLoaded", () => {
    const createButton = document.querySelector("#create");
    const readButton = document.querySelector("#read");
    const userForm = document.querySelector("#dForm");
    const userFormSubmitButton = document.querySelector("#uFormSubmitButton");
    const userList = document.querySelector("#userList");
    const nameInput = document.querySelector("#name");
    const uIdInput = document.querySelector("#uId");
    const jobInput = document.querySelector("#job");
    const numberInput = document.querySelector("#number");

    createButton.addEventListener('click',() => {
        clearUserForm();
        displayCreateButton();
        displayUserForm();
    })
    
    readButton.addEventListener('click',() => {
        displayUserList();
    })

    function displayUserForm() {
        userList.classList.add("d-none");
        userForm.classList.remove("d-none");
    }

    function displayUserList() {
        readAllUsers();
        userForm.classList.add("d-none");
        userList.classList.remove("d-none");
    }

    userForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = nameInput.value;
        const uId = parseInt(uIdInput.value);
        const job = jobInput.value;
        const number = parseInt(numberInput.value);
        const user = {
            name: name,
            uId: uId,
            job: job,
            number: number
        };
        if (uId == 0) {
            createUser(user);
        } else {
            updateUser(uId, user);
        }
    });

    async function updateUser(id, user) {
        const response = await fetch(endUrl + "/" + id, {
            method: "PATCH",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            alert("Hiba történt")
            return;
        }
        displayUserList();
    }

    async function createUser(user) {
        const response = await fetch(endUrl, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            displayUserList();
        } else {
            alert("hiba történt")
        }
    }

    function clearUserForm() {
        nameInput.value = "";
        uIdInput.value = 0;
        jobInput.value = "";
        numberInput.value = 0;
    }

    async function deleteUser(id) {
        const userConfirm = confirm(`Biztos szeretné törölni a ${id} sorszámú elemet?`)
        if (!userConfirm) {
            return;
        }
        const response = await fetch(endUrl + "/" + id, {
            method: "DELETE"
        });
        readAllUsers();
        if (!response.ok) {
            alert("Sikertelen törlés");
        }
    }

    function readAllUsers() {
        fetch(endUrl)
            .then((response) => response.json())
            .then((data) => adatokTablazatba(data))
    }

    function adatokTablazatba(data) {
        let tablaHtml = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>name</th>
                    <th>uId</th>
                    <th>job</th>
                    <th>number</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>`;


        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let tableRow = `<tr>
                <td>${element.name}</td>
                <td>${element.uId}</td>
                <td>${element.job}</td>
                <td>${element.number}</td>
                <td>
                    <button type="button" class="btn btn-outline-success" onclick="loadUserUpdateForm(${element.id})">Módosítás</button>
                    
                    <button type="button" class="btn btn-outline-danger" onclick="deleteUser(${element.id})">Törlés</button>
                </td>
            </tr>`;
            tablaHtml += tableRow;
        }

        tablaHtml += '</tbody></table>';
        userList.innerHTML=tablaHtml;
    }

    async function loadUserUpdateForm(id) {
        const response = await fetch(endUrl + "/" + id);
        if (!response.ok) {
            readAllUsers();
            alert("Hiba történt a módosítási űrlap megnyitása során");
            return;
        } 
        const user = await response.json();
        console.log(user);
        nameInput.value = user.name;
        uIdInput.value = user.uId;
        jobInput.value = user.job;
        numberInput.value = user.number;

        displayUpdateButton();
        displayUserForm();
    }

    function displayUpdateButton() {
        userFormSubmitButton.textContent = "Módosítás";
        userFormSubmitButton.classList.remove("btn-outline-primary");
        userFormSubmitButton.classList.add("btn-outline-success");
    }

    function displayCreateButton() {
        userFormSubmitButton.textContent = "Felvétel";
        userFormSubmitButton.classList.remove("btn-outline-success");
        userFormSubmitButton.classList.add("btn-outline-primary");
    }
    
    window.deleteUser = deleteUser;
    window.loadUserUpdateForm = loadUserUpdateForm;
    readAllUsers();
});