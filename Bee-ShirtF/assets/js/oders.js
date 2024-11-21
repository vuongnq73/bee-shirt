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

    // Load order data
    $scope.loadDataOrderToTable = function () {
      const token = getToken();
      $http({
        method: "GET",
        url: "http://localhost:8080/bills/history",
        headers: { Authorization: "Bearer " + token }
      }).then(function (response) {
        if (Array.isArray(response.data.result)) {
          $scope.orders = response.data.result.map((order, index) => ({
            stt: index + 1,
            codeBill: order.codeBill,
            desiredDate: $scope.formatDate(order.desiredDate),
            totalMoney: order.totalMoney
              ? order.totalMoney.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
              : "",
            statusBill: order.statusBill === 1 ? "Đã thanh toán" : "Chưa thanh toán",
          }));
          $scope.successMessage = "Tải dữ liệu thành công!";
          $timeout($scope.initializeDataTable, 0);
        } else {
          $scope.errorMessage = "Dữ liệu không đúng định dạng.";
        }
      }).catch(function (error) {
        handleError(error, "Không thể lấy dữ liệu hóa đơn.");
      });
    };
//test
$scope.applyDateFilter = function () {
  // Kiểm tra nếu không có giá trị cho startDate hoặc endDate
  if (!$scope.startDate && !$scope.endDate) {
    // Nếu không có ngày bắt đầu và ngày kết thúc, lấy toàn bộ dữ liệu
    $scope.filteredOrders = $scope.orders;
  } else {
    // Sử dụng moment.js để đảm bảo tính chính xác trong việc định dạng và so sánh ngày
    const formattedStartDate = moment($scope.startDate, "DD/MM/YYYY").startOf('day'); // Đặt thời gian bắt đầu là 00:00
    const formattedEndDate = moment($scope.endDate, "DD/MM/YYYY").endOf('day'); // Đặt thời gian kết thúc là 23:59

    // Kiểm tra xem ngày bắt đầu có lớn hơn ngày kết thúc hay không
    if (formattedStartDate.isAfter(formattedEndDate)) {
      alert("'Từ ngày' không được lớn hơn 'Đến ngày'.");
      return;
    }
    if (!$scope.startDate ) {
      alert("Chưa Chọn Ngày Bắt Đầu.");
      return;
    }
    if (!$scope.endDate) {
      alert("Chưa Chọn Ngày Kết Kết Thúc.");
      return;
    }
    // Lọc dữ liệu từ mảng orders
    $scope.filteredOrders = $scope.orders.filter(function (order) {
      // Chuyển đổi ngày thanh toán trong order sang định dạng chuẩn sử dụng moment.js
      const orderDate = moment(order.desiredDate, "DD/MM/YYYY");

      return orderDate.isBetween(formattedStartDate, formattedEndDate, null, '[]'); // '[]' bao gồm cả start và end date
    });
    
    // Nếu không có dữ liệu sau khi lọc, hiển thị thông báo
    if ($scope.filteredOrders.length === 0) {
      alert("Không có dữ liệu trong khoảng thời gian này.");
    }
  }

  // Cập nhật lại bảng dữ liệu
  $timeout($scope.initializeOrderTable, 0); // Khởi tạo lại bảng với dữ liệu đã lọc
};

