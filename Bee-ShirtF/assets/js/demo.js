"use strict";

const modalShowcase = `
<!-- Demo Showcase -->
<style>
.card-documentation {
	display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
	padding: 16px 25px;
    background: #161B2C;
    color: #fff;
    border-radius: 10px;
    border: 1px solid #ffffff14;
}
</style>
<div class="modal fade" tabindex="-1" id="modalShowcase">
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen p-5">
		<div class="modal-content rounded-4">
			<div class="modal-header px-md-5 py-md-4 mt-2 mb-3 shadow-sm border-0">
				<h3 class="h5 fw-extrabold mb-0">Choose Layouts Dashboard</h3>
				<button type="button" class="btn-close me-1" data-bs-dismiss="modal" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
				<path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
			  </svg>
			  </button>
			</div>
			<div class="modal-body px-md-5">
				<div class="row g-5 pb-5"> 
					<div class="col-md-6 col-lg-4">
						<div class="card-documentation h-100">
							<div class="d-flex align-items-center flex-column justify-content-center text-center">
								<img src="assets/img/kaiadmin/logo_documentation.png" height="60" alt="Read Documentation">
								<div class="docs-info ms-3 mb-4">
									<h6 class="fw-bold mb-0 op-8 mt-1">Need help?</h6>
									<p class="fw-bold mb-0 op-5">Please check our docs</p>
								</div>
							</div>
							<a href="../../documentation/index.html" class="btn btn-primary w-100 mb-3">Documentation</a>
							<a href="https://kaiadmin.themekita.com/" class="btn btn-secondary w-100">Buy Now</a>
						</div>
					</div>
					<div class="col-md-6 col-lg-4">
						<div class="preview-showcase shadow-sm">
							<a href="../demo1/index.html" data-kt-href="true" class="preview-thumbnail">
								<h3 class="preview-title">
									Classic Dashboard	
								</h3>

								<div class="overflow-hidden">
									<img src="assets/img/kaiadmin/demo1.png" class="w-100 rounded-1 shadow-sm preview-img" data-loaded="true">
								</div>
							</a>
						</div>
					</div>
					<div class="col-md-6 col-lg-4">
						<div class="preview-showcase shadow-sm">
							<a href="../demo2/index.html" data-kt-href="true" class="preview-thumbnail">
								<h3 class="preview-title">
									White Classic Dashboard	
								</h3>

								<div class="overflow-hidden">
									<img src="assets/img/kaiadmin/demo2.png" class="w-100 rounded-1 shadow-sm preview-img" data-loaded="true">
								</div>
							</a>
						</div>
					</div>
					<div class="col-md-6 col-lg-4">
						<div class="preview-showcase shadow-sm">
							<a href="../demo3/index.html" data-kt-href="true" class="preview-thumbnail">
								<h3 class="preview-title">
									Dark Dashboard	
								</h3>

								<div class="overflow-hidden">
									<img src="assets/img/kaiadmin/demo3.png" class="w-100 rounded-1 shadow-sm preview-img" data-loaded="true">
								</div>
							</a>
						</div>
					</div>
					<div class="col-md-6 col-lg-4">
						<div class="preview-showcase shadow-sm">
							<a href="../demo4/index.html" data-kt-href="true" class="preview-thumbnail">
								<h3 class="preview-title">
									Creative Dashboard	
								</h3>

								<div class="overflow-hidden">
									<img src="assets/img/kaiadmin/demo4.png" class="w-100 rounded-1 shadow-sm preview-img" data-loaded="true">
								</div>
							</a>
						</div>
					</div>
					<div class="col-md-6 col-lg-4">
						<div class="preview-showcase shadow-sm">
							<a href="../demo5/index.html" data-kt-href="true" class="preview-thumbnail">
								<h3 class="preview-title">
									Trendy Dashboard	
								</h3>

								<div class="overflow-hidden">
									<img src="assets/img/kaiadmin/demo5.png" class="w-100 rounded-1 shadow-sm preview-img" data-loaded="true">
								</div>
							</a>
						</div>
					</div>
					<div class="col-md-6 col-lg-4">
						<div class="preview-showcase shadow-sm">
							<a href="../demo6/index.html" data-kt-href="true" class="preview-thumbnail">
								<h3 class="preview-title">
									Trendy 2 Dashboard	
								</h3>

								<div class="overflow-hidden">
									<img src="assets/img/kaiadmin/demo6.png" class="w-100 rounded-1 shadow-sm preview-img" data-loaded="true">
								</div>
							</a>
						</div>
					</div>
					<div class="col-md-6 col-lg-4">
						<div class="preview-showcase shadow-sm">
							<a href="../demo7/index.html" data-kt-href="true" class="preview-thumbnail">
								<h3 class="preview-title">
									Horizontal Dashboard	
								</h3>

								<div class="overflow-hidden">
									<img src="assets/img/kaiadmin/demo7.png" class="w-100 rounded-1 shadow-sm preview-img" data-loaded="true">
								</div>
							</a>
						</div>
					</div>
					<div class="col-md-6 col-lg-4">
						<div class="preview-showcase shadow-sm">
							<a href="../demo8/index.html" data-kt-href="true" class="preview-thumbnail">
								<h3 class="preview-title">
									Enterprise Dashboard	
								</h3>

								<div class="overflow-hidden">
									<img src="assets/img/kaiadmin/demo8.png" class="w-100 rounded-1 shadow-sm preview-img" data-loaded="true">
								</div>
							</a>
						</div>
					</div>
					<div class="col-md-6 col-lg-4">
						<div class="preview-showcase shadow-sm">
							<a href="../demo9/index.html" data-kt-href="true" class="preview-thumbnail">
								<h3 class="preview-title">
									Futuristic Dashboard	
								</h3>

								<div class="overflow-hidden">
									<img src="assets/img/kaiadmin/demo9.png" class="w-100 rounded-1 shadow-sm preview-img" data-loaded="true">
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- End Demo Showcase -->
`;

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
var world_map = new jsVectorMap({
	selector: "#world-map",
	map: "world",
	zoomOnScroll: false,
	regionStyle: {
		hover: {
			fill: '#435ebe'
		}
	},
	 markers: [
                {
                    name: 'Hà Nội',
                    coords: [21.028511, 105.804817],
                    style: {
                        fill: '#f3616d'
                    }
                },
                {
                    name: 'Hồ Chí Minh',
                    coords: [10.823099, 106.629662],
                    style: {
                        fill: '#28ab55'
                    }
                },
                {
                    name: 'Đà Nẵng',
                    coords: [16.047079, 108.206230],
                    style: {
                        fill: '#435ebe'
                    }
                },
            ],
	onRegionTooltipShow(event, tooltip) {
		tooltip.css({ backgroundColor: '#435ebe' })
	}
});

