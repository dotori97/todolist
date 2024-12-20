//전역 변수와 초기화
let tasks = [];
let isEditing = false;
let editingTaskId = null;

const quotes = [
    "시간은 채우는 것보다 비우는 게 더 중요하다",
    "자기 삶에서 단순함의 너른 빈터를 충분히 남겨두어야만 인간일 수 있다. -조지 오웰",
    "모든 사건은 한 가지 이상의 일을 하고 있다. -김미경",
    "보이는 것은 단면이지만 측면이 뒷면이 있다는 걸 잊지마라. -김미경",
    "감사에는 예언의 힘이 있다. -김미경",  
    "생산성은 더 많은 일을 해내는 게 아니라 올바른 일을 해내는 것",
    "당시에는 지긋지긋했지만 이제 그 기억은 내 마음이 뜯어먹기 좋아하는 좋은 풀밭이 되었다. -조지 오웰",
    "모방은 물듦이다. 진정한 모방의 힘은 충실하고 충실해서 마침내 그 모방을 뚫어내는 길 속에 있다. -은유",
    "다른 생활습관에 자신을 노출시키고, 인간 본성의 무한한 다양성을 구경하는 것보다 더 나은 삶의 학교를 모르겠다. -몽테뉴",
    "책을 읽는 것이 아니다. 행간에 머무르고 거주하는 것이다. -발터 벤야민",
    "첫 번째 판단은 버려라. 그것은 시대가 네 몸을 통해 판단한 것이다. -니체",
    "이제부터 인생이 무어냐고 묻거든 허튼 삶 삽질하는 힘이라고 말해둬 -고정희",
    "몸을 가진 것들은 걸린다. 걸려본 발이 길을 알리라. -이원",
    "관계란 기억의 교환이다 -황현산",
    "자신의 기억을 갖지 못하는 인간은 다른 사람의 기억 속으로 들어갈 수 없다. -황현산",
    "내가 오늘 하는 모든 것은 반드시 동시에 두 개가 탄생한다. 어느 시간대에 가면 만날 거다. 이게 양자역학 동시성 원리 -김미경",
    "꿈을 이루는 장소는 현재에요. 만나는 장소는 미래에요. -김미경"
];
//초기 로드 및 이벤트 리스너 설정
window.onload = function(){
    loadFromLocalStorage();
    displayRandomQuote();

    document
        .getElementById("add-task-btn")
        .addEventListener("click", addTask);

    document
        .getElementById("edit-task-btn")
        .addEventListener("click", toggleEditButtons);

    
    const aboutButton = document.getElementById("about-btn");
    const modal = document.getElementById("about-modal");
    const closeModal = document.getElementById("close-modal");
    const tooltipBtn = document.getElementById("tooltipBtn");
    const modalContent = document.getElementById("modal-content");
    
    aboutButton.addEventListener("click", function(){
        modalContent.innerHTML=`
            <h2>==Notice!==</h2>
            <p>해당 앱은 서버없이 동작하는<br> 
               정적 웹앱입니다.<br> 
               LocalStorage를 사용하여 사용자의<br> 
               브라우저에 데이터를 저장하는 방식입니다.<br> 
               데이터를 다른 사람과 공유하거나<br> 
               여러 기기에서 동기화는 불가능합니다.<br> 
               To Do List가 개인용이고 로컬 환경에만<br> 
               저장해도 괜찮을 때 사용하세요.<br><br> 
            </p>        
        `;
        modal.style.display = "block";
    })

    tooltipBtn.addEventListener("click", function(){
        modalContent.innerHTML=`
            <h3>== 배경색 설정 도움말 ==</h3>
            <p>color picker가 기본적으로 제시하는 색상이<br> 
            마음에 들지 않을 경우 맞춤설정을 이용하세요.<br> 
            다양한 색상과 만나실 수 있습니다.<br></p>
            <img src="./help.jpg" alt="color picker" style="width:100%; margin-top:10px;">
        `;
        modal.style.display = "block";
    })

    closeModal.addEventListener("click", function(){
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event){
        if(event.target === modal){
            modal.style.display="none";
        }
    });
};    

    function displayRandomQuote(){
        const randomIndex = Math.floor(Math.random() * quotes.length);
        document.getElementById("quote").innerText = quotes[randomIndex];
    }

    //할 일 추가 또는 수정    
    function addTask() {
        const taskInput = document.getElementById("task-input").value;
        const dateInput = document.getElementById("date-input").value;
        const priorityInput = document.getElementById("priority-input").value;
        const colorInput = document.getElementById("color-input").value;

        if (!taskInput || !dateInput) return;

        if(isEditing){
            //수정 상태일 때
            const task = tasks.find((task)=> task.id === editingTaskId);
            if(task){
                task.task = taskInput;
                task.date = dateInput;
                task.priority = priorityInput;
                task.color = colorInput;
            }
            isEditing = false;
            editingTaskId = null;
            document.getElementById("add-task-btn").textContent="추가";
        } else {
            //새로운 작업 추가
            const newTask = {
                id: Date.now(),
                task: taskInput,
                date: dateInput,
                priority: priorityInput,
                color: colorInput,
                completed: false,
            };
            tasks.push(newTask);
        }       
        
        saveToLocalStorage();    
        renderTasks();    
        clearInputs();        
    }

    //input창 초기화
    function clearInputs(){
        document.getElementById("task-input").value="";
        document.getElementById("date-input").value="";
        document.getElementById("priority-input").value="";
        document.getElementById("color-input").value = "#f9f9f9";
    }

    
    //추가된 task를 화면에 그리기
    function renderTasks(){
        const todolist = document.getElementById("todo-list");
        todolist.innerHTML = "";

        /*new Date()**를 사용해야 날짜 간 비교나 계산이 가능.
        단순히 Date(a.date)를 사용하면 반환값이 문자열이므로 sort나 산술 연산에서 제대로 동작하지 않음*/

        tasks
            .sort((a, b) => a.priority - b.priority || new Date(a.date) - new Date(b.date))
            .forEach((task) => {
                const listItem = document.createElement("li");
                listItem.style.backgroundColor = task.color || "#f9f9f9";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed;
                checkbox.classList.add("check"); 
                checkbox.addEventListener("change", () => toggleTask(task.id) );

                const taskText = document.createTextNode(
                    `[${task.priority}] ${task.task} (${task.date})`
                );

                // 완료된 작업에 취소선 추가
                if (task.completed) {
                    listItem.style.textDecoration = "line-through"; // 취소선 스타일
                }

                const deleteButton = document.createElement("button");
                deleteButton.textContent ="삭제";
                deleteButton.classList.add("delete-btn"); // 'delete-btn' 클래스 추가
                deleteButton.style.display = "none";
                deleteButton.addEventListener("click", ()=> deleteTask(task.id));

                const editButton = document.createElement("button");
                editButton.textContent = "수정";
                editButton.classList.add("edit-btn");
                editButton.style.display = "none";
                editButton.addEventListener("click", () => editTask(task.id));

                listItem.appendChild(checkbox);
                listItem.appendChild(taskText);
                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);

                todolist.appendChild(listItem);
            });      
    }

    //할 일 체크
    /*find: 배열에서 조건에 맞는 첫 번째 요소를 반환.
    여기서 조건은 task.id === id, 즉 작업 객체의 id 속성이 함수에 전달된 id와 같은지 확인.
    task.id: todoList 배열의 각 작업 객체에 있는 id 속성 값. 특정 작업을 고유하게 식별하는 역할.
    id: 함수 호출 시 전달된 값으로, 사용자가 상호작용한 작업을 식별하기 위해 사용.
    예를 들어, 사용자가 체크박스를 클릭했을 때, 그 체크박스와 연결된 작업의 id 값이 전달. */
    function toggleTask(id){
        const task = tasks.find((task)=> task.id===id);
        if(task){
            task.completed = !task.completed;
            saveToLocalStorage();
            renderTasks();
        }
    }


    //할 일 삭제
    function deleteTask(id){        
        const confirmation = confirm("정말 삭제하시겠습니까?");
        if(confirmation){
            tasks = tasks.filter((task) => task.id !== id)
            saveToLocalStorage();
            renderTasks();
        }
    }

    //수정 기능 
    function editTask(id){
        const task = tasks.find((task) => task.id === id);
        if(task){
            isEditing = true;
            editingTaskId = id; 

            document.getElementById("task-input").value = task.task;
            document.getElementById("date-input").value = task.date;
            document.getElementById("priority-input").value = task.priority;
            document.getElementById("add-task-btn").textContent="저장";

        }            
    }
    
    function toggleEditButtons(){
        const taskItems = document.querySelectorAll("li");

        taskItems.forEach((item) => {
            const editButton = item.querySelector(".edit-btn");
            const deleteButton = item.querySelector(".delete-btn");

            if(editButton.style.display === "none"){
                editButton.style.display = "inline-block";
                deleteButton.style.display = "inline-block";
            }else{
                editButton.style.display="none";
                deleteButton.style.display="none";
            }
        });
    }

    //storage에 task추가
    function saveToLocalStorage(){
        localStorage.setItem("tasks", JSON.stringify(tasks)); 
        //localStorage에 저장할 때는 문자열 형태로만 저장할 수 있기 때문에, 객체나 배열을 문자열로 변환
    } 

    function loadFromLocalStorage(){
        const savedTasks = localStorage.getItem("tasks");
        if(savedTasks){
            tasks = JSON.parse(savedTasks);
        //JSON.parse는 JSON 문자열을 다시 객체나 배열로 변환하는 메서드    
        //변환된 객체를 todoList 배열에 할당하여, 저장된 할 일 목록을 복원
        } else{
            tasks = [];
        }
        renderTasks();
    }

    
  
