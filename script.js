document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    setupEventListeners();
    renderMiniCalendar();
    renderUpcomingEvents();
});

// Estado global do calendário
const state = {
    currentDate: new Date(2025, 0, 1), // Começa em Janeiro de 2025
    selectedDate: new Date(2025, 0, 1),
    view: 'week', // 'day', 'week', 'month', 'year'
    events: {}
};

const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function initializeCalendar() {
    updateHeaderControls();
    renderWeekView();
    renderMiniCalendar();
}

function updateHeaderControls() {
    const headerLeft = document.querySelector('.header-left');
    headerLeft.innerHTML = `
        <div class="month-year-selector">
            <select id="monthSelect" class="month-select">
                ${monthNames.map((month, index) => 
                    `<option value="${index}" ${state.currentDate.getMonth() === index ? 'selected' : ''}>
                        ${month}
                    </option>`
                ).join('')}
            </select>
            <span class="year">2025</span>
        </div>
        <div class="navigation-buttons">
            <button class="nav-btn">&#8249;</button>
            <button class="today-btn">Hoje</button>
            <button class="nav-btn">&#8250;</button>
        </div>
    `;

    // Adicionar event listener para o select
    document.getElementById('monthSelect').addEventListener('change', (e) => {
        const newMonth = parseInt(e.target.value);
        changeMonth(newMonth);
    });
}

function changeMonth(monthIndex) {
    state.currentDate = new Date(2025, monthIndex, 1);
    initializeCalendar();
}

