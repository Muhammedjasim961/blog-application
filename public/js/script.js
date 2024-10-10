document.addEventListener('DOMContentLoaded', () => {
  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.querySelector('.searchClose');

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', () => {
      searchBar.style.visibility = 'visible';
      searchBar.classlist.add('open');
      this.seatAttribute('aria-expanded', 'true');
      searchInput.focus();
    });
  }
  searchClose.addEventListener('click', () => {
    searchBar.style.visibility = 'hidden';
    searchBar.classlist.remove('open');
    this.seatAttribute('aria-expanded', 'false');
  });
});
