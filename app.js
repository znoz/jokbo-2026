fetch('menu.json')
  .then(function (res) { return res.json(); })
  .then(function (menu) {
    var sidebar = document.getElementById('sidebar');
    var titleEl = sidebar.querySelector('h1');
    titleEl.textContent = menu.title;

    var firstLink = null;

    menu.categories.forEach(function (category) {
      var categoryEl = document.createElement('div');
      categoryEl.className = 'category';

      var titleEl;
      if (category.path) {
        titleEl = document.createElement('a');
        titleEl.href = category.path;
        titleEl.target = 'content';
        titleEl.className = 'category-title lecture-link' + (category.ready === false ? ' not-ready' : '');
        titleEl.textContent = category.title;
        titleEl.addEventListener('click', function () {
          document.querySelectorAll('.lecture-link').forEach(function (l) { l.classList.remove('active'); });
          titleEl.classList.add('active');
        });
        categoryEl.appendChild(titleEl);
        if (!firstLink && category.ready !== false) firstLink = titleEl;
        sidebar.appendChild(categoryEl);
        return;
      }

      if (category.materials) {
        titleEl = document.createElement('a');
        titleEl.href = encodeURI(category.materials);
        titleEl.target = '_blank';
        titleEl.rel = 'noopener';
      } else {
        titleEl = document.createElement('div');
      }
      titleEl.className = 'category-title';
      titleEl.textContent = category.title;
      categoryEl.appendChild(titleEl);

      var list = document.createElement('ul');
      list.className = 'lecture-list';

      (category.lessons || []).forEach(function (lesson) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = lesson.path;
        a.target = 'content';
        a.className = 'lecture-link' + (lesson.ready === false ? ' not-ready' : '');
        a.textContent = lesson.title;
        a.addEventListener('click', function () {
          document.querySelectorAll('.lecture-link').forEach(function (l) { l.classList.remove('active'); });
          a.classList.add('active');
        });
        li.appendChild(a);
        list.appendChild(li);
        if (!firstLink && lesson.ready !== false) firstLink = a;
      });

      (category.pending || []).forEach(function (text) {
        var li = document.createElement('li');
        var span = document.createElement('span');
        span.className = 'pending';
        span.textContent = text;
        li.appendChild(span);
        list.appendChild(li);
      });

      categoryEl.appendChild(list);
      sidebar.appendChild(categoryEl);
    });

    if (firstLink) {
      firstLink.classList.add('active');
      document.getElementById('contentFrame').src = firstLink.getAttribute('href');
    }
  });
