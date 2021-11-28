const followButton = document.querySelector('.follow-button');

followButton.addEventListener('click', function (event) {
	event.preventDefault();
	followButton.classList.toggle('following');
});
