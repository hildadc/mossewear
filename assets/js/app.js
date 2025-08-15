
document.addEventListener('DOMContentLoaded', () => {
  const testimonials = document.getElementById('testimonial-list');
  const testimonialForm = document.getElementById('testimonial-form');

  testimonialForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    if(name && message){
      const div = document.createElement('div');
      div.classList.add('testimonial');
      div.innerHTML = `<strong>${name}</strong><p>${message}</p>`;
      testimonials.appendChild(div);
      testimonialForm.reset();
    }
  });
});
