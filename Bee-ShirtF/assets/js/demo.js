"use strict";
// Biểu đồ tròn
Circles.create({
	id:           'task-complete',
	radius:       50,
	value:        80,
	maxValue:     100,
	width:        5,
	text:         function(value){return value + '%';},
	colors:       ['#36a3f7', '#fff'],
	duration:     400,
	wrpClass:     'circles-wrp',
	textClass:    'circles-text',
	styleWrapper: true,
	styleText:    true
})

//thông báo khi đăng nhập thành công
$.notify({
	icon: 'icon-bell',
	title: 'Bee-Shirt Admin',
	message: 'Chào mừng bạn đến với hệ thống quản lý !',
},{
	type: 'secondary',
	placement: {
		from: "bottom",
		align: "right"
	},
	time: 1000,
});

// Jsvectormap
//Chart
//khởi tạo biểu đồ 
var ctx = document.getElementById('statisticsChart').getContext('2d');
var statisticsChart = new Chart(ctx, {
	type: 'bar', // Đổi từ 'line' sang 'bar' để tạo biểu đồ cột
	data: {
		labels: [], // Sẽ được cập nhật từ API
		datasets: [
			{
				label: "Số Đơn Hàng",
				borderColor: '#f3545d',
				backgroundColor: 'rgba(243, 84, 93, 0.6)', // Thay đổi để phù hợp với biểu đồ cột
				legendColor: '#f3545d',
				fill: false, // Không cần fill khi sử dụng biểu đồ cột
				borderWidth: 2,
				data: [] // Sẽ được cập nhật từ API
			},
			{
				label: "Số Sản Phẩm",
				borderColor: '#fdaf4b',
				backgroundColor: 'rgba(253, 175, 75, 0.6)', // Thay đổi để phù hợp với biểu đồ cột
				legendColor: '#fdaf4b',
				fill: false,
				borderWidth: 2,
				data: [] // Sẽ được cập nhật từ API
			},
			{
				label: "Doanh Thu",
				borderColor: '#177dff',
				backgroundColor: 'rgba(23, 125, 255, 0.6)', // Thay đổi để phù hợp với biểu đồ cột
				legendColor: '#177dff',
				fill: false,
				borderWidth: 2,
				data: [] // Sẽ được cập nhật từ API
			}
		]
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		legend: {
			display: false
		},
		tooltips: {
			bodySpacing: 4,
			mode: "nearest",
			intersect: 0,
			position: "nearest",
			xPadding: 10,
			yPadding: 10,
			caretPadding: 10
		},
		layout: {
			padding: { left: 5, right: 5, top: 15, bottom: 15 }
		},
		scales: {
			yAxes: [{
				ticks: {
					fontStyle: "500",
					beginAtZero: true, // Đảm bảo bắt đầu từ 0
					maxTicksLimit: 5,
					padding: 10
				},
				gridLines: {
					drawTicks: false,
					display: true // Hiển thị các đường lưới cho biểu đồ cột
				}
			}],
			xAxes: [{
				gridLines: {
					zeroLineColor: "transparent"
				},
				ticks: {
					padding: 10,
					fontStyle: "500"
				}
			}]
		},
		legendCallback: function(chart) { 
			var text = []; 
			text.push('<ul class="' + chart.id + '-legend html-legend">'); 
			for (var i = 0; i < chart.data.datasets.length; i++) { 
				text.push('<li><span style="background-color:' + chart.data.datasets[i].legendColor + '"></span>'); 
				if (chart.data.datasets[i].label) { 
					text.push(chart.data.datasets[i].label); 
				} 
				text.push('</li>'); 
			} 
			text.push('</ul>'); 
			return text.join(''); 
		}  
	}
});

var myLegendContainer = document.getElementById("myChartLegend");
// generate HTML legend
myLegendContainer.innerHTML = statisticsChart.generateLegend();

