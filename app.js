let taskArr = [];
let isEditMode = false;
let editIdx = null;
let taskInput = document.getElementById("taskInput");
let taskAddBtn = document.getElementById("taskAddBtn");
let addForm = document.querySelector("form");

window.addEventListener("load", () => {
    if (localStorage.length != 0) {
        taskArr = JSON.parse(localStorage.getItem("task"))
        updateToDo();
    }
})
window.addEventListener("storage", () => {
    new Promise((resolve, reject) => {
        let ab = confirm("New Task Added site will reload after 5s automatically");
        if (ab) {
            resolve();
        } else { reject("We do not reload automatically") }
    }).then(() => {
        setTimeout(() => {
            location.reload();
        }, 5000)
    }).catch((err) => {
        console.log(err);
    })

})

function updateStat() {
    taskArr.forEach((ele, idx) => {
        if (ele.completed) {
            document.getElementsByClassName("list")[idx].setAttribute("style", "border-color: #00ff7f;")
        } else {
            document.getElementsByClassName("list")[idx].removeAttribute("style")

        }
    })
    let completeTask = taskArr.filter((ele) => {
        return ele.completed == true
    }).length
    let totalTask = taskArr.length;
    let percentTaskComplete = completeTask / totalTask * 100;
    document.getElementById("progress").style.width = `${percentTaskComplete}%`;
    document.getElementById("counter").innerText = `${completeTask}/${totalTask}`
    if (taskArr.lenght != 0 && completeTask == totalTask) {

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });

        fire(0.2, {
            spread: 60,
        });

        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2,
        });

        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }
}

function timeStamp() {
    let date = new Date()
    let hours = date.getHours() % 12;
    let minutes = (date.getMinutes() >= 10) ? date.getMinutes() : 0 + "" + date.getMinutes();
    let ampm = (date.getHours() >= 12) ? "PM" : "AM"
    let timeStamp = `${(hours>=10)? "":"0"}${hours}:${minutes} ${ampm}`
    return timeStamp
}

addForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (isEditMode) {
        taskArr[editIdx].task = taskInput.value;
        taskArr[editIdx].timeStamp = timeStamp();
        updateToDo();
        isEditMode = false;
        editIdx = null
        taskAddBtn.innerHTML = `<i class="icon ri-add-large-fill"></i>`
    }
    else {
        addTask();
    }
    taskInput.value = "";
})

let addTask = () => {
    let taskText = taskInput.value.trim();
    if (taskText) {
        taskArr.push({ task: taskText, completed: false, timeStamp: timeStamp() });
    }
    updateToDo()
}

let updateToDo = () => {
    let main = document.querySelector("main");
    main.innerHTML = "";
    let arrLength = taskArr.length
    for (let i = 0; i < arrLength; i++) {
        main.innerHTML +=
            `
                <div class="list">
                    <div class="list-detail">
                        <input type="checkbox" name="checkbox" class="check" onChange="toggleTaskComplete(${i})" ${(taskArr[i].completed) ? "checked" : ""}>
                        <div class="list-title">${taskArr[i].task}</div>
                        <div class="time-stamp"><i class="icon ri-time-line"></i>${taskArr[i].timeStamp}<div class="done">[completed]</div>
                        </div>
                    </div>
                    <div class="list-btn">
                        <button type="button" onclick="editTask(${i})" class="edit-btn"><i class="icon ri-edit-box-line"></i></button>
                        <button type="button" onclick="deleteTask(${i})" class="del-btn"><i class="icon ri-delete-bin-line"></i></button>
                    </div>
                </div>
            `
    }
    updateStat()
    localStorage.setItem("task", JSON.stringify(taskArr))
};

let deleteTask = (idx) => {
    taskArr.splice(idx, 1);
    updateToDo();
};

let toggleTaskComplete = (idx) => {
    taskArr[idx].completed = !taskArr[idx].completed;
    localStorage.setItem("task", JSON.stringify(taskArr))
    updateStat();
}

let editTask = (idx) => {
    isEditMode = true;
    editIdx = idx;
    taskInput.value = taskArr[idx].task;
    taskAddBtn.innerHTML = `<i class="ri-pencil-fill"></i>`
}

const count = 200,
    defaults = {
        origin: { y: 0.7 },
    };

function fire(particleRatio, opts) {
    confetti(
        Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
        })
    );
}
