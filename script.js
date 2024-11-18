let members = [];
const tasks = [];

// Initialize QR Code Reader
function onScanSuccess(decodedText) {
    alert(`QR Code Scanned: ${decodedText}`);
    
    // Add the member
    if (!members.includes(decodedText)) {
        members.push(decodedText);
        updateMemberList();
        document.getElementById('qr-section').style.display = 'none';
        document.getElementById('todo-section').style.display = 'block';
    } else {
        alert('Member already registered!');
    }
}

function onScanError(errorMessage) {
    console.error('QR Scan Error:', errorMessage);
}

// Start the QR Code Scanner
const qrCodeReader = new Html5Qrcode("qr-reader");
qrCodeReader.start(
    { facingMode: "environment" }, 
    {
        fps: 10,
        qrbox: 250
    },
    onScanSuccess,
    onScanError
).catch((err) => console.error("QR Code Initialization Error:", err));

// Update Member List
function updateMemberList() {
    const memberList = document.getElementById('member-list');
    memberList.innerHTML = '';

    members.forEach((member) => {
        const listItem = document.createElement('li');

        const greenDot = document.createElement('span');
        greenDot.classList.add('green-dot');

        const memberName = document.createElement('span');
        memberName.textContent = member;
        memberName.classList.add('member-name');

        listItem.appendChild(greenDot);
        listItem.appendChild(memberName);

        memberList.appendChild(listItem);
    });
}

// To-Do Logic
document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        tasks.push({ task: taskText, status: 'Incomplete' });

        const taskList = document.getElementById('task-list');
        const listItem = document.createElement('li');
        listItem.textContent = taskText;

        // "Complete" Badge
        const completeBadge = document.createElement('span');
        completeBadge.textContent = 'Complete';
        completeBadge.classList.add('badge');
        completeBadge.style.display = 'none';

        // Mark as complete button
        const markCompleteBtn = document.createElement('button');
        markCompleteBtn.textContent = 'Mark Complete';
        markCompleteBtn.addEventListener('click', () => {
            completeBadge.style.display = 'inline';
            updateTaskStatus(taskText);
        });

        listItem.appendChild(completeBadge);
        listItem.appendChild(markCompleteBtn);
        taskList.appendChild(listItem);

        taskInput.value = '';
    }
});

function updateTaskStatus(taskText) {
    const task = tasks.find((t) => t.task === taskText);
    if (task) task.status = 'Complete';
}

// Download Excel File
document.getElementById('download-excel-btn').addEventListener('click', () => {
    const workbook = XLSX.utils.book_new();

    // Add members to the sheet
    const memberData = members.map((member) => ({ Member: member }));
    const memberSheet = XLSX.utils.json_to_sheet(memberData);
    XLSX.utils.book_append_sheet(workbook, memberSheet, 'Members');

    // Add tasks to the sheet
    const taskData = tasks.map((task) => ({
        Task: task.task,
        Status: task.status,
    }));
    const taskSheet = XLSX.utils.json_to_sheet(taskData);
    XLSX.utils.book_append_sheet(workbook, taskSheet, 'Tasks');

    // Download the file
    XLSX.writeFile(workbook, 'Singur_Film_Festival_Data.xlsx');
});
