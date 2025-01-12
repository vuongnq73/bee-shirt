document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Lấy dữ liệu từ form
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Kiểm tra dữ liệu trước khi gửi
    if (!name || !email || !message) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }

    // Tạo đối tượng dữ liệu để gửi
    const contactData = {
        name: name,
        email: email,
        message: message
    };

    // Gửi dữ liệu đến API
    fetch('http://localhost:8080/api/contact/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
    })
    .then(response => {
        if (!response.ok) {
            // Phản hồi không thành công (mã trạng thái không phải 2xx)
            return response.text().then(text => { throw new Error(text || 'Unknown error'); });
        }
        return response.json(); // Parse JSON nếu phản hồi thành công
    })
    .then(data => {
        alert('Liên hệ của bạn đã được gửi thành công!');
        document.getElementById('contactForm').reset(); // Reset form sau khi gửi
    })
    .catch(error => {
        console.error('Có lỗi xảy ra:', error);
        alert('Có lỗi xảy ra khi gửi liên hệ: ' + error.message);
    });
});