// bind onClick event to all LI-tags of the legend
var legendItems = myLegendContainer.getElementsByTagName('li');
for (var i = 0; i < legendItems.length; i += 1) {
	legendItems[i].addEventListener("click", legendClickCallback, false);
}
function getToken() {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
        window.location.href = "http://127.0.0.1:5500/assets/account/login.html#!/login";
    }
    return token;
}
// // Lấy dữ liệu từ API và cập nhật biểu đồ
const token = getToken(); // Đảm bảo token được lấy trước khi gọi API
/////
function applyFilter(filterValue) {
    // Gửi yêu cầu đến API với bộ lọc thời gian
    fetch(`http://localhost:8080/statics/filterByTime?date=${filterValue}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Kiểm tra nếu dữ liệu trả về hợp lệ
        if (data && data.labels && data.shirtData && data.revenueData && data.orderData) {
			if (filterValue === "this-week") {
                // Lọc theo tuần: Hiển thị 7 ngày gần nhất
                statisticsChart.data.labels = data.labels; // Labels là 7 ngày gần nhất
                statisticsChart.data.datasets[0].data = data.orderData; // Số Đơn Hàng
                statisticsChart.data.datasets[1].data = data.shirtData; // Số Sản Phẩm
                statisticsChart.data.datasets[2].data = data.revenueData; // Doanh Thu
            } else {
            // Mảng tháng đầy đủ (12 tháng)
            const allMonths = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            // Tạo mảng labels đầy đủ (12 tháng)
            let fullLabels = allMonths.slice(); // Sao chép mảng allMonths

            // Tạo các mảng dữ liệu đầy đủ với giá trị mặc định là 0
            let fullShirtData = new Array(12).fill(0);
            let fullRevenueData = new Array(12).fill(0);
            let fullOrderData = new Array(12).fill(0);

            // Cập nhật dữ liệu vào mảng đầy đủ
            for (let i = 0; i < data.labels.length; i++) {
                let monthIndex = parseInt(data.labels[i]) - 1; // Chuyển tháng từ chuỗi sang chỉ số mảng (0-11)
                fullShirtData[monthIndex] = data.shirtData[i];
                fullRevenueData[monthIndex] = data.revenueData[i];
                fullOrderData[monthIndex] = data.orderData[i];
            }

            // Cập nhật dữ liệu biểu đồ từ API
            statisticsChart.data.labels = fullLabels; // Cập nhật labels
            statisticsChart.data.datasets[0].data = fullOrderData ; // Cập nhật dữ liệu Sản Phẩm
            statisticsChart.data.datasets[1].data = fullShirtData; // Cập nhật dữ liệu Doanh Thu
            statisticsChart.data.datasets[2].data = fullRevenueData; // Cập nhật dữ liệu Đơn Hàng
		}
            // Vẽ lại biểu đồ
            statisticsChart.update();
        } else {
            console.error("Dữ liệu trả về không đúng định dạng hoặc không có dữ liệu.");
            alert("Dữ liệu không hợp lệ hoặc không có dữ liệu. Vui lòng thử lại.");
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        alert("Lỗi khi tải dữ liệu! Vui lòng thử lại.");
    });
}

// Gọi API lần đầu để hiển thị dữ liệu mặc định (tất cả)
applyFilter("all");
//
// Hàm lọc dữ liệu theo ngày
function applyCustomFilter() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    // Kiểm tra giá trị ngày
    if (!startDate || !endDate) {
        alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
        return;
    }

    // Gửi request đến API
    fetch(` http://localhost:8080/statics/test?startDate=${startDate}&endDate=${endDate}&statusBill=6`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Kiểm tra dữ liệu trả về
        if (data && data.labels && data.orderData && data.shirtData && data.revenueData) {
            // Cập nhật biểu đồ
            statisticsChart.data.labels = data.labels;
            statisticsChart.data.datasets[0].data = data.orderData;
            statisticsChart.data.datasets[1].data = data.shirtData;
            statisticsChart.data.datasets[2].data = data.revenueData;

            statisticsChart.update(); // Vẽ lại biểu đồ
        } else {
            alert("Dữ liệu trả về không đúng định dạng.");
            console.error("API response error:", data);
        }
    })
    .catch(error => {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại!");
    });
}
//
function resetChartData() {
    // Hiển thị hộp thoại xác nhận
    Swal.fire({
        title: 'Bạn có chắc chắn muốn reset dữ liệu biểu đồ?',
        text: 'Hành động này sẽ làm mới dữ liệu và áp dụng bộ lọc mặc định.',
        icon: 'warning',
        showCancelButton: true, // Hiển thị nút Hủy
        confirmButtonColor: '#3085d6', // Màu nút Xác nhận
        cancelButtonColor: '#d33', // Màu nút Hủy
        confirmButtonText: 'Xác nhận reset',
        cancelButtonText: 'Hủy',
    }).then((result) => {
        if (result.isConfirmed) {
            // Nếu người dùng xác nhận, tiến hành reset biểu đồ
            applyFilter("all");
            Swal.fire('Đã reset dữ liệu!', '', 'success'); // Thông báo sau khi reset thành công
        } else {
            console.log('Người dùng đã hủy reset dữ liệu.');
        }
    });
}


