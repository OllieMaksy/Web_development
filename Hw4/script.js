const popup = document.getElementById('info-popup');
const teachersGrid = document.getElementById('teachers-grid');
const favoritesTrack = document.getElementById('favorites-track');
const favPrevBtn = document.getElementById('fav-prev');
const favNextBtn = document.getElementById('fav-next');

let currentTeacher = null;
let favStart = 0;
const FAV_PER_PAGE = 5;
let searchQuery = '';

function getInitials(fullName) {
  if (!fullName) return '';
  return fullName
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('');
}

async function fetchUsers() {
  console.log('Починаємо запит');

  try {
    const response = await fetch(
      'https://randomuser.me/api/?results=50&page=1'
    );

    console.log('Відповідь:', response);

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    users = formatUsers(data.results, []);
    nextUserId = users.length + 1;

    try{
      const dbResponse = await fetch('http://localhost:3000/teachers');

      if(!dbResponse.ok){
        throw new Error('Failed to fetch saved teachers');
      }
      const savedTeachers = await dbResponse.json();

      savedTeachers.forEach(teacher => {
        if(!users.some(user => user.email === teacher.email)){
          users.push(teacher);
        }
      });
    }catch (error){
      console.error('Помилка завантаження з бази:', error)
    }

    fillCountryOptions();
    renderAll();

  } catch (error) {
    console.error('Помилка:', error);
  }
}

//для завд 4
let nextPage = 6;
let nextUserId = 1;

async function loadMoreUsers() {
  loadMoreBtn.disabled = true;
  try{
    const response = await fetch(
      'https://randomuser.me/api/?results=10&page=' + nextPage
    );

    if (!response.ok){
      throw new Error('Failed to fetch more users');
    }

    const data = await response.json();

    const newUsers = formatUsers(data.results, []);
    console.log('Нові користувачі:', newUsers); 

    newUsers.forEach(user => {
      user.id = nextUserId;
      nextUserId++;
      users.push(user);
    });
    nextPage++;

    fillCountryOptions();
    renderAll();
  }catch(error){
    console.error('Помилка завантаження:', error);
  }finally {
    loadMoreBtn.disabled = false;
  }
}

const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', loadMoreUsers);
}




function createCardElement(teacher) {
  const card = document.createElement('article');
  card.className = 'teacher-card';
  card.dataset.id = teacher.id;

  const avatarBox = document.createElement('div');
  avatarBox.className = 'teacher-card__avatar-box';

  if (teacher.favorite) {
    const star = document.createElement('span');
    star.className = 'teacher-card__star';
    star.innerHTML = '&#9733;';
    avatarBox.appendChild(star);
  }

  if (teacher.picture_large) {
    const img = document.createElement('img');
    img.className = 'teacher-card__img';
    img.src = teacher.picture_large;
    img.alt = teacher.full_name;
    avatarBox.appendChild(img);
  } else {
    avatarBox.style.backgroundColor = teacher.bg_color || '#ffcccc';
    const initialsSpan = document.createElement('span');
    initialsSpan.className = 'teacher-card__initials';
    initialsSpan.textContent = getInitials(teacher.full_name);
    avatarBox.appendChild(initialsSpan);
  }

  card.appendChild(avatarBox);

  const name = document.createElement('h3');
  name.className = 'teacher-card__name';
  name.textContent = teacher.full_name;
  card.appendChild(name);

  const subject = document.createElement('p');
  subject.className = 'teacher-card__subject';
  subject.textContent = teacher.course;
  card.appendChild(subject);

  const country = document.createElement('p');
  country.className = 'teacher-card__country';
  country.textContent = teacher.country;
  card.appendChild(country);

  return card;
}


const filterForm = document.querySelector('.filters');

function ageFits(age, range) {
  if (range === 'all' || !range) return true;
  if (range === '18-31') return age >= 18 && age <= 31;
  if (range === '32-40') return age >= 32 && age <= 40;
  if (range === '41-50') return age >= 41 && age <= 50;
  if (range === '51+') return age >= 51;
  return true;
}

function getFilteredAndSearchedTeachers() {
  if (typeof users === 'undefined') return [];

  const age = filterForm && filterForm.elements.age ? filterForm.elements.age.value : 'all';
  const countryField = filterForm ? (filterForm.elements.country || filterForm.elements.region) : null;
  const country = countryField ? countryField.value : 'all';
  const sex = filterForm && filterForm.elements.sex ? filterForm.elements.sex.value : 'all';
  const onlyWithPhoto = filterForm && filterForm.elements.with_photo ? filterForm.elements.with_photo.checked : false;
  const onlyFavorites = filterForm && filterForm.elements.favorites ? filterForm.elements.favorites.checked : false;

  const query = searchQuery.trim().toLowerCase();

  return users.filter(teacher => {
    if (age !== 'all' && !ageFits(teacher.age, age)) return false;
    if (country !== 'all' && country !== 'All' && teacher.country !== country) return false;
    if (sex !== 'all' && sex !== 'All') {
      if (!teacher.gender || teacher.gender.toLowerCase() !== sex.toLowerCase()) {
        return false;
      }
    }
    if (onlyWithPhoto && !teacher.picture_large) return false;
    if (onlyFavorites && !teacher.favorite) return false;

    if (query !== '') {
      const nameMatch = teacher.full_name && teacher.full_name.toLowerCase().includes(query);
      const noteMatch = teacher.note && teacher.note.toLowerCase().includes(query);
      const ageMatch = teacher.age !== undefined && String(teacher.age).includes(query);

      if (!nameMatch && !noteMatch && !ageMatch) return false;
    }

    return true;
  });
}

