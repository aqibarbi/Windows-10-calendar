const grid = document.getElementById('calendar-grid');
const monthYearLabel = document.getElementById('month-year');
let displayDate = new Date();

// 1. GENERATE CALENDAR ENGINE
function renderCalendar() {
    grid.innerHTML = "";
    
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    
    // Format Month Header (e.g., "March 2026")
    monthYearLabel.innerText = displayDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Logic to calculate days of target, previous, and next months
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();
    const totalCellsNeeded = 42; // standard 6 rows * 7 days grid

    // Previous Month's padding days
    for (let x = firstDayIndex; x > 0; x--) {
        const dayNum = prevLastDay - x + 1;
        createDayElement(dayNum, 'other-month');
    }

    // Target Month's active days
    const today = new Date();
    for (let i = 1; i <= lastDay; i++) {
        const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        createDayElement(i, isToday ? 'today' : '');
    }

    // Next Month's trailing days to snap perfectly into grid structure
    const remainingCells = totalCellsNeeded - grid.children.length;
    for (let j = 1; j <= remainingCells; j++) {
        createDayElement(j, 'other-month');
    }

    attachRevealListeners();
}

// Helper to construct grid item elements safely
function createDayElement(num, className) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('day');
    if (className) dayEl.classList.add(className);
    dayEl.textContent = num;
    grid.appendChild(dayEl);
}

// 2. WINDOWS 10 FLUENT REVEAL ENGINE
function attachRevealListeners() {
    const days = document.querySelectorAll('.day');

    // GRID REVEAL
    grid.addEventListener('mousemove', (e) => {
        const rect = grid.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        grid.style.setProperty('--mouse-x', `${x}px`);
        grid.style.setProperty('--mouse-y', `${y}px`);
    });

    // RESET GRID GLOW
    grid.addEventListener('mouseleave', () => {
        grid.style.setProperty('--mouse-x', `-200px`);
        grid.style.setProperty('--mouse-y', `-200px`);
    });

    // DAY CELLS
    days.forEach(day => {

        day.addEventListener('mousemove', (e) => {
            const rect = day.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            day.style.setProperty('--item-x', `${x}px`);
            day.style.setProperty('--item-y', `${y}px`);
        });

        // RESET CELL GLOW
        day.addEventListener('mouseleave', () => {
            day.style.setProperty('--item-x', `-100px`);
            day.style.setProperty('--item-y', `-100px`);
        });

    });
}

// 3. NAVIGATION CONTROLS
document.getElementById('prev').onclick = () => {
    displayDate.setMonth(displayDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById('next').onclick = () => {
    displayDate.setMonth(displayDate.getMonth() + 1);
    renderCalendar();
};

// Initialize App on load
renderCalendar();
