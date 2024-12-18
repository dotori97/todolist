window.onload = function(){
    loadFromLocalStorage();
    document
        .getElementById("add-task-btn")
        .addEventListener("click", addTask);

}    
    //할 일 추가
    let tasks = [];

    function addTask() {
        const taskInput = document.getElementById("task-input").value;
        const dateInput = document.getElementById("date-input").value;
        const priorityInput = document.getElementById("priority-input").value;

        if(taskInput && dateInput){
            const newTask = {
                id: Date.now(),
                task: taskInput,
                date: dateInput,
                priority: priorityInput,
                completed: false,
            };

            tasks.push(newTask);
            saveToLocalStorage();    
            renderTasks();    
            clearInputs();        
        }
    }

    //input창 초기화
    function clearInputs(){
        document.getElementById("task-input").value="";
        document.getElementById("date-input").value="";
        document.getElementById("priority-input").value="";
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
                deleteButton.addEventListener("click", ()=> deleteTask(task.id));

                listItem.appendChild(checkbox);
                listItem.appendChild(taskText);
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
  
