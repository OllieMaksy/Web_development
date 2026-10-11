const popup = document.getElementById('info-popup');

// Клік по картці викладача в Top Teachers відкриває попап
document.querySelectorAll('.teachers-grid .teacher-card').forEach(card => {
  card.addEventListener('click', () => {
    const d = card.dataset; // усі data-атрибути картки

    // Підставляємо дані в попап
    document.getElementById('info-name').textContent = d.name;
    document.getElementById('info-subject').textContent = d.subject;
    document.getElementById('info-location').textContent = d.location;
    document.getElementById('info-agesex').textContent = d.agesex;
    document.getElementById('info-email').textContent = d.email;
    document.getElementById('info-email').href = 'mailto:' + d.email;
    document.getElementById('info-phone').textContent = d.phone;
    document.getElementById('info-note').textContent = d.note;
    document.getElementById('info-photo').src = d.photo || '';

    popup.showModal(); // відкриває по центру екрана
  });
});

// Закриття хрестиком
popup.querySelector('.popup__close').addEventListener('click', () => popup.close());

// Закриття кліком по затемненому фону
popup.addEventListener('click', e => {
  if (e.target === popup) popup.close();
});

const addPopup = document.getElementById('add-popup');
const addForm = document.getElementById('add-form');



// Обидві кнопки "Add teacher" (у шапці й у футері) відкривають форму
document.querySelectorAll('.nav .add_btn').forEach(btn => {
  btn.addEventListener('click', () => addPopup.showModal());
});

// Закриття хрестиком
addPopup.querySelector('.popup__close').addEventListener('click', () => addPopup.close());

// Закриття кліком по затемненому фону
addPopup.addEventListener('click', e => {
  if (e.target === addPopup) addPopup.close();
});

// Відправка форми
addForm.addEventListener('submit', e => {
  e.preventDefault();               // не перезавантажуємо сторінку
  const data = Object.fromEntries(new FormData(addForm)); // усі поля одним об'єктом
  console.log(data);                // поки просто виводимо в консоль
  addForm.reset();                  // очищаємо форму
  addPopup.close();
});