// xuất excel
function exportChartToExcel() {
    // Hiển thị hộp thoại xác nhận
    Swal.fire({
        title: 'Bạn có chắc chắn muốn xuất dữ liệu này ra Excel?',
        text: 'Hành động này sẽ tải xuống file Excel chứa dữ liệu biểu đồ.',
        icon: 'question',
        showCancelButton: true, // Hiển thị nút Hủy
        confirmButtonColor: '#3085d6', // Màu nút Xác nhận
        cancelButtonColor: '#d33', // Màu nút Hủy
        confirmButtonText: 'Xuất Excel',
        cancelButtonText: 'Hủy',
    }).then((result) => {
        if (result.isConfirmed) {
            // Nếu người dùng xác nhận, tiến hành xuất Excel

            // Lấy dữ liệu từ biểu đồ
            const labels = statisticsChart.data.labels;
            const datasets = statisticsChart.data.datasets;

            // Tạo mảng dữ liệu để xuất ra Excel
            const excelData = [];

            // Thêm tiêu đề vào Excel
            const headers = ['Label'];
            datasets.forEach(function(dataset) {
                headers.push(dataset.label);
            });
            excelData.push(headers);

            // Thêm dữ liệu vào Excel
            for (let i = 0; i < labels.length; i++) {
                const row = [labels[i]];
                datasets.forEach(function(dataset) {
                    row.push(dataset.data[i]);
                });
                excelData.push(row);
            }

            // Tạo workbook và sheet từ dữ liệu
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(excelData);

            // Thêm sheet vào workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Chart Data');

            // Tải file Excel
            XLSX.writeFile(wb, 'chart-data.xlsx');
            Swal.fire('Đã xuất dữ liệu!', '', 'success'); // Thông báo sau khi reset thành công
        } else {
            console.log('Người dùng đã hủy xuất Excel.');
        }
    });
}


// 
    // Load order data lịch sửa mua hàng
    // $scope.loadDataOrderToTable = function () {
    //   const token = getToken();
    //   $http({
    //     method: "GET",
    //     url: "http://localhost:8080/bills/history",
    //     headers: { Authorization: "Bearer " + token }
    //   }).then(function (response) {
    //     if (Array.isArray(response.data.result)) {
    //       $scope.orders = response.data.result.map((order, index) => ({
    //         stt: index + 1,
    //         codeBill: order.codeBill,
    //         desiredDate: $scope.formatDate(order.desiredDate),
    //         totalMoney: order.totalMoney
    //           ? order.totalMoney.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    //           : "",
    //         statusBill: order.statusBill === 1 ? "Đã thanh toán" : "Chưa thanh toán",
    //       }));
    //       $scope.successMessage = "Tải dữ liệu thành công!";
    //       $timeout($scope.initializeDataTable, 0);
    //     } else {
    //       $scope.errorMessage = "Dữ liệu không đúng định dạng.";
    //     }
    //   }).catch(function (error) {
    //     handleError(error, "Không thể lấy dữ liệu hóa đơn.");
    //   });
    // };
//test
// $scope.applyDateFilter = function () {
//   // Kiểm tra nếu không có giá trị cho startDate hoặc endDate
//   if (!$scope.startDate && !$scope.endDate) {
//     // Nếu không có ngày bắt đầu và ngày kết thúc, lấy toàn bộ dữ liệu
//     $scope.filteredOrders = $scope.orders;
//   } else {
//     // Sử dụng moment.js để đảm bảo tính chính xác trong việc định dạng và so sánh ngày
//     const formattedStartDate = moment($scope.startDate, "DD/MM/YYYY").startOf('day'); // Đặt thời gian bắt đầu là 00:00
//     const formattedEndDate = moment($scope.endDate, "DD/MM/YYYY").endOf('day'); // Đặt thời gian kết thúc là 23:59

//     // Kiểm tra xem ngày bắt đầu có lớn hơn ngày kết thúc hay không
//     if (formattedStartDate.isAfter(formattedEndDate)) {
//       alert("'Từ ngày' không được lớn hơn 'Đến ngày'.");
//       return;
//     }
//     if (!$scope.startDate ) {
//       alert("Chưa Chọn Ngày Bắt Đầu.");
//       return;
//     }
//     if (!$scope.endDate) {
//       alert("Chưa Chọn Ngày Kết Kết Thúc.");
//       return;
//     }
//     // Lọc dữ liệu từ mảng orders
//     $scope.filteredOrders = $scope.orders.filter(function (order) {
//       // Chuyển đổi ngày thanh toán trong order sang định dạng chuẩn sử dụng moment.js
//       const orderDate = moment(order.desiredDate, "DD/MM/YYYY");

//       return orderDate.isBetween(formattedStartDate, formattedEndDate, null, '[]'); // '[]' bao gồm cả start và end date
//     });
    
//     // Nếu không có dữ liệu sau khi lọc, hiển thị thông báo
//     if ($scope.filteredOrders.length === 0) {
//       alert("Không có dữ liệu trong khoảng thời gian này.");
//     }
//   }

//   // Cập nhật lại bảng dữ liệu
//   $timeout($scope.initializeOrderTable, 0); // Khởi tạo lại bảng với dữ liệu đã lọc
// };

//end test

    
