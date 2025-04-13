// Calendario para formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del calendario
    const calendarContainer = document.getElementById('calendarContainer');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthDisplay = document.querySelector('.current-month');
    const calendarDaysContainer = document.querySelector('.calendar-days');
    const timeSlotsContainer = document.querySelector('.time-slots');
    const selectedDateSpan = document.getElementById('selectedDate');
    const selectedTimeSpan = document.getElementById('selectedTime');
    const selectedDatetimeInput = document.getElementById('selectedDatetime');
    const hideDateTime = document.getElementById('hideDateTime');
    
    // Variables del calendario
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectedDate = null;
    let selectedTime = null;
    
    // Nombres de meses
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // Franjas horarias disponibles
    const timeSlots = ['10:00', '11:00', '12:00', '16:00', '17:00', '18:00'];
    
    // Inicializar calendario
    function initCalendar() {
        if (!calendarContainer) return;
        
        updateCalendarHeader();
        generateCalendarDays();
        
        // Event listeners
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', function() {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                updateCalendarHeader();
                generateCalendarDays();
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', function() {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                updateCalendarHeader();
                generateCalendarDays();
            });
        }
        
        if (hideDateTime) {
            hideDateTime.addEventListener('change', function() {
                if (this.checked) {
                    calendarContainer.classList.add('hidden-calendar');
                    selectedDate = null;
                    selectedTime = null;
                    updateSelectedDateTime();
                } else {
                    calendarContainer.classList.remove('hidden-calendar');
                }
            });
        }
    }
    
    // Actualizar el encabezado del calendario
    function updateCalendarHeader() {
        if (currentMonthDisplay) {
            currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }
    }
    
    // Generar los días del calendario
    function generateCalendarDays() {
        if (!calendarDaysContainer) return;
        
        calendarDaysContainer.innerHTML = '';
        
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Ajustar firstDayOfMonth (en España lunes es el primer día de la semana)
        const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        
        // Días del mes anterior
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarDaysContainer.appendChild(emptyDay);
        }
        
        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            
            const dayDate = new Date(currentYear, currentMonth, day);
            
            // Desactivar días pasados y fin de semana
            const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
            const isPastDay = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            if (isWeekend || isPastDay) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', function() {
                    // Eliminar selección anterior
                    document.querySelectorAll('.day.selected').forEach(el => {
                        el.classList.remove('selected');
                    });
                    
                    // Seleccionar día actual
                    this.classList.add('selected');
                    
                    // Guardar fecha seleccionada
                    selectedDate = new Date(currentYear, currentMonth, day);
                    
                    // Actualizar franjas horarias
                    generateTimeSlots();
                    
                    // Actualizar visualización de fecha/hora seleccionada
                    updateSelectedDateTime();
                });
            }
            
            calendarDaysContainer.appendChild(dayElement);
        }
    }
    
    // Generar franjas horarias
    function generateTimeSlots() {
        if (!timeSlotsContainer) return;
        
        timeSlotsContainer.innerHTML = '';
        
        timeSlots.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            
            timeSlot.addEventListener('click', function() {
                // Eliminar selección anterior
                document.querySelectorAll('.time-slot.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Seleccionar franja actual
                this.classList.add('selected');
                
                // Guardar hora seleccionada
                selectedTime = time;
                
                // Actualizar visualización de fecha/hora seleccionada
                updateSelectedDateTime();
            });
            
            timeSlotsContainer.appendChild(timeSlot);
        });
    }
    
    // Actualizar visualización de fecha/hora seleccionada
    function updateSelectedDateTime() {
        if (selectedDateSpan && selectedTimeSpan && selectedDatetimeInput) {
            if (selectedDate) {
                const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
                selectedDateSpan.textContent = formattedDate;
            } else {
                selectedDateSpan.textContent = 'Ninguna';
            }
            
            if (selectedTime) {
                selectedTimeSpan.textContent = selectedTime;
            } else {
                selectedTimeSpan.textContent = 'Ninguna';
            }
            
            // Actualizar campo oculto para enviar con el formulario
            if (selectedDate && selectedTime) {
                const formattedDateTime = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()} ${selectedTime}`;
                selectedDatetimeInput.value = formattedDateTime;
            } else if (hideDateTime && hideDateTime.checked) {
                selectedDatetimeInput.value = 'Cualquier momento';
            } else {
                selectedDatetimeInput.value = '';
            }
        }
    }
    
    // Inicializar el calendario
    initCalendar();
});
