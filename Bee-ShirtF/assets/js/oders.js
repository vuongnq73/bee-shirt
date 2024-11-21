// Khu vực 1: Biến toàn cục
const gURL = "http://localhost:8080/bill/list";

// Biến cho trạng thái của biểu mẫu
const gFORM_MODE_NORMAL = "Normal"; // Trạng thái bình thường
const gFORM_MODE_INSERT = "Insert"; // Trạng thái chèn
const gFORM_MODE_UPDATE = "Update"; // Trạng thái cập nhật
const gFORM_MODE_DELETE = "Delete"; // Trạng thái xóa

var gFormMode = gFORM_MODE_NORMAL; // Trạng thái biểu mẫu mặc định
var gId = 0; // ID của phiếu đang được cập nhật hoặc xóa
var gSTT = 1; // Số thứ tự

var gOrderTable = $("#order-table").DataTable({
    columns: [
        { data: "stt" },
        { data: "codeBill" },
        { data: "desiredDate" },
        { data: "totalMoney" },
        { data: "statusBill" },
    ],
    columnDefs: [
        {
            targets: [2],
            render: function(date) {
                return formatDate(date); // Định dạng ngày
            }
        },
        {
            targets: -1,
            defaultContent: `
                <i class="far fa-lg fa-edit text-success btn-edit"></i> | 
                <i class="fas fa-lg fa-info-circle text-primary btn-detail"></i> | 
                <i class="fas fa-lg fa-trash btn-delete text-danger"></i>`,
        },
    ],
});

// Hàm để định dạng ngày
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Hàm để tải dữ liệu từ server và populate bảng
function loadDataOrderToTable() {
    $.ajax({
        url: gURL,
        method: "GET",
        dataType: "json",
        success: function(responseText) {
            console.log("Dữ liệu trả về:", responseText); // Ghi lại dữ liệu trả về
            getOrdersList(responseText);
        },
        error: function(xhr, status, error) {
            console.error("Lỗi khi lấy dữ liệu:", error); // Ghi lại lỗi
        }
    });
}

// Hàm để populate DataTable với các đơn hàng
function getOrdersList(responseText) {
    gSTT = 1; // Đặt lại số thứ tự
    gOrderTable.clear(); // Xóa dữ liệu hiện có trong bảng
    const formattedData = responseText.map(order => ({
        stt: gSTT++,
        codeBill: order.codeBill,
        desiredDate: order.desiredDate,
        totalMoney: order.totalMoney,
        statusBill: order.statusBill === 1 ? "Đã thanh toán" : "Chưa thanh toán" // Kiểm tra trạng thái
    }));
    gOrderTable.rows.add(formattedData); // Thêm dữ liệu mới
    gOrderTable.draw(); // Vẽ lại bảng
}


// Gọi hàm này để tải dữ liệu khi tài liệu sẵn sàng
$(document).ready(function() {
    loadDataOrderToTable(); // Tải dữ liệu vào bảng
});


