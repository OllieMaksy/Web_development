
  // Список предметів, з яких випадково вибираємо course
  var courses = [
    'Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing',
    'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'
  ];
  
  // Кілька кольорів, з яких випадково вибираємо bg_color
  var colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffffcc', '#ffccff', '#ccffff'];
  


  // Робить першу літеру великою
  function makeFirstLetterBig(text) {
    if (typeof text !== 'string' || text.length === 0) {
      return text; // це не рядок або він порожній: повертаємо як є
    }
    var first = text.charAt(0).toUpperCase(); // перша літера великою
    var rest = text.slice(1);                 // все інше без змін
    return first + rest;
  }
  
  // Повертає випадковий елемент масиву
  function getRandomItem(list) {
    var index = Math.floor(Math.random() * list.length);
    return list[index];
  }
  
  
  
  // ЗАВДАННЯ 1: привести дані до одного вигляду + додати поля + прибрати дублі
  
  // Беремо одного користувача в будь-якому форматі й повертаємо в єдиному
  function makeOneUser(user) {
    var result = {};
  
    if (user.name !== undefined) {
      result.gender = makeFirstLetterBig(user.gender);
      result.title = user.name.title;
      result.full_name = makeFirstLetterBig(user.name.first) + ' ' + makeFirstLetterBig(user.name.last);
      result.city = user.location.city;
      result.state = user.location.state;
      result.country = user.location.country;
      result.postcode = user.location.postcode;
      result.email = user.email;
      result.phone = user.phone;
      // dob і picture можуть бути відсутні, тому перевіряємо
      if (user.dob !== undefined) {
        result.b_date = user.dob.date;
        result.age = user.dob.age;
      }
      if (user.picture !== undefined) {
        result.picture_large = user.picture.large;
      }
    } else {
      result.gender = makeFirstLetterBig(user.gender);
      result.title = user.title;
      result.full_name = user.full_name;
      result.city = user.city;
      result.state = user.state;
      result.country = user.country;
      result.postcode = user.postcode;
      result.email = user.email;
      result.phone = user.phone;
      result.b_date = user.b_date;
      result.age = user.age;
      result.picture_large = user.picture_large;
    }
  
    return result;
  }
  
  // об'єднує два масиви
  function formatUsers(firstList, secondList) {
    var allRaw = firstList.concat(secondList); // склеюємо два масиви в один
    var result = [];                           // сюди складаємо готових користувачів
    var nextId = 1;                            // лічильник для id
  
    for (var i = 0; i < allRaw.length; i++) {
      var user = makeOneUser(allRaw[i]);
  
      // Перевіряємо, чи такий користувач (за email) вже є в result
      var isDuplicate = false;
      for (var j = 0; j < result.length; j++) {
        if (result[j].email === user.email) {
          isDuplicate = true;
        }
      }
      if (isDuplicate === true) {
        continue; // це дублікат: пропускаємо й беремо наступного
      }
  
      // Додаємо нові поля з правильними типами
      user.id = nextId;                          // число
      nextId = nextId + 1;
      user.favorite = Math.random() < 0.5;       // true або false (boolean)
      user.course = getRandomItem(courses);      // рядок зі списку
      user.bg_color = getRandomItem(colors);     // рядок з кольором
      user.note = '';                            // порожній рядок
  
      result.push(user); // додаємо в кінець результату
    }
  
    return result;
  }
  
  

  // ЗАВДАННЯ 2: валідація
  
  // Чи починається рядок з великої літери
  function startsWithBigLetter(text) {
    if (typeof text !== 'string' || text.length === 0) {
      return false; // не рядок або порожній
    }
    var first = text.charAt(0);
    // Якщо перша літера дорівнює своїй великій версії, то вона велика
    return first === first.toUpperCase() && first !== first.toLowerCase();
  }
  
  // Перевірка телефону. Формат залежить від країни.
  function isPhoneOk(phone, country) {
    if (typeof phone !== 'string') {
      return false;
    }
    if (country === 'Germany') {
      // Приклад: 12 символів, дефіс на п'ятому місці
      return phone.length === 12 && phone.charAt(4) === '-';
    }
    if (country === 'Ukraine') {
      // Приклад: 13 символів, починається з +380
      return phone.length === 13 && phone.indexOf('+380') === 0;
    }
    // Для інших країн: просто перевіряємо, що там лише цифри та символи + - ( ) пробіл
    var allowed = '0123456789+-() ';
    if (phone.length < 7) {
      return false;
    }
    for (var i = 0; i < phone.length; i++) {
      if (allowed.indexOf(phone.charAt(i)) === -1) {
        return false; // знайшли недозволений символ
      }
    }
    return true;
  }
  
  // Повертає список назв полів, які не пройшли перевірку. Порожній список = усе гаразд.
  function validateUser(user) {
    var errors = [];
  
    // Ці поля мають бути рядками з великої літери
    var textFields = ['full_name', 'gender', 'state', 'city', 'country'];
    for (var i = 0; i < textFields.length; i++) {
      var fieldName = textFields[i];
      if (startsWithBigLetter(user[fieldName]) === false) {
        errors.push(fieldName);
      }
    }
  
    // note: може бути порожнім, але якщо щось написано, то з великої літери
    if (user.note !== '' && startsWithBigLetter(user.note) === false) {
      errors.push('note');
    }
  
    // age має бути числом
    if (typeof user.age !== 'number') {
      errors.push('age');
    }
  
    // phone
    if (isPhoneOk(user.phone, user.country) === false) {
      errors.push('phone');
    }
  
    // email має містити @
    if (typeof user.email !== 'string' || user.email.indexOf('@') === -1) {
      errors.push('email');
    }
  
    return errors;
  }
  


  // ЗАВДАННЯ 3: фільтрація (усі умови одночасно, тобто "і")
  
  // Якщо якийсь параметр не потрібен, передайте undefined або null
  function filterUsers(users, country, age, gender, favorite) {
    var result = [];
  
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      var ok = true; // припускаємо, що користувач підходить
  
      // Кожну задану умову перевіряємо. Якщо не збіглася, ok стає false.
      if (country !== undefined && country !== null && user.country !== country) {
        ok = false;
      }
      if (age !== undefined && age !== null && user.age !== age) {
        ok = false;
      }
      if (gender !== undefined && gender !== null && user.gender !== gender) {
        ok = false;
      }
      if (favorite !== undefined && favorite !== null && user.favorite !== favorite) {
        ok = false;
      }
  
      if (ok === true) {
        result.push(user);
      }
    }
  
    return result;
  }
  
  
 
  // ЗАВДАННЯ 4: сортування за одним полем
  
  // field: 'full_name' | 'age' | 'b_date' | 'country'
  // direction: 'asc' (за зростанням) або 'desc' (за спаданням)
  function sortUsers(users, field, direction) {
    var copy = users.slice(); // робимо копію, щоб не міняти оригінальний масив
  
    // sort порівнює два елементи a і b:
    //   повернули число < 0, значить a йде раніше
    //   повернули число > 0, значить b йде раніше
    copy.sort(function (a, b) {
      var x = a[field];
      var y = b[field];
  
      // Дати (рядки виду "1990-05-14T...") перетворюємо на числа, щоб порівнювати
      if (field === 'b_date') {
        x = new Date(x).getTime();
        y = new Date(y).getTime();
      }
  
      var answer = 0;
      if (x < y) {
        answer = -1;
      }
      if (x > y) {
        answer = 1;
      }
  
      // Для спадання міняємо знак: найбільший буде першим
      if (direction === 'desc') {
        answer = -answer;
      }
      return answer;
    });
  
    return copy;
  }
  
  
  // ЗАВДАННЯ 5: пошук
  
  // field: 'full_name' | 'note' | 'age'; value: що шукаємо (рядок або число)
  // Повертає першого знайденого користувача або null
  function findUser(users, field, value) {
    for (var i = 0; i < users.length; i++) {
      var current = users[i][field];
  
      if (typeof value === 'number') {
        // Число: має збігтися точно
        if (current === value) {
          return users[i];
        }
      } else {
        // Рядок: шукаємо шматок тексту, не звертаючи уваги на великі/малі літери
        var text = String(current).toLowerCase();
        var part = String(value).toLowerCase();
        if (text.indexOf(part) !== -1) {
          return users[i];
        }
      }
    }
    return null; // нікого не знайшли
  }
  
  

  // ЗАВДАННЯ 6: відсоток користувачів за умовою
  
  // Приклад: "age" більше 30. Умова задається полем, оператором і значенням.
  // operator: '>' , '<' , '=='
  function percentByAge(users, operator, value) {
    if (users.length === 0) {
      return 0; // щоб не ділити на нуль
    }
  
    var count = 0; // скільки підійшло
    for (var i = 0; i < users.length; i++) {
      var age = users[i].age;
      if (operator === '>' && age > value) {
        count = count + 1;
      }
      if (operator === '<' && age < value) {
        count = count + 1;
      }
      if (operator === '==' && age === value) {
        count = count + 1;
      }
    }
  
    // Приклад: 30 з 50 -> 30 / 50 * 100 = 60
    return (count / users.length) * 100;
  }
  
 


  
  var users = formatUsers(randomUserMock, additionalUsers);
  console.log('--- Завдання 1: усі користувачі (без дублів) ---');
  console.log(users);
  
  console.log('--- Завдання 2: валідація (порожній список = усе гаразд) ---');
  for (var i = 0; i < users.length; i++) {
    console.log(users[i].full_name, validateUser(users[i]));
  }
  
  console.log('--- Завдання 3: тільки з Ukraine і жінки ---');
  console.log(filterUsers(users, 'Ukraine', null, 'Female', null));
  
  console.log('--- Завдання 4: за віком, від найстаршого ---');
  console.log(sortUsers(users, 'age', 'desc'));
  
  console.log('--- Завдання 5: пошук "ivan" в full_name ---');
  console.log(findUser(users, 'full_name', 'ivan'));
  
  console.log('--- Завдання 6: відсоток людей старших за 30 ---');
  console.log(percentByAge(users, '>', 30) + '%');