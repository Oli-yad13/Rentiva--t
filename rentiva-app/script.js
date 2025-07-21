document.addEventListener('DOMContentLoaded', function() {
    // Handle phone/email toggle
    const phoneBtn = document.getElementById('phone-btn');
    const emailBtn = document.getElementById('email-btn');
    const phoneGroup = document.getElementById('phone-group');
    const emailGroup = document.getElementById('email-group');

    if (phoneBtn && emailBtn && phoneGroup && emailGroup) {
        phoneBtn.addEventListener('click', () => {
            if (!phoneBtn.classList.contains('active')) {
                phoneBtn.classList.add('active');
                emailBtn.classList.remove('active');
                phoneGroup.style.display = 'block';
                emailGroup.style.display = 'none';
            }
        });

        emailBtn.addEventListener('click', () => {
            if (!emailBtn.classList.contains('active')) {
                emailBtn.classList.add('active');
                phoneBtn.classList.remove('active');
                emailGroup.style.display = 'block';
                phoneGroup.style.display = 'none';
            }
        });
    }

    // Add interactive effect to booking button
    const bookingBtn = document.querySelector('.btn-accent');
    if (bookingBtn) {
        bookingBtn.addEventListener('mouseenter', () => {
            bookingBtn.style.background = 'linear-gradient(45deg, #000080 0%, #ffc107 100%)';
        });

        bookingBtn.addEventListener('mouseleave', () => {
            bookingBtn.style.background = 'linear-gradient(45deg, #ffc107 0%, #000080 100%)';
        });

        bookingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingBtn.style.background = 'linear-gradient(45deg, #ffad00 0%, #000066 100%)';
            setTimeout(() => {
                bookingBtn.style.background = 'linear-gradient(45deg, #000080 0%, #ffc107 100%)';
            }, 300);
        });
    }
});
