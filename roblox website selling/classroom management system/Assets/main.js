document.addEventListener('DOMContentLoaded', function () {
    // Instructor List Table Logic (for instructor list.html)
    const attendanceTable = document.getElementById('attendanceTable');
    if (attendanceTable) {
        const tbody = attendanceTable.querySelector('tbody');
        tbody.innerHTML = '';
        // Use the same storage as attendanceForm submissions
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.forEach(student => {
            // Only show entries with a name and timeIn
            if (student.instructor && student.timeIn) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${student.instructor}</td>
                    <td>${student.timeIn}</td>
                    <td>${student.timeOut || ''}</td>
                `;
                tbody.appendChild(tr);
            }
        });
    }
    // Report Table Logic (for report.html)
    const reportTable = document.querySelector('table');
    if (reportTable && document.title.includes('Report')) {
        // Remove old rows except header
        while (reportTable.rows.length > 1) reportTable.deleteRow(1);
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let students = JSON.parse(localStorage.getItem('students')) || [];
        users.forEach(user => {
            // Find all attendance records for this instructor
            const records = students.filter(s => s.instructor === user.username);
            let reports = records.map(r => `Time In: ${r.timeIn || '-'}, Time Out: ${r.timeOut || '-'}`).join('<br>');
            if (!reports) reports = '-';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.username}</td>
                <td>${user.username}</td>
                <td>${user.password}</td>
                <td>${reports}</td>
            `;
            reportTable.appendChild(tr);
        });
    }
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const instructor = document.getElementById('signup-username').value.trim();
            const password = document.getElementById('signup-password').value.trim();
            const confirm = document.getElementById('signup-confirm').value.trim();
            const messageDiv = document.getElementById('signUpMessage');
            if (!instructor || !password || !confirm) {
                messageDiv.textContent = 'All fields are required.';
                messageDiv.style.color = '#d32f2f';
                return;
            }
            if (password !== confirm) {
                messageDiv.textContent = 'Passwords do not match.';
                messageDiv.style.color = '#d32f2f';
                return;
            }
            // Save user to localStorage (simple demo, not secure for real apps)
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(u => u.username === instructor)) {
                messageDiv.textContent = 'Username already exists.';
                messageDiv.style.color = '#d32f2f';
                return;
            }
            users.push({ username: instructor, password });
            localStorage.setItem('users', JSON.stringify(users));
            messageDiv.textContent = 'Sign up successful! Redirecting to sign in...';
            messageDiv.style.color = '#388e3c';
            setTimeout(() => window.location.href = 'sign_in.html', 1200);
        });
    }
    // Attendance Form Logic (for main.html)
    const timeInBtn = document.getElementById('timeInBtn');
    const timeOutBtn = document.getElementById('timeOutBtn');
    if (timeInBtn) {
        timeInBtn.addEventListener('click', function() {
            const instructorName = document.getElementById('instructorName').value.trim();
            const timeIn = document.getElementById('timeIn').value;
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (!users.find(u => u.username === instructorName)) {
                alert('Only registered instructors can submit attendance. Please sign up or sign in.');
                return;
            }
            if (!timeIn) {
                alert('Please enter your Time In.');
                return;
            }
            // Enforce morning time in between 07:00 and 11:00
            const [hour, minute] = timeIn.split(":").map(Number);
            if (hour < 7 || (hour > 11 && hour < 13) || hour > 17) {
                alert('Time In must be between 07:00-11:00 (morning) or 13:00-17:00 (afternoon).');
                return;
            }
            // Save time in only (no time out yet)
            let students = JSON.parse(localStorage.getItem('students')) || [];
            students.push({ instructor: instructorName, timeIn, timeOut: '' });
            localStorage.setItem('students', JSON.stringify(students));
            alert('Time In recorded! You will now be signed out.');
            localStorage.removeItem('signedInUser');
            const instructorNameInput = document.getElementById('instructorName');
            if (instructorNameInput) {
                instructorNameInput.value = '';
                instructorNameInput.readOnly = false;
            }
            window.location.href = 'sign_in.html';
        });
    }
    if (timeOutBtn) {
        timeOutBtn.addEventListener('click', function() {
            const instructorName = document.getElementById('instructorName').value.trim();
            const timeOut = document.getElementById('timeOut').value;
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (!users.find(u => u.username === instructorName)) {
                alert('Only registered instructors can submit attendance. Please sign up or sign in.');
                return;
            }
            if (!timeOut) {
                alert('Please enter your Time Out.');
                return;
            }
            // Enforce sign out at 12:00 or 17:00 only
            if (timeOut !== '12:00' && timeOut !== '17:00') {
                alert('Time Out must be 12:00 (noon) or 17:00 (afternoon).');
                return;
            }
            // Find the latest time in record for this instructor without a timeOut
            let students = JSON.parse(localStorage.getItem('students')) || [];
            for (let i = students.length - 1; i >= 0; i--) {
                if (students[i].instructor === instructorName && !students[i].timeOut) {
                    students[i].timeOut = timeOut;
                    break;
                }
            }
            localStorage.setItem('students', JSON.stringify(students));
            alert('Time Out recorded! You will now be signed out.');
            localStorage.removeItem('signedInUser');
            const instructorNameInput = document.getElementById('instructorName');
            if (instructorNameInput) {
                instructorNameInput.value = '';
                instructorNameInput.readOnly = false;
            }
            window.location.href = 'sign_in.html';
        });
    }
    // Store signed-in user in localStorage (for session)
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const messageDiv = document.getElementById('signInMessage');
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                // Save signed-in user for session
                localStorage.setItem('signedInUser', JSON.stringify(user));
                messageDiv.textContent = 'Sign in successful!';
                messageDiv.style.color = '#388e3c';
                setTimeout(() => window.location.href = 'main.html', 1200);
            } else {
                messageDiv.textContent = 'Invalid username or password.';
                messageDiv.style.color = '#d32f2f';
            }
        });
    }

    // Pre-fill instructor name if signed in (for main.html)
    const instructorNameInput = document.getElementById('instructorName');
    if (instructorNameInput) {
        const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));
        if (signedInUser && signedInUser.username) {
            instructorNameInput.value = signedInUser.username;
            instructorNameInput.readOnly = true;
        }
    }
});

// Sign Out Logic (for sign_out.html)
window.handleSignOut = function(event) {
    // Clear session or authentication data here
    localStorage.removeItem('signedInUser');
    // Redirect handled by form action
};