// Atualizar o CSS para estilizar o seletor de mês
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .month-year-selector {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .month-select {
        padding: 8px 16px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.8);
        color: #9b6b9d;
        font-size: 1.1em;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .month-select:hover {
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .year {
        font-size: 1.1em;
        font-weight: 500;
        color: #9b6b9d;
        padding: 8px;
        background: linear-gradient(135deg, #ffd5e5 0%, #ffe3e3 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
`;
document.head.appendChild(styleSheet);

function renderWeekView() {
    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';
    
    const weekDays = getWeekDays(state.currentDate);
    const weekDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    weekDays.forEach((date, index) => {
        const dayColumn = createDayColumn(date, weekDayNames[date.getDay()]);
        daysGrid.appendChild(dayColumn);
    });

    // Adicionar eventos da semana
    addEventsToWeek(weekDays);
}

function getWeekDays(date) {
    const days = [];
    const currentDay = date.getDay(); // 0-6
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - currentDay);
    
    for (let i = 0; i < 7; i++) {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        days.push(day);
    }
    
    return days;
}

function createDayColumn(date, dayName) {
    const column = document.createElement('div');
    column.className = 'day-column';
    
    const header = document.createElement('div');
    header.className = 'day-header';
    
    const isToday = isSameDate(date, new Date());
    if (isToday) {
        header.classList.add('today');
    }
    
    header.innerHTML = `
        <div class="day-name">${dayName}</div>
        <div class="day-number">${date.getDate()}</div>
    `;
    
    const timeSlots = document.createElement('div');
    timeSlots.className = 'time-slots';
    
    // Criar slots de tempo (6 AM - 2 PM)
    for(let i = 6; i <= 14; i++) {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.style.height = '60px';
        timeSlots.appendChild(slot);
    }
    
    column.appendChild(header);
    column.appendChild(timeSlots);
    return column;
}

function setupEventListeners() {
    // Navegação
    document.querySelector('.nav-btn:first-child').addEventListener('click', () => navigateWeek(-1));
    document.querySelector('.nav-btn:last-child').addEventListener('click', () => navigateWeek(1));
    document.querySelector('.today-btn').addEventListener('click', goToToday);
    
    // Botões de visualização
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.view-btn.active').classList.remove('active');
            btn.classList.add('active');
            state.view = btn.textContent.toLowerCase();
            updateView();
        });
    });
}

function navigateWeek(direction) {
    const newDate = new Date(state.currentDate);
    newDate.setDate(state.currentDate.getDate() + (direction * 7));
    
    // Garantir que permanecemos em 2025
    if (newDate.getFullYear() === 2025) {
        state.currentDate = newDate;
        initializeCalendar();
    }
}

function goToToday() {
    state.currentDate = new Date(2025, 0, 1); // Volta para 1º de Janeiro de 2025
    initializeCalendar();
}

function renderMiniCalendar() {
    const miniCalendar = document.getElementById('miniCalendarDays');
    miniCalendar.innerHTML = '';
    
    const year = 2025;
    const month = state.currentDate.getMonth();
    
    // Atualizar o título do mini calendário
    document.querySelector('.mini-calendar-header span').textContent = 
        `${monthNames[month]} 2025`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    
    // Adicionar dias vazios no início
    for(let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'mini-day empty';
        miniCalendar.appendChild(emptyDay);
    }
    
    // Adicionar dias do mês
    for(let i = 1; i <= lastDay.getDate(); i++) {
        const day = document.createElement('div');
        day.className = 'mini-day';
        day.textContent = i;
        
        const currentDate = new Date(year, month, i);
        if (isSameDate(currentDate, state.currentDate)) {
            day.classList.add('today');
        }
        
        day.addEventListener('click', () => {
            state.currentDate = new Date(year, month, i);
            initializeCalendar();
        });
        
        miniCalendar.appendChild(day);
    }
}

function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Adicionar alguns eventos de exemplo para demonstração
function addEventsToWeek(weekDays) {
    const sampleEvents = [
        {
            title: 'Reunião de Design com Devs',
            startTime: '6:00',
            duration: 120,
            dayOffset: 1,
            color: 'blue'
        },
        {
            title: 'Revisão do Calendário',
            startTime: '10:00',
            duration: 90,
            dayOffset: 2,
            color: 'green'
        },
        {
            title: 'Encontro com Equipe',
            startTime: '7:30',
            duration: 60,
            dayOffset: 3,
            color: 'orange'
        }
    ];
    
    sampleEvents.forEach(eventData => {
        const event = createEvent(
            eventData.title,
            eventData.startTime,
            eventData.duration,
            eventData.dayOffset,
            eventData.color
        );
        
        const dayColumn = document.querySelectorAll('.day-column')[eventData.dayOffset];
        if (dayColumn) {
            dayColumn.querySelector('.time-slots').appendChild(event);
        }
    });
}

function createEvent(title, startTime, duration, dayIndex, color) {
    const event = document.createElement('div');
    event.className = `event ${color}`;
    event.innerHTML = `
        <div class="event-title">${title}</div>
        <div class="event-platform">Reunião Online</div>
    `;
    
    // Calcular posição e altura do evento
    const [hours, minutes] = startTime.split(':').map(Number);
    const top = (hours - 6) * 60 + minutes;
    
    event.style.top = `${top}px`;
    event.style.height = `${duration}px`;
    
    return event;
}

function renderUpcomingEvents() {
    const eventsList = document.getElementById('upcomingEventsList');
    eventsList.innerHTML = '';
    
    const events = [
        {
            time: 'em 15 min',
            title: 'Revisão do Calendário',
            participants: 3
        },
        {
            time: 'Amanhã às 7:30',
            title: 'Encontro com Equipe',
            participants: 2
        }
    ];
    
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'upcoming-event';
        eventElement.innerHTML = `
            <div class="event-time">${event.time}</div>
            <div class="event-title">${event.title}</div>
        `;
        eventsList.appendChild(eventElement);
    });
}

// Atualizar os textos dos botões de visualização
document.querySelectorAll('.view-btn').forEach(btn => {
    const viewTexts = {
        'Day': 'Dia',
        'Week': 'Semana',
        'Month': 'Mês',
        'Year': 'Ano'
    };
    btn.textContent = viewTexts[btn.textContent] || btn.textContent;
});

// Atualizar o placeholder da pesquisa
document.querySelector('.search-box input').placeholder = 'Pesquisar';

// Atualizar o texto do botão compartilhar
document.querySelector('.share-btn').textContent = 'Compartilhar'; 