//Chart

// var ctx = document.getElementById('statisticsChart').getContext('2d');

// var statisticsChart = new Chart(ctx, {
// 	type: 'line',
// 	data: {
// 		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
// 		datasets: [ {
// 			label: "Khách hàng ghé xem",
// 			borderColor: '#f3545d',
// 			pointBackgroundColor: 'rgba(243, 84, 93, 0.6)',
// 			pointRadius: 0,
// 			backgroundColor: 'rgba(243, 84, 93, 0.4)',
// 			legendColor: '#f3545d',
// 			fill: true,
// 			borderWidth: 2,
// 			data: [154, 184, 175, 203, 210, 231, 240, 278, 252, 312, 320, 374]
// 		}, {
// 			label: "Khách hàng mới ",
// 			borderColor: '#fdaf4b',
// 			pointBackgroundColor: 'rgba(253, 175, 75, 0.6)',
// 			pointRadius: 0,
// 			backgroundColor: 'rgba(253, 175, 75, 0.4)',
// 			legendColor: '#fdaf4b',
// 			fill: true,
// 			borderWidth: 2,
// 			data: [256, 230, 245, 287, 240, 250, 230, 295, 331, 431, 456, 521]
// 		}, {
// 			label: "Doanh thu",
// 			borderColor: '#177dff',
// 			pointBackgroundColor: 'rgba(23, 125, 255, 0.6)',
// 			pointRadius: 0,
// 			backgroundColor: 'rgba(23, 125, 255, 0.4)',
// 			legendColor: '#177dff',
// 			fill: true,
// 			borderWidth: 2,
// 			data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 900]
// 		}]
// 	},
// 	options : {
// 		responsive: true, 
// 		maintainAspectRatio: false,
// 		legend: {
// 			display: false
// 		},
// 		tooltips: {
// 			bodySpacing: 4,
// 			mode:"nearest",
// 			intersect: 0,
// 			position:"nearest",
// 			xPadding:10,
// 			yPadding:10,
// 			caretPadding:10
// 		},
// 		layout:{
// 			padding:{left:5,right:5,top:15,bottom:15}
// 		},
// 		scales: {
// 			yAxes: [{
// 				ticks: {
// 					fontStyle: "500",
// 					beginAtZero: false,
// 					maxTicksLimit: 5,
// 					padding: 10
// 				},
// 				gridLines: {
// 					drawTicks: false,
// 					display: false
// 				}
// 			}],
// 			xAxes: [{
// 				gridLines: {
// 					zeroLineColor: "transparent"
// 				},
// 				ticks: {
// 					padding: 10,
// 					fontStyle: "500"
// 				}
// 			}]
// 		}, 
// 		legendCallback: function(chart) { 
// 			var text = []; 
// 			text.push('<ul class="' + chart.id + '-legend html-legend">'); 
// 			for (var i = 0; i < chart.data.datasets.length; i++) { 
// 				text.push('<li><span style="background-color:' + chart.data.datasets[i].legendColor + '"></span>'); 
// 				if (chart.data.datasets[i].label) { 
// 					text.push(chart.data.datasets[i].label); 
// 				} 
// 				text.push('</li>'); 
// 			} 
// 			text.push('</ul>'); 
// 			return text.join(''); 
// 		}  
// 	}
// });