//end test

    // $scope.applyDateFilter = function () {
    //   // Kiểm tra nếu không có giá trị cho startDate hoặc endDate
    //   if (!$scope.startDate || !$scope.endDate) {
    //     alert("Vui lòng chọn đầy đủ 'Từ ngày' và 'Đến ngày'.");
    //     return;
    //   }
    
    //   // Sử dụng moment.js để đảm bảo tính chính xác trong việc định dạng và so sánh ngày
    //   const formattedStartDate = moment($scope.startDate, "DD/MM/YYYY").startOf('day'); // Đặt thời gian bắt đầu là 00:00
    //   const formattedEndDate = moment($scope.endDate, "DD/MM/YYYY").endOf('day'); // Đặt thời gian kết thúc là 23:59
    
    //   // Kiểm tra xem ngày bắt đầu có lớn hơn ngày kết thúc hay không
    //   if (formattedStartDate.isAfter(formattedEndDate)) {
    //     alert("'Từ ngày' không được lớn hơn 'Đến ngày'.");
    //     return;
    //   }
    
    //   // Lọc dữ liệu từ mảng orders
    //   $scope.filteredOrders = $scope.orders.filter(function (order) {
    //     // Chuyển đổi ngày thanh toán trong order sang định dạng chuẩn sử dụng moment.js
    //     const orderDate = moment(order.desiredDate, "DD/MM/YYYY");
    
    //     return orderDate.isBetween(formattedStartDate, formattedEndDate, null, '[]'); // '[]' bao gồm cả start và end date
    //   });
    
    //   // Nếu không có dữ liệu sau khi lọc, hiển thị thông báo
    //   if ($scope.filteredOrders.length === 0) {
    //     alert("Không có dữ liệu trong khoảng thời gian này.");
    //   }
    
    //   // Cập nhật lại bảng dữ liệu
    //   $timeout($scope.initializeOrderTable, 0); // Khởi tạo lại bảng với dữ liệu đã lọc
    // };
    

    // $scope.applyDateFilter = function () {
    //   // Kiểm tra nếu không có giá trị cho startDate hoặc endDate
    //   if (!$scope.startDate || !$scope.endDate) {
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
    

    // Initialize DataTable for orders
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
            productInfo: `${stat.brand || "N/A"} - ${stat.shirtName || "N/A"} - ${stat.size || "N/A"}`, // Concatenate product info
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
    $scope.initializeStatisticsTable = function () {
      if ($.fn.DataTable.isDataTable("#statistics-table")) {
        $("#statistics-table").DataTable().clear().destroy();
      }
    
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
            stat.productInfo || '',  // Product info (Brand - ShirtName - Size)
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
      if ($scope.selectedBrand) {
        filterParams += `brand=${$scope.selectedBrand}&`;
      }
      if ($scope.selectedShirtName) {
        filterParams += `shirtName=${$scope.selectedShirtName}&`;
      }
      if ($scope.selectedSize) {
        filterParams += `size=${$scope.selectedSize}&`;
      }
      if ($scope.startDate) {
        filterParams += `startDate=${$scope.startDate}&`;
      }
      if ($scope.endDate) {
        filterParams += `endDate=${$scope.endDate}&`;
      }
    
      if (filterParams.endsWith('&')) {
        filterParams = filterParams.slice(0, -1);
      }
    
      const token = getToken();
    
      // Gửi yêu cầu API với các tham số lọc
      $http.get(`http://localhost:8080/bills/statics/filter?${filterParams}`, {
        headers: { Authorization: "Bearer " + token }
      }).then(function(response) {
        if (response.data.code === 1000) {
          // Sau khi nhận được dữ liệu mới, tính lại số thứ tự (stt)
          $scope.statisticsData = response.data.result.map((stat, index) => ({
            stt: index + 1,  // Cập nhật số thứ tự
            productInfo: `${stat.brand || "N/A"} - ${stat.shirtName || "N/A"} - ${stat.size || "N/A"}`,
            totalQuantitySold: stat.totalQuantitySold || 0,
          }));
          
          $timeout($scope.initializeStatisticsTable, 0); // Khởi tạo lại bảng với dữ liệu đã lọc
        } else {
          console.error('Lỗi khi lấy dữ liệu từ API', response.data);
        }
      }).catch(function(error) {
        handleError(error, 'Lỗi kết nối API:');
      });
    };
    
    // Watch for changes and apply filter
    $scope.$watchGroup(['selectedBrand', 'selectedShirtName', 'selectedSize', 'startDate', 'endDate'], function() {
      $scope.applyFilter();
    });




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


    // Initialize when the DOM is ready
    angular.element(document).ready(function () {
      $scope.loadDataOrderToTable();
      $scope.loadStatisticsData();
      $scope.loadDashboardStatistics(); // Gọi API lấy dữ liệu dashboard
  });
  
  
  }]);
