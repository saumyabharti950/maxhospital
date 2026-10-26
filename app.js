// Homepage interactions. Appointment submission will connect to the Laravel API in the backend phase.
document.getElementById('year').textContent = new Date().getFullYear();

const dateField = document.getElementById('preferredDate');
dateField.min = new Date().toISOString().slice(0, 10);

const form = document.getElementById('appointmentForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  event.stopPropagation();
  form.classList.add('was-validated');
  status.textContent = '';
  status.className = 'form-status';

  const mobile = document.getElementById('mobile');
  mobile.setCustomValidity(/^[0-9+() -]{8,16}$/.test(mobile.value.trim()) ? '' : 'Enter a valid mobile number.');

  if (!form.checkValidity()) {
    status.textContent = 'Please check the required fields and try again.';
    status.classList.add('error');
    form.querySelector(':invalid')?.focus();
    return;
  }

  // No live booking endpoint exists yet. Keep this as a clear demo state instead of implying a request was sent.
  status.textContent = 'Form looks good. Appointment requests will be enabled when the hospital contact and booking endpoint are configured.';
  status.classList.add('success');
});

const search = document.getElementById('careSearch');
search.addEventListener('input', () => {
  const term = search.value.trim().toLowerCase();
  document.querySelectorAll('.specialty-item').forEach((card) => {
    card.hidden = term !== '' && !`${card.dataset.search} ${card.innerText}`.toLowerCase().includes(term);
  });
});

document.getElementById('finderButton').addEventListener('click', (event) => {
  event.preventDefault();
  const query = search.value.trim().toLowerCase();
  const department = document.getElementById('department');
  const match = [...department.options].find((option) => option.value && option.text.toLowerCase() === query);
  if (match) department.value = match.value;
  document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });
  if (!match && query) {
    document.getElementById('department').focus({ preventScroll: true });
  }
});