// var myLegendContainer = document.getElementById("myChartLegend");

// // generate HTML legend
// myLegendContainer.innerHTML = statisticsChart.generateLegend();

// // bind onClick event to all LI-tags of the legend
// var legendItems = myLegendContainer.getElementsByTagName('li');
// for (var i = 0; i < legendItems.length; i += 1) {
// 	legendItems[i].addEventListener("click", legendClickCallback, false);
// }

// var dailySalesChart = document.getElementById('dailySalesChart').getContext('2d');

// var myDailySalesChart = new Chart(dailySalesChart, {
// 	type: 'line',
// 	data: {
// 		labels:["January",
// 		"February",
// 		"March",
// 		"April",
// 		"May",
// 		"June",
// 		"July",
// 		"August",
// 		"September"],
// 		datasets:[ {
// 			label: "Sales Analytics", fill: !0, backgroundColor: "rgba(255,255,255,0.2)", borderColor: "#fff", borderCapStyle: "butt", borderDash: [], borderDashOffset: 0, pointBorderColor: "#fff", pointBackgroundColor: "#fff", pointBorderWidth: 1, pointHoverRadius: 5, pointHoverBackgroundColor: "#fff", pointHoverBorderColor: "#fff", pointHoverBorderWidth: 1, pointRadius: 1, pointHitRadius: 5, data: [65, 59, 80, 81, 56, 55, 40, 35, 30]
// 		}]
// 	},
// 	options : {
// 		maintainAspectRatio:!1, legend: {
// 			display: !1
// 		}
// 		, animation: {
// 			easing: "easeInOutBack"
// 		}
// 		, scales: {
// 			yAxes:[ {
// 				display:!1, ticks: {
// 					fontColor: "rgba(0,0,0,0.5)", fontStyle: "bold", beginAtZero: !0, maxTicksLimit: 10, padding: 0
// 				}
// 				, gridLines: {
// 					drawTicks: !1, display: !1
// 				}
// 			}
// 			], xAxes:[ {
// 				display:!1, gridLines: {
// 					zeroLineColor: "transparent"
// 				}
// 				, ticks: {
// 					padding: -20, fontColor: "rgba(255,255,255,0.2)", fontStyle: "bold"
// 				}
// 			}
// 			]
// 		}
// 	}
// });

//biểu đồ 
var ctx = document.getElementById('statisticsChart').getContext('2d');
        
var statisticsChart = new Chart(ctx, {
	type: 'line', // Định dạng biểu đồ là Line
	data: {
		labels: [], // Sẽ được cập nhật từ API
		datasets: [
			{
				label: "Số Sản Phẩm",
				borderColor: '#f3545d',
				pointBackgroundColor: 'rgba(243, 84, 93, 0.6)',
				pointRadius: 0,
				backgroundColor: 'rgba(243, 84, 93, 0.4)',
				legendColor: '#f3545d',
				fill: true,
				borderWidth: 2,
				data: [] // Sẽ được cập nhật từ API
			},
			{
				label: "Doanh Thu",
				borderColor: '#fdaf4b',
				pointBackgroundColor: 'rgba(253, 175, 75, 0.6)',
				pointRadius: 0,
				backgroundColor: 'rgba(253, 175, 75, 0.4)',
				legendColor: '#fdaf4b',
				fill: true,
				borderWidth: 2,
				data: [] // Sẽ được cập nhật từ API
			},
			{
				label: "Số Đơn Hàng",
				borderColor: '#177dff',
				pointBackgroundColor: 'rgba(23, 125, 255, 0.6)',
				pointRadius: 0,
				backgroundColor: 'rgba(23, 125, 255, 0.4)',
				legendColor: '#177dff',
				fill: true,
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
					beginAtZero: false,
					maxTicksLimit: 5,
					padding: 10
				},
				gridLines: {
					drawTicks: false,
					display: false
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

// Lấy dữ liệu từ API và cập nhật biểu đồ
const token = getToken(); // Đảm bảo token được lấy trước khi gọi API

fetch("http://localhost:8080/statics/filterStatics", {
    method: "GET", // Đảm bảo dùng method đúng
    headers: { 
        Authorization: "Bearer " + token // Thêm token vào header
    }
})
.then(response => response.json())
.then(data => {
    // Xử lý dữ liệu trả về
    statisticsChart.data.labels = data.labels;
    statisticsChart.data.datasets[0].data = data.datasets[0].data;
    statisticsChart.data.datasets[1].data = data.datasets[1].data;
    statisticsChart.data.datasets[2].data = data.datasets[2].data;
    statisticsChart.update();
})
.catch(error => {
    console.error("Error fetching data:", error);
}); 
$("#activeUsersChart").sparkline([112,109,120,107,110,85,87,90,102,109,120,99,110,85,87,94], {
	type: 'bar',
	height: '100',
	barWidth: 9,
	barSpacing: 10,
	barColor: 'rgba(255,255,255,.3)'
});
