let orderDetails = [];

function addToCart(button) {
    const menuCard = button.closest('.menu-card');
    const menuName = menuCard.dataset.menu;
    const price = parseFloat(menuCard.dataset.price);

    const quantitySpan = menuCard.querySelector('.quantity');
    let quantity = parseInt(quantitySpan.textContent);

    quantity++;
    quantitySpan.textContent = quantity;

    updateOrderDetails(menuName, price, quantity);
}

function removeFromCart(button) {
    const menuCard = button.closest('.menu-card');
    const menuName = menuCard.dataset.menu;
    const price = parseFloat(menuCard.dataset.price);

    const quantitySpan = menuCard.querySelector('.quantity');
    let quantity = parseInt(quantitySpan.textContent);

    if (quantity > 0) {
        quantity--;
        quantitySpan.textContent = quantity;

        updateOrderDetails(menuName, price, quantity);
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

function updateOrderDetails(menuName, price, quantity) {
    const existingItemIndex = orderDetails.findIndex(item => item.menu === menuName);

    if (existingItemIndex !== -1) {
        orderDetails[existingItemIndex].quantity = quantity;
    } else {
        orderDetails.push({ menu: menuName, price: price, quantity: quantity });
    }
}

function submitOrder() {
    const customerName = prompt("Masukkan Nama Pemesan:");

    if (customerName !== null && customerName.trim() !== "") {
        if (orderDetails.length === 0) {
            alert("Silakan pilih menu sebelum mengirim pesanan.");
            return;
        }

        const orderData = {
            date: new Date().toLocaleString(),
            user: customerName,
            items: orderDetails.map(item => ({
                menu: item.menu,
                price: item.price,
                quantity: item.quantity
            })),
            total: calculateTotal(orderDetails)
        };

        saveOrderToLocalStorage(orderData);

        // Reset orderDetails setelah pesanan dikirim
        orderDetails = [];

        // Menampilkan rincian pesanan dan membuka halaman order summary
        const summaryPage = window.open('summary.html', '_blank');
        summaryPage.orderDetails = orderDetails;
    } else {
        alert("Nama Pemesan harus diisi.");
    }
}

function calculateTotal(orderDetails) {
    return orderDetails.reduce((total, item) => total + item.price * item.quantity, 0);
}

function saveOrderToLocalStorage(orderData) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function clearQuantities() {
    // Menghapus semua quantity pada halaman
    const quantityElements = document.querySelectorAll('.quantity');
    quantityElements.forEach(element => {
        element.textContent = '0';
    });

    // Mengosongkan orderDetails
    orderDetails = [];
}

function displayOrderSummary() {
    const orderTable = document.getElementById('order-table');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    orders.forEach((orderData, index) => {
        const row = orderTable.insertRow();

        const dateCell = row.insertCell(0);
        const userCell = row.insertCell(1);
        const menuCell = row.insertCell(2);
        const totalCell = row.insertCell(3);
        const remarkCell = row.insertCell(4);
        const actionCell = row.insertCell(5);

        dateCell.textContent = orderData.date;
        userCell.textContent = orderData.user;

        // Membuat tabel untuk setiap item pesanan
        const menuItemsTable = document.createElement('table');
        orderData.items.forEach(item => {
            const itemRow = menuItemsTable.insertRow();
            const itemNameCell = itemRow.insertCell(0);
            const itemPriceCell = itemRow.insertCell(1);
            const itemQuantityCell = itemRow.insertCell(2);

            itemNameCell.textContent = item.menu;
            itemPriceCell.textContent = formatCurrency(item.price);
            itemQuantityCell.textContent = item.quantity;
        });

        // Menambahkan tabel menu items ke sel menuCell
        menuCell.appendChild(menuItemsTable);

        totalCell.textContent = formatCurrency(orderData.total);
        remarkCell.textContent = orderData.remark || 'Waiting';

        // Menambahkan tombol delete dan update ke dalam sel aksi
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteOrder(index);
        actionCell.appendChild(deleteButton);

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = () => updateOrderRemark(index);
        actionCell.appendChild(updateButton);
    });
}

function clearOrders() {
    const password = prompt("Masukkan Password untuk Hapus Semua Data:");

    if (password === "tua") {
        localStorage.removeItem('orders');
        location.reload();  // Refresh halaman setelah menghapus data
    } else {
        alert("Password salah. Tidak ada data yang dihapus.");
    }
}

function deleteOrder(index) {
    // Menampilkan prompt untuk memasukkan password
    const password = prompt("Masukkan password untuk konfirmasi penghapusan:");

    // Memeriksa apakah password sesuai
    if (password === "tua") {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];

        // Menghapus order berdasarkan index
        orders.splice(index, 1);

        // Menyimpan kembali data yang sudah dihapus
        localStorage.setItem('orders', JSON.stringify(orders));

        // Memuat ulang halaman untuk merefresh tampilan
        location.reload();
    } else {
        alert("Password salah. Penghapusan dibatalkan.");
    }
}

function updateOrderRemark(index) {
    const newPassword = prompt("Masukkan Password untuk Update Remark:");

    if (newPassword === "tua") {
        const newRemark = prompt("Masukkan Remark Baru (Contoh: Paid):");
        if (newRemark) {
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders[index].remark = newRemark;
            localStorage.setItem('orders', JSON.stringify(orders));
            location.reload();  // Refresh halaman setelah mengupdate data
        } else {
            alert("Remark tidak boleh kosong.");
        }
    } else {
        alert("Password salah. Tidak ada perubahan dilakukan.");
    }
}
