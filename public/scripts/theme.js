const themeMap = {
  dark: 'light',
  light: 'dark'
};

const theme = localStorage.getItem('theme');

const bodyClass = document.body.classList;
theme && bodyClass.add(theme) || (bodyClass.add("dark"), localStorage.setItem('theme', "dark"));

function toggleTheme () {
  const current = localStorage.getItem('theme');
  const next = themeMap[current];

  bodyClass.replace(current, next);
  localStorage.setItem('theme', next)
}

document.getElementById('themeButton').onclick = toggleTheme;