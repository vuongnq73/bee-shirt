angular.module("orderApp", [])
  .controller("OrderController", ["$scope", "$timeout", "$http", function ($scope, $timeout, $http) {

    // Initialize variables
    $scope.showCreateForm = false;
    $scope.orders = [];
    $scope.errorMessage = "";
    $scope.successMessage = "";
    $scope.statisticsData = [];

    // Filter variables
    $scope.startDate = null;
    $scope.endDate = null;
    $scope.selectedMonth = "";
    $scope.selectedYear = "";
    $scope.selectedBrand = "";
    $scope.selectedShirtName = "";
    $scope.selectedSize = "";

    // Format date
    $scope.formatDate = function (dateString) {
      if (!dateString) return "";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", options);
    };

    // Get token from sessionStorage
    function getToken() {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
        window.location.href = "http://127.0.0.1:5500/assets/account/login.html#!/login";
      }
      return token;
    }

    // Handle API errors
    function handleError(error, message) {
      console.error(message, error);
      $scope.errorMessage = message;
      $timeout(function () {
        $scope.$apply();
      });
    }

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



    // Initialize DataTable for orders
    //
    $scope.initializeOrderTable = function () {
      const data = $scope.filteredOrders || $scope.orders; // Nếu có lọc, sử dụng filteredOrders, nếu không thì dùng toàn bộ orders

      // Kiểm tra xem bảng đã được khởi tạo chưa
      if ($.fn.DataTable.isDataTable("#order-table")) {
        const table = $("#order-table").DataTable();
        // Lấy đối tượng DataTable hiện tại
        table.clear(); // Xóa dữ liệu cũ

        // Thêm dữ liệu mới vào bảng
        table.rows.add(data.map((order) => [
          order.stt,
          order.codeBill,
          order.desiredDate,
          order.totalMoney,
          order.statusBill,
        ]));

        // Vẽ lại bảng và giữ nguyên các tính năng như phân trang, tìm kiếm, sắp xếp
        table.draw();
      } else {
        // Nếu bảng chưa được khởi tạo, tạo mới bảng với các cấu hình đầy đủ
        $("#order-table").DataTable({
          paging: true,
          searching: true,
          ordering: true,
          pageLength: 5,
          data: data.map((order) => [
            order.stt,
            order.codeBill,
            order.desiredDate,
            order.totalMoney,
            order.statusBill,
          ]),
          columns: [
            { title: "STT" },
            { title: "Mã Hóa Đơn" },
            { title: "Ngày Thanh Toán", className: "text-end" },
            { title: "Tổng Tiền", className: "text-end" },
            { title: "Trạng Thái", className: "text-end" },
          ],
          language: {
            search: "Tìm kiếm:",
            lengthMenu: "Hiện _MENU_ mục",
            info: "Hiển thị _START_ đến _END_ trong tổng số _TOTAL_ mục",
            paginate: {
              first: "Đầu",
              last: "Cuối",
              next: "Tiếp",
              previous: "Trước",
            },
          },
        });
      }
    };



    // Initialize DataTable for orders
    $scope.initializeDataTable = function () {
      if ($.fn.DataTable.isDataTable("#order-table")) {
        $("#order-table").DataTable().destroy();
      }

      $("#order-table").DataTable({
        paging: true,
        searching: true,
        ordering: true,
        pageLength: 5,
        data: $scope.orders.map((order) => [
          order.stt,
          order.codeBill,
          order.desiredDate,
          order.totalMoney,
          order.statusBill,
        ]),
        columns: [
          { title: "STT" },
          { title: "Mã Hóa Đơn" },
          { title: "Ngày Thanh Toán", className: "text-end" },
          { title: "Tổng Tiền", className: "text-end" },
          { title: "Trạng Thái", className: "text-end" },
        ],
        language: {
          search: "Tìm kiếm:",
          lengthMenu: "Hiện _MENU_ mục",
          info: "Hiển thị _START_ đến _END_ trong tổng số _TOTAL_ mục",
          paginate: {
            first: "Đầu",
            last: "Cuối",
            next: "Tiếp",
            previous: "Trước",
          },
        },
      });
    };




    // Load statistics data
    $scope.loadStatisticsData = function () {
      const token = getToken();
      $http({
        method: "GET",
        url: "http://localhost:8080/bills/statics",
        headers: { Authorization: "Bearer " + token }
      }).then(function (response) {
        if (Array.isArray(response.data.result)) {
          // Transform the data for proper display
          $scope.statisticsData = response.data.result.map((stat, index) => ({
            stt: index + 1,  // Add serial number (STT)
            productInfo: stat.shirtName || "N/A", // Concatenate product info
            totalQuantitySold: stat.totalQuantitySold || 0,  // Ensure totalQuantitySold exists and is numeric
          }));

          console.log($scope.statisticsData);  // Check the transformed data in console
          $scope.successMessage = "Dữ liệu thống kê đã tải thành công!";

          // Initialize the table after data is loaded and Angular has updated the model
          $timeout($scope.initializeStatisticsTable, 0); // Delay table initialization
        } else {
          $scope.errorMessage = "Dữ liệu không đúng định dạng.";
        }
      }).catch(function (error) {
        handleError(error, "Không thể lấy dữ liệu thống kê.");
      });
    };








    // Initialize DataTable for statistics
    // Initialize DataTable for statistics
    $scope.initializeStatisticsTable = function () {
      // Kiểm tra và hủy bảng nếu bảng đã tồn tại
      if ($.fn.DataTable.isDataTable("#statistics-table")) {
        $("#statistics-table").DataTable().clear().destroy();
      }

      // Khởi tạo lại DataTable với dữ liệu mới
      $("#statistics-table").DataTable({
        searching: true,
        paging: true,
        ordering: true,
        info: false,
        lengthChange: false,
        pageLength: 5,
        data: $scope.statisticsData.map(function (stat) {
          return [
            stat.stt || '',  // Serial number (STT)
            stat.productInfo || '',  // Product info (Product Name)
            stat.totalQuantitySold || 0,  // Quantity sold
          ];
        }),
        columns: [
          { title: "STT" },
          { title: "Sản phẩm" },
          { title: "Số lượng" },
        ],
        language: {
          search: "Tìm kiếm:",
          paginate: {
            first: "Đầu",
            last: "Cuối",
            next: "Tiếp",
            previous: "Trước",
          },
        },
      });
    };

    // Apply filter and call API for statistics data
    $scope.applyFilter = function () {
      let filterParams = '';

      // Lọc theo thời gian (30 ngày hoặc 365 ngày)
      if ($scope.selectedTimeFilter) {
        filterParams = `timeFilter=${$scope.selectedTimeFilter}`;  // Gửi 30 hoặc 365 trực tiếp
      }

      const token = getToken(); // Lấy token để xác thực

      // Gửi yêu cầu API với tham số lọc
      $http.get(`http://localhost:8080/statics/filter?${filterParams}`, {
        headers: { Authorization: "Bearer " + token }
      }).then(function (response) {
        console.log("Response data:", response.data); // Kiểm tra dữ liệu nhận được từ API

        // Kiểm tra nếu response.data là một mảng hợp lệ
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Cập nhật dữ liệu cho bảng
          $scope.statisticsData = response.data.map((stat, index) => ({
            stt: index + 1,  // Số thứ tự
            productInfo: `${stat.productName || "N/A"}`, // Tên sản phẩm
            totalQuantitySold: stat.totalQuantitySold || 0, // Số lượng bán
          }));
          // Cập nhật lại bảng
          $scope.initializeStatisticsTable();
        } else {
          console.error('Lỗi: Dữ liệu trả về không hợp lệ hoặc trống');
        }
      }).catch(function (error) {
        console.error('Lỗi kết nối API:', error); // Cung cấp thêm thông tin lỗi
        handleError(error, 'Lỗi kết nối API:');
      });
    };





    $scope.totalProducts = 0; // Tổng số sản phẩm
    $scope.totalRevenue = 0;  // Tổng doanh thu
    $scope.totalOrders = 0;
    $scope.formatCurrency = function (value) {
      if (value == null || isNaN(value)) return "0 VND"; // Kiểm tra giá trị null hoặc không hợp lệ
      return value.toLocaleString("vi-VN") + " VND"; // Định dạng số và thêm VND phía sau
    };

    // Load dashboard statistics
    $scope.loadDashboardStatistics = function () {
      const token = getToken();
      $http({
        method: "GET",
        url: "http://localhost:8080/bills/statics/revenue", // URL của API
        headers: { Authorization: "Bearer " + token }
      }).then(function (response) {
        console.log("API Response:", response.data); // Log để kiểm tra phản hồi

        if (response.data.code === 1000 && Array.isArray(response.data.result)) {
          const stats = response.data.result[0]; // Lấy đối tượng đầu tiên trong mảng
          $scope.totalProducts = stats.totalShirtQuantity || 0; // Tổng số sản phẩm
          $scope.totalRevenue = stats.totalRevenue || 0; // Tổng doanh thu
          $scope.totalOrders = stats.billCount || 0; // Tổng số đơn hàng
        } else {
          $scope.errorMessage = "Không thể tải dữ liệu thống kê. Vui lòng thử lại!";
        }
      }).catch(function (error) {
        handleError(error, "Không thể kết nối API để lấy dữ liệu thống kê.");
      });
    };


    // Tổng số đơn hàng
    //
    $scope.selectedFilter = "today"; // Default filter option
    // $scope.selectedFilter = "last7days"; // Default filter option
    // $scope.selectedFilter = "current-month";
    // $scope.selectedFilter = "current-year";
    $scope.totalAllMoney = 0;
    $scope.totalInstoreMoney = 0;
    $scope.totalOnlineMoney = 0;

    // Fetch statistics based on the selected filter
    $scope.fetchStatistics = function () {
      const token = getToken();  // Ensure this function returns a valid token
      const apiUrl = `http://localhost:8080/statics/Revenuetoday`;

      $http({
        method: "GET",
        url: apiUrl,
        headers: {
          Authorization: `Bearer ${token}`  // Include token if needed
        }
      }).then(function (response) {
        // Handle successful response
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          $scope.totalAllMoney = data.totalAllMoney || 0;
          $scope.totalInstoreMoney = data.totalInstoreMoney || 0;
          $scope.totalOnlineMoney = data.totalOnlineMoney || 0;
        } else {
          // Handle case when there's no data
          $scope.totalAllMoney = 0;
          $scope.totalInstoreMoney = 0;
          $scope.totalOnlineMoney = 0;
        }
      }, function (error) {
        // Handle API error
        console.error("Error fetching statistics:", error);
        $scope.totalAllMoney = "Error";
        $scope.totalInstoreMoney = "Error";
        $scope.totalOnlineMoney = "Error";
      });
    };

    // Fetch default statistics when the page loads
    $scope.fetchStatistics();


    ///

    // Lấy token
    const token = getToken();

    // Dữ liệu ban đầu cho biểu đồ
    const data = {
      labels: ["Orders"], // Tên của cột (1 cột duy nhất)
      datasets: [
        {
          label: "Online Orders",
          data: [], // Dữ liệu sẽ được cập nhật từ API
          backgroundColor: "#177dff", // Màu sắc của Online Orders
          stack: "stack1", // Gắn nhóm với stack1
        },
        {
          label: "In-store Orders",
          data: [], // Dữ liệu sẽ được cập nhật từ API
          backgroundColor: "#f3545d", // Màu sắc của In-store Orders
          stack: "stack1", // Gắn nhóm với stack1
        }
      ]
    };

    // Cấu hình biểu đồ
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `${context.label}: ${context.raw} (${percentage}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true, // Chồng các phần trên trục X
          grid: { display: false }
        },
        y: {
          stacked: true, // Chồng các phần trên trục Y
          ticks: {
            beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
            max: 100 // Đảm bảo trục Y không vượt quá 100%
          },
          grid: { display: false }
        }
      }
    };

    //  Hàm xem profile

    $scope.viewProfile = function () {
      const token = sessionStorage.getItem("jwtToken");

      if (!token || token.split(".").length !== 3) {
        console.log("Token không hợp lệ hoặc không tồn tại");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload["user Code"]) {
        const userCode = payload["user Code"];
        sessionStorage.setItem("userCode", userCode);
        console.log("userCode đã được lưu vào sessionStorage:", userCode);
      } else {
        console.log("Không tìm thấy userCode trong payload");
      }

      $window.location.href = "/assets/staff/Profile.html";
    };
    //
    //Lấy thông tin của tài khoản đang đăng nhập
    $scope.getMyProfile = function () {
      const token = sessionStorage.getItem("jwtToken");
      $http({
        method: "GET",
        url: `http://localhost:8080/admin/myProfile`, // Đảm bảo URL đúng
        headers: {
          Authorization: "Bearer " + token, // Kiểm tra xem token có hợp lệ không
        },
      })
        .then(function (response) {
          console.log("Response:", response); // Log toàn bộ response để kiểm tra

          if (response.data && response.data.result) {
            $scope.myProfile = response.data.result;
            console.log("My Profile:", $scope.myProfile); // Kiểm tra giá trị gán vào myProfile
          } else {
            $scope.errorMessage = "Không thể lấy thông tin người dùng.";
            console.log($scope.errorMessage);
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
        })
        .finally(function () {
          $scope.loading = false; // Tắt trạng thái loading sau khi nhận được phản hồi
        });
    };
    // Hàm xem profile
    $scope.goToUpdateProfile = function (userCode) {
      // Lưu thông tin người dùng vào sessionStorage để chuyển trang
      sessionStorage.setItem("userCode", userCode);

      // Sử dụng $location để điều hướng trong AngularJS
      window.location.href = "/assets/staff/Profile.html";
    };

    ////
    // Biểu đồ tròn
    // Gọi API và cập nhật dữ liệu vào biểu đồ tròn

    //End biểu đồ tr
    //



    // Hàm cập nhật biểu đồ

    // Hàm cập nhật biểu đồ
    // function fetchDataForChart(startDate, endDate) {
    //   const token = getToken();  // Lấy token từ sessionStorage

    // Gửi yêu cầu tới API để lấy dữ liệu thống kê
    fetch("http://localhost:8080/statics/InStoreAndOnline", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token // Sử dụng token từ sessionStorage
      }
    })
      .then(response => response.json())
      .then(dataFromAPI => {
        // Kiểm tra dữ liệu trả về từ API
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
        new Chartist.Pie('#monthlyChart', {
          series: seriesData
        }, {
          plugins: [
            Chartist.plugins.tooltip() // Hiển thị thông tin chi tiết khi hover
          ]
        });

        // Tạo phần chú thích bên ngoài biểu đồ
        var myLegendContainer = document.getElementById("pieChartLegend");

        var legendHTML = '';
        var labels = ['Đơn tại quầy', 'Đơn Online'];
        var colors = ['#f3545d', '#fdaf4b'];
        var orderCounts = [totalOrderInStore, totalOrderOnline];

        // Tạo các mục legend cho từng nhãn
        for (var i = 0; i < labels.length; i++) {
          legendHTML += '<li><span style="background-color: ' + colors[i] + '"></span>'
            + labels[i] + ': ' + orderCounts[i] + ' đơn</li>';
        }

        myLegendContainer.innerHTML = legendHTML;

      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
    // }

    // Hàm lọc dữ liệu và cập nhật biểu đồ sau khi lọc
    $scope.filterData = function () {
      // Kiểm tra xem người dùng đã chọn cả ngày bắt đầu và kết thúc chưa
      if (!$scope.startDate || !$scope.endDate || new Date($scope.startDate) > new Date($scope.endDate)) {
        alert('Vui lòng chọn khoảng thời gian hợp lệ!');
        return;
      }

      // Format lại ngày để gửi vào API (YYYY-MM-DD)
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedStartDate = formatDate($scope.startDate);
      const formattedEndDate = formatDate($scope.endDate);

      // Gửi yêu cầu lọc dữ liệu tới API
      const token = getToken();  // Lấy token
      $http({
        method: 'GET',
        url: `http://localhost:8080/statics/summary?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        headers: { Authorization: "Bearer " + token }
      }).then(function (response) {
        // Log dữ liệu trả về từ API lọc
        console.log("Dữ liệu từ API (Summary):", response.data);

        // Lấy giá trị từ API (chỉ lấy hai giá trị cần thiết)
        const totalOrderInStore = response.data.totalOrderInStore || 0;
        const totalOrderOnline = response.data.totalOrderOnline || 0;
        $scope.totalProducts = response.data.totalShirtQuantity || 0; // Tổng số sản phẩm
        $scope.totalRevenue = response.data.totalRevenue || 0; // Tổng doanh thu
        $scope.totalOrders = response.data.billCount || 0; // Tổng số đơn hàng
        $scope.totalInstoreMoney = response.data.totalInstoreMoney || 0;
        $scope.totalOnlineMoney = response.data.totalOnlineMoney || 0;
        // Tổng số đơn hàng
        const totalOrders = totalOrderInStore + totalOrderOnline;

        // Dữ liệu phần trăm cho biểu đồ
        const seriesData = [
          ((totalOrderInStore / totalOrders) * 100).toFixed(2),
          ((totalOrderOnline / totalOrders) * 100).toFixed(2)
        ];

        // Tạo biểu đồ tròn
        new Chartist.Pie('#monthlyChart', {
          series: seriesData
        }, {
          plugins: [
            Chartist.plugins.tooltip() // Hiển thị thông tin chi tiết khi hover
          ]
        });

        // Tạo phần chú thích bên ngoài biểu đồ
        var myLegendContainer = document.getElementById("pieChartLegend");

        var legendHTML = '';
        var labels = ['Đơn tại quầy', 'Đơn Online'];
        var colors = ['#f3545d', '#fdaf4b'];
        var orderCounts = [totalOrderInStore, totalOrderOnline];

        // Tạo các mục legend cho từng nhãn
        for (var i = 0; i < labels.length; i++) {
          legendHTML += '<li><span style="background-color: ' + colors[i] + '"></span>'
            + labels[i] + ': ' + orderCounts[i] + ' đơn</li>';
        }

        myLegendContainer.innerHTML = legendHTML;

      })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    };

    //hàm reset
    function resetChartData2() {
      // $scope.fetchStatistics();
      $scope.loadDashboardStatistics();
    }

    // Initialize when the DOM is ready
    angular.element(document).ready(function () {
      // lịch sử mua hàng
      // $scope.loadDataOrderToTable();
      $scope.loadStatisticsData();
      $scope.loadDashboardStatistics(); // Gọi API lấy dữ liệu dashboard
      $scope.getMyProfile(); // Lấy thông tin của tài khoản đang đăng nhập
    });


  }]);
