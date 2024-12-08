"use strict";



// window.addEventListener('load', function(event) {
//   $("body").append(modalShowcase);

//   const myModal = new bootstrap.Modal("#modalShowcase");
//   myModal.show();
// });


// Cicle Chart
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

//Notify
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

//biểu đồ 
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
        window.location.href = "http://127.0.0.1:5501/assets/account/login.html#!/login";
    }
    return token;
}

// // Lấy dữ liệu từ API và cập nhật biểu đồ
const token = getToken(); // Đảm bảo token được lấy trước khi gọi API

// fetch("http://localhost:8080/statics/filterStatics", {
//     method: "GET", // Đảm bảo dùng method đúng
//     headers: { 
//         Authorization: "Bearer " + token // Thêm token vào header
//     }
// })
// .then(response => response.json())
// .then(data => {
//     // Xử lý dữ liệu trả về
//     statisticsChart.data.labels = data.labels;
//     statisticsChart.data.datasets[0].data = data.datasets[0].data;
//     statisticsChart.data.datasets[1].data = data.datasets[1].data;
//     statisticsChart.data.datasets[2].data = data.datasets[2].data;
//     statisticsChart.update();
// })
// .catch(error => {
//     console.error("Error fetching data:", error);
// }); 

$("#activeUsersChart").sparkline([112,109,120,107,110,85,87,90,102,109,120,99,110,85,87,94], {
	type: 'bar',
	height: '100',
	barWidth: 9,
	barSpacing: 10,
	barColor: 'rgba(255,255,255,.3)'
});

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
            statisticsChart.data.datasets[0].data = fullShirtData; // Cập nhật dữ liệu Sản Phẩm
            statisticsChart.data.datasets[1].data = fullRevenueData; // Cập nhật dữ liệu Doanh Thu
            statisticsChart.data.datasets[2].data = fullOrderData; // Cập nhật dữ liệu Đơn Hàng
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


////
// Biểu đồ tròn
// Gọi API và cập nhật dữ liệu vào biểu đồ tròn
fetch("http://localhost:8080/statics/InStoreAndOnline", {
	method: "GET",
	headers: {
	  Authorization: "Bearer " + token // Sử dụng token từ sessionStorage
	}
  })
	.then(response => response.json())
	.then(dataFromAPI => {
	  // Kiểm tra dữ liệu trả về
	  console.log("Dữ liệu từ API:", dataFromAPI);
  
	  // Lấy giá trị từ API
	  const totalOrderInStore = dataFromAPI[0]?.totalOrderInStore || 0;
	  const totalOrderOnline = dataFromAPI[0]?.totalOrderOnline || 0;
  
	  // Tổng số đơn hàng
	  const totalOrders = totalOrderInStore + totalOrderOnline;
  
	  // Dữ liệu phần trăm cho biểu đồ
	  const seriesData = [
		((totalOrderInStore / totalOrders) * 100).toFixed(2),
		((totalOrderOnline / totalOrders) * 100).toFixed(2)
	  ];
  
	  // Tạo biểu đồ tròn
	  var pieChart = new Chartist.Pie('#monthlyChart', {
		series: seriesData
	  }, {
		plugins: [
					Chartist.plugins.tooltip() // Hiển thị thông tin chi tiết khi hover
				  ]
	  });
  
	  // Tạo phần chú thích bên ngoài biểu đồ
	  pieChart.on('created', function() {
		// Lấy phần tử chứa legend
		var myLegendContainer = document.getElementById("pieChartLegend");
  
		// Tạo HTML cho legend (chú thích) thủ công
		var legendHTML = '';
		var labels = ['Đơn tại quầy', 'Đơn Online']; // Nhãn tương ứng
		var colors = ['#f3545d', '#fdaf4b']; // Màu sắc tương ứng
		var orderCounts = [totalOrderInStore, totalOrderOnline]; // Số đơn hàng tương ứng
  
		// Tạo các mục legend cho từng nhãn
		for (var i = 0; i < labels.length; i++) {
		  legendHTML += '<li><span style="background-color: ' + colors[i] + '"></span>'
					  + labels[i] + ': ' + orderCounts[i] + ' đơn</li>';
		}
  
		// Chèn legend vào trang
		myLegendContainer.innerHTML = legendHTML;
	  });
	})
	.catch(error => {
	  console.error("Error fetching data:", error);
	});
  