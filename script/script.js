const btnNew = document.querySelector('.btn-new');
const btnAutorize = document.querySelector('.btn-autorize');
const userList = document.querySelector('.user-list');
const userNameGreeting = document.querySelector('.user-name-greeting');
let currentUser;
let users = [];
let fio, alias, pwd, newRecord, newAlias, newPassword;

const usersFetch = function () {
    if (localStorage.getItem('usersList')) {
        users = JSON.parse(localStorage.getItem('usersList'));
    }
};

const delUser = (event) => {
    const target = event.target.closest('li');
    let indexForRemove;

    for (let i = 0; i < users.length; i++) {
        if ((target.textContent.indexOf(users[i].firstName) > -1) && (target.textContent.indexOf(users[i].lastName) > -1)) {
            indexForRemove = i;
            break;
        }
    }
    users.splice(indexForRemove, 1);
    localStorage.removeItem('usersList');
    if (users.length > 0) {
        localStorage.setItem('usersList', JSON.stringify(users));
    }
    renderUsers();
}

const renderUsers = () => {
    userList.innerHTML = "";
    if (users.length > 0) {
        users.forEach(item => {
            let newLi = document.createElement('li');
            newLi.textContent = `Имя: ${item.firstName}, Фамилия: ${item.lastName}, зарегистрирован ${item.regDate}   `;
            let newDelBtn = document.createElement('button');
            newDelBtn.setAttribute('class', 'delete-button');
            newDelBtn.textContent = 'DEL';
            newDelBtn.addEventListener('click', delUser);
            newLi.insertAdjacentElement('beforeend', newDelBtn);
            userList.insertAdjacentElement('beforeend', newLi);
        });
    }
};

const btnConfig = () => {

    const inputEntry = () => {
        newRecord = prompt('Ведите нового пользователя')
        if (newRecord !== null) {
            newRecord = newRecord.trim().split(' ');
            if (newRecord.length !== 2) {
                alert('Имя и фамилия введены некорректно, повторите ввод!');
                inputEntry();
            }
            return newRecord;
        }

    }

    const inputAlias = () => {
        newAlias = prompt('Ведите логин:')
        if (newAlias !== null) {
            newAlias = newAlias.trim();
            if (newAlias === '' || newAlias.indexOf(' ') > -1) {
                alert('Неправильный логин, повторите ввод.')
                inputAlias();
            }
            return newAlias;
        }
    }

    const inputPassword = () => {
        newPassword = prompt('Ведите пароль')
        if (newPassword !== null) {
            newPassword = newPassword.trim();
            if (newPassword === '' || newPassword.indexOf(' ') > -1) {
                alert('Пароль состоит из одного слова. Повторите ввод.')
                inputPassword();
            }
            return newPassword;
        }
    }

    const regDateF = (date) => {
        const month = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        const h = date.getHours()
        m = date.getMinutes(),
            s = date.getSeconds(),
            y = date.getFullYear(),
            mo = date.getMonth(),
            day = date.getDate();

        return `${day} ${month[mo]} ${y}г., ${h<10? "0"+h:h }:${m<10?"0"+m:m}:${s<10?"0"+s:s}`;
    }

    const wrapInputEntry = () => {

        fio = inputEntry();
        if (fio) {
            alias = inputAlias();
            if (alias) {
                pwd = inputPassword();
                if (pwd) {
                    let newUser = {};
                    newUser.firstName = fio[0].slice(0, 1).toUpperCase() + fio[0].slice(1).toLowerCase();
                    newUser.lastName = fio[1].slice(0, 1).toUpperCase() + fio[1].slice(1).toLowerCase();;
                    newUser.login = alias;
                    newUser.password = pwd;
                    newUser.regDate = regDateF(new Date);
                    users.push(newUser);
                    if (users.length > 1) {
                        localStorage.removeItem('usersList');
                    }
                    localStorage.setItem('usersList', JSON.stringify(users));
                    renderUsers();
                }
            }
        }
    };

    function checkAuthorize(name, pass) {
        for (let i = 0; i < users.length; i++) {
            if ((name === users[i].login) && (pass === users[i].password)) {
                return users[i].firstName;
            }
        }
        return false;
    };

    const wrapAthorize = () => {
        alias = inputAlias();
        if (alias) {
            pwd = inputPassword();
            if (pwd) {
                currentUser = checkAuthorize(alias, pwd);
                if (!currentUser) {
                    alert("Пользователь с такими данными не найден!");
                    return;
                }
                userNameGreeting.textContent = currentUser;
            }
        }
    };

    btnNew.addEventListener('click', wrapInputEntry);
    btnAutorize.addEventListener('click', wrapAthorize);
};

const start = () => {
    usersFetch();
    renderUsers();
    btnConfig();
};

start();