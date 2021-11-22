let list = document.querySelectorAll('.header-nav-item');
console.log(list);
list.forEach((item) => {
	item.addEventListener('click', (e) => {
		localStorage.setItem('active', item.innerHTML);
	});
});
list.forEach((item) => {
	if (item.innerHTML == localStorage.getItem('active')) {
		item.classList.add('active');
	} else item.classList.remove('active');
});