function fillCountryOptions() {
  const select = filterForm ? (filterForm.elements.country || filterForm.elements.region) : null;
  if (!select || typeof users === 'undefined') return;

  select.innerHTML = '<option value="all">All</option>';

  const countries = [];
  for (const teacher of users) {
    if (teacher.country && !countries.includes(teacher.country)) {
      countries.push(teacher.country);
    }
  }

  countries.sort();

  for (const country of countries) {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    select.append(option);
  }
}

// Пошук
const searchInput = document.querySelector('.search_input');
const searchBtn = document.querySelector('.search_btn');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    renderTeachers();
    renderStatistics();
  });
}

if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', () => {
    searchQuery = searchInput.value;
    renderTeachers();
    renderStatistics();
  });
}


function renderTeachers() {
  if (!teachersGrid) return;

  const displayList = getFilteredAndSearchedTeachers();

  if (displayList.length === 0) {
    const emptyNotice = document.createElement('p');
    emptyNotice.textContent = 'No teachers found';
    teachersGrid.replaceChildren(emptyNotice);
    return;
  }

  const cardElements = displayList.map(createCardElement);
  teachersGrid.replaceChildren(...cardElements);
}

function renderFavorites() {
  if (!favoritesTrack || typeof users === 'undefined') return;

  const favorites = users.filter(user => user.favorite);

  const maxStart = Math.max(0, favorites.length - FAV_PER_PAGE);
  favStart = Math.min(favStart, maxStart);

  const visible = favorites.slice(favStart, favStart + FAV_PER_PAGE);

  if (visible.length > 0) {
    const favoriteCards = visible.map(createCardElement);
    favoritesTrack.replaceChildren(...favoriteCards);
  } else {
    const emptyNotice = document.createElement('p');
    emptyNotice.textContent = 'No favorites yet';
    favoritesTrack.replaceChildren(emptyNotice);
  }

  if (favPrevBtn) favPrevBtn.disabled = favStart === 0;
  if (favNextBtn) favNextBtn.disabled = favStart >= maxStart;
}


const statsTbody = document.getElementById('stats-tbody');
const statsHeaders = document.querySelectorAll('#statistics th[data-sort]');

let currentSortField = null;
let currentSortDirection = 'asc';

function createTableRow(teacher) {
  const tr = document.createElement('tr');

  const tdName = document.createElement('td');
  tdName.textContent = teacher.full_name;
  tr.appendChild(tdName);

  const tdCourse = document.createElement('td');
  tdCourse.textContent = teacher.course;
  tr.appendChild(tdCourse);

  const tdAge = document.createElement('td');
  tdAge.textContent = teacher.age;
  tr.appendChild(tdAge);

  const tdGender = document.createElement('td');
  tdGender.textContent = teacher.gender;
  tr.appendChild(tdGender);

  const tdCountry = document.createElement('td');
  tdCountry.textContent = teacher.country;
  tr.appendChild(tdCountry);

  return tr;
}

function renderStatistics() {
  if (!statsTbody || typeof users === 'undefined') return;

  //для зміни статистики в залежності від пошуку
  let teachersToDisplay = getFilteredAndSearchedTeachers();
  if (currentSortField && typeof sortUsers === 'function') {
    //сортуємо вже відфільтрований масив, а не юзерів
    teachersToDisplay = sortUsers(teachersToDisplay, currentSortField, currentSortDirection);
  }

  const rows = teachersToDisplay.map(createTableRow);
  statsTbody.replaceChildren(...rows);
}

if (statsHeaders.length > 0) {
  statsHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;

      if (currentSortField === field) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortField = field;
        currentSortDirection = 'asc';
      }

      statsHeaders.forEach(header => {
        const baseText = header.textContent.replace(/[ ⬍▲▼]/g, '');
        if (header === th) {
          header.textContent = `${baseText} ${currentSortDirection === 'asc' ? '▲' : '▼'}`;
        } else {
          header.textContent = `${baseText} ⬍`;
        }
      });

      renderStatistics();
    });
  });
}

function renderAll() {
  renderTeachers();
  renderFavorites();
  renderStatistics();
}


function updatePopupStar() {
  if (!popup || !currentTeacher) return;
  const starBtn = popup.querySelector('.popup__star');
  if (starBtn) {
    starBtn.innerHTML = currentTeacher.favorite ? '&#9733;' : '&#9734;';
  }
}

function openPopup(teacher) {
  if (!popup || !teacher) return;
  currentTeacher = teacher;

  const nameEl = document.getElementById('info-name');
  if (nameEl) nameEl.textContent = teacher.full_name;

  const subjectEl = document.getElementById('info-subject');
  if (subjectEl) subjectEl.textContent = teacher.course;

  const locEl = document.getElementById('info-location');
  if (locEl) locEl.textContent = `${teacher.city}, ${teacher.country}`;

  const ageSexEl = document.getElementById('info-agesex');
  if (ageSexEl) ageSexEl.textContent = `${teacher.age}, ${teacher.gender}`;

  const emailEl = document.getElementById('info-email');
  if (emailEl) {
    emailEl.textContent = teacher.email;
    emailEl.href = 'mailto:' + teacher.email;
  }

  const phoneEl = document.getElementById('info-phone');
  if (phoneEl) phoneEl.textContent = teacher.phone;

  const noteEl = document.getElementById('info-note');
  if (noteEl) noteEl.textContent = teacher.note || 'No note available';

  const photo = document.getElementById('info-photo');
  if (photo) {
    photo.src = teacher.picture_large || '';
    photo.hidden = !teacher.picture_large;
  }

  updatePopupStar();
  popup.showModal();
}

if (popup) {
  const starBtn = popup.querySelector('.popup__star');
  if (starBtn) {
    starBtn.addEventListener('click', () => {
      if (currentTeacher) {
        currentTeacher.favorite = !currentTeacher.favorite;
        updatePopupStar();
        renderAll();
      }
    });
  }

  const closeBtn = popup.querySelector('.popup__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => popup.close());
  }

  popup.addEventListener('click', e => {
    if (e.target === popup) popup.close();
  });
}

function handleCardClick(event) {
  const card = event.target.closest('.teacher-card');
  if (!card || typeof users === 'undefined') return;

  const teacher = users.find(user => user.id === Number(card.dataset.id));
  if (teacher) openPopup(teacher);
}

if (teachersGrid) teachersGrid.addEventListener('click', handleCardClick);
if (favoritesTrack) favoritesTrack.addEventListener('click', handleCardClick);

if (favPrevBtn) {
  favPrevBtn.addEventListener('click', () => {
    favStart -= 1;
    renderFavorites();
  });
}

if (favNextBtn) {
  favNextBtn.addEventListener('click', () => {
    favStart += 1;
    renderFavorites();
  });
}


const addPopup = document.getElementById('add-popup');
const addForm = document.getElementById('add-form');

document.querySelectorAll('.nav .add_btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (addPopup) addPopup.showModal();
  });
});

if (addPopup) {
  const addCloseBtn = addPopup.querySelector('.popup__close');
  if (addCloseBtn) {
    addCloseBtn.addEventListener('click', () => addPopup.close());
  }

  addPopup.addEventListener('click', e => {
    if (e.target === addPopup) addPopup.close();
  });
}
const API_URL = 'http://localhost:3000/teachers';
  
  async function saveTeacher(teacher) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(teacher)
    });

    if(!response.ok){
      throw new Error ('Server error');
    }
    return await response.json();
  }
  

if (addForm) {
  const formError = document.getElementById('form-error');
  addForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    // 1. Отримуємо дані з форми
    const formData = new FormData(addForm);
    const data = Object.fromEntries(formData);

    // 2. Розраховуємо вік
    let age = null;

    if (data.b_date) {
      const birthYear = new Date(data.b_date).getFullYear();
      const currentYear = new Date().getFullYear();
      age = currentYear - birthYear;
    }


    const newTeacher = {
      id: Date.now(),
      full_name: data.name,
      course: data.course,
      country: data.country,
      city: data.city,
      email: data.email,
      phone: data.phone,
      b_date: data.b_date,
      age: age,
      gender: makeFirstLetterBig(data.gender),
      note: data.note || '',
      favorite: false,
      picture_large: null,
      bg_color: '#ffcccc'
    };

    const errors = validateUser(newTeacher);

    if (errors.length > 0) {
      formError.textContent = 'Invalid fields: ' + errors.join(', ');
      formError.hidden = false;
      return;
    }
    formError.hidden = true;

    // 5. Надсилаємо на сервер
    try {
      await saveTeacher(newTeacher);
    } catch (error) {
      console.error('Could not save teacher:', error);
    }

    // 6. Оновлюємо сторінку
    users.unshift(newTeacher);
    fillCountryOptions();
    renderAll();

    addForm.reset();
    addPopup.close();
  });
}

if (filterForm) {
  filterForm.addEventListener('change', () => {
    renderTeachers();
    renderStatistics();
  });
  filterForm.addEventListener('submit', event => event.preventDefault());
}

fetchUsers();