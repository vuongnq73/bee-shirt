angular.module("billDetailApp", []).controller("BillDetailController", ["$scope", "$http", "$timeout", "$window", function ($scope, $http, $timeout, $window) {
  // Khởi tạo biến
  $scope.details = [];
  $scope.totalMoney = 0;
  $scope.subtotalBeforeDiscount = 0;
  $scope.moneyShip = 0;
  $scope.errorMessage = "";
  $scope.successMessage = "";
  $scope.loading = false;
  $scope.moneyReduce = 0;
  $scope.currentDate = new Date();
  $scope.billInfo = {};

  // Định dạng tiền tệ
  $scope.formatCurrency = function (value) {
    if (typeof value !== "number" || isNaN(value)) return "N/A";
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Load chi tiết hóa đơn
  $scope.loadBillDetail = function () {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      window.location.href = "http://127.0.0.1:5500/assets/account/login.html#!/login";
      return;
    }

    // Lấy mã hóa đơn từ URL
    const urlParams = new URLSearchParams(window.location.search);
    $scope.codeBill = urlParams.get("codeBill");

    if (!$scope.codeBill) {
      alert("Không tìm thấy mã hóa đơn.");
      return;
    }
    //

    $scope.loading = true; // Bật trạng thái loading
    $http({
      method: "GET",
      url: `http://localhost:8080/bills/detailsOnline/${$scope.codeBill}`,
      headers: { Authorization: "Bearer " + token },
    })
      .then(function success(response) {
        const data = response.data;
        if (data.code === 1000 && Array.isArray(data.result) && data.result.length > 0) {
          const billDetail = data.result[0];
          $scope.billInfo = {
            codeBill: billDetail.codeBill || "N/A",
            createAt: billDetail.createAt || "N/A",
            createBy: billDetail.createBy || "N/A",
            customerName: billDetail.customerName || "N/A",
            address: billDetail.addressCustomer || "N/A",
            phoneNumber: billDetail.phoneNumber || "N/A",
            nameVoucher: billDetail.nameVoucher || "N/A",
            moneyShip: billDetail.moneyShip || 0,
            desiredDate: billDetail.desiredDate || "N/A",
            typeBill: billDetail.typeBill || "N/A",
            note: billDetail.note || "N/A",
            statusBill: billDetail.statusBill || 0,
            moneyReduce: billDetail.moneyReduce || 0,
            totalMoney: billDetail.totalMoney || 0,
            subtotalBeforeDiscount: billDetail.subtotalBeforeDiscount || 0,

          };

          $scope.details = data.result.map(item => ({
            nameImage: item.nameImage || "N/A",
            nameShirt: item.nameShirt || "N/A",
            nameBrand: item.nameBrand || "N/A",
            nameSize: item.nameSize || "N/A",
            quantity: item.quantity || 0,
            price: item.price || 0,
            total: (item.price || 0) * (item.quantity || 0),
          }));

          $scope.subtotalBeforeDiscount = $scope.billInfo.subtotalBeforeDiscount;
          $scope.moneyShip = $scope.billInfo.moneyShip;
          $scope.nameVoucher = $scope.billInfo.nameVoucher;
          $scope.note = $scope.billInfo.note;
          $scope.createAt = $scope.billInfo.createAt;
          $scope.createBy = $scope.billInfo.createBy;
          $scope.customerName = $scope.billInfo.customerName;
          $scope.address = $scope.billInfo.address;
          $scope.phoneNumber = $scope.billInfo.phoneNumber;
          $scope.typeBill = $scope.billInfo.typeBill;
          $scope.desiredDate = $scope.billInfo.desiredDate;
          $scope.moneyReduce = $scope.billInfo.moneyReduce;
          $scope.totalMoney = $scope.billInfo.totalMoney;




          $scope.updateTimeline($scope.billInfo.statusBill);
        } else {
          $scope.errorMessage = "Không tìm thấy thông tin hóa đơn.";
        }
      })
      .catch(function error(err) {
        console.error("Lỗi khi tải hóa đơn:", err);
        $scope.errorMessage = "Không thể tải thông tin hóa đơn.";
      })
      .finally(function () {
        $scope.loading = false; // Tắt trạng thái loading
      });
  };
  //
  // Cập nhật tiến trình

  // Cập nhật trạng thái và tiến trình
  $scope.updateStatus = function () {
    if ($scope.billInfo.statusBill < 6) {
      $scope.billInfo.statusBill++;

      const payload = {
        codeBill: $scope.billInfo.codeBill,
        statusBill: $scope.billInfo.statusBill
      };

      console.log("Payload gửi API:", JSON.stringify(payload));
      const token = sessionStorage.getItem("jwtToken");

      $http({
        method: 'PUT',
        url: 'http://localhost:8080/bills/updateStatus',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + token, // Thêm token nếu cần
        },
        data: JSON.stringify(payload)
      })
        .then(function (response) {
          if (response.status === 200 || response.status === 204) {
            $scope.updateTimeline($scope.billInfo.statusBill);
            $scope.currentStatusLabel = $scope.statusLabels[$scope.billInfo.statusBill - 1];
          } else {
            console.warn("API trả về trạng thái không mong đợi:", response.status);
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API:", error);
          if (error.data) {
            console.error("Chi tiết lỗi từ API:", error.data);
            alert("Lỗi: " + error.data.message);
          } else {
            alert("Đã xảy ra lỗi khi cập nhật trạng thái.");
          }
        });
    }
  };

  //confirm nút hủy đơn
  $scope.confirmCancelOrder = function () {
    // Hiển thị hộp thoại xác nhận bằng SweetAlert2
    Swal.fire({
      title: 'Bạn có chắc chắn muốn hủy đơn này?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,  // Hiển thị nút Cancel
      confirmButtonColor: '#d33',  // Màu của nút Xác nhận
      cancelButtonColor: '#3085d6',  // Màu của nút Hủy
      confirmButtonText: 'Hủy đơn',
      cancelButtonText: 'Quay lại',
      width: '400px',  // Smaller width
      padding: '10px',  // Adjust the padding inside the modal
      customClass: {
        container: 'my-swal-container', // Custom class to target the container
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Nếu người dùng xác nhận, gọi hàm cancelOrder
        $scope.cancelOrder();
      } else {
        console.log("Đơn hàng không bị hủy.");
      }
    });
  };


  // confirm nút in hóa đơn

  $scope.cancelOrder = function () {
    // Cập nhật trạng thái thành 7 khi nhấn nút Hủy đơn
    $scope.billInfo.statusBill = 7;

    const payload = {
      codeBill: $scope.billInfo.codeBill,
      statusBill: $scope.billInfo.statusBill
    };

    console.log("Payload gửi API khi hủy đơn:", JSON.stringify(payload));
    const token = sessionStorage.getItem("jwtToken");

    $http({
      method: 'PUT',
      url: 'http://localhost:8080/bills/updateStatus',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token, // Thêm token nếu cần
      },
      data: JSON.stringify(payload)
    })
      .then(function (response) {
        if (response.status === 200 || response.status === 204) {
          console.log("Đơn hàng đã được hủy.");
          $scope.updateTimeline($scope.billInfo.statusBill);  // Cập nhật tiến trình
          $scope.currentStatusLabel = $scope.statusLabels[$scope.billInfo.statusBill - 1];  // Cập nhật nhãn trạng thái
          window.location.href = "http://127.0.0.1:5500/cozastore-master/myOder.html#";

        } else {
          console.warn("API trả về trạng thái không mong đợi:", response.status);
        }
      })
      .catch(function (error) {
        console.error("Lỗi khi gọi API:", error);
        if (error.data) {
          console.error("Chi tiết lỗi từ API:", error.data);
          alert("Lỗi: " + error.data.message);
        } else {
          alert("Đã xảy ra lỗi khi cập nhật trạng thái.");
        }
      });
  };

  $scope.updateTimeline = function (statusBill) {
    console.log("Cập nhật tiến trình với trạng thái:", statusBill);

    const steps = document.querySelectorAll('.step');
    if (!steps || steps.length === 0) {
      console.error("Không tìm thấy các bước (.step) trên giao diện.");
      return;
    }

    // Xóa lớp `active` và `cancelled` trước khi cập nhật
    steps.forEach(step => {
      step.classList.remove('active', 'cancelled');
    });

    const statusMap = {
      1: 0, // Chờ Xử lý
      2: 1, // Đã Xác Nhận
      3: 2, // Chờ Giao Hàng
      4: 3, // Đang Giao Hàng
      5: 4, // Đã Thanh Toán
      6: 4, // Hoàn Tất
      7: 5  // Hủy Đơn
    };

    const currentStep = statusMap[parseInt(statusBill)] || 0;

    if (statusBill == 7) {
      // Nếu trạng thái là "Đã Hủy", áp dụng lớp `cancelled` cho tất cả các bước trước và bao gồm bước hiện tại
      for (let i = 0; i <= currentStep; i++) {
        steps[i].classList.add('cancelled');
      }
    } else {
      // Nếu không, áp dụng lớp `active` như bình thường
      for (let i = 0; i <= currentStep; i++) {
        steps[i].classList.add('active');
      }
    }

    $scope.statusLabels = [
      "Chờ Xử lý",
      "Đã Xác Nhận",
      "Chờ Giao Hàng",
      "Đang Giao Hàng",
      "Đã Thanh Toán",
      "Hoàn Tất",
      "Đã Hủy" // Thêm trạng thái Hủy Đơn
    ];

    $scope.currentStep = currentStep;
    $scope.currentStatusLabel = $scope.statusLabels[$scope.currentStep];
  };
  // Lấy thông tin người dùng hiện tại
  $scope.getMyProfile = function () {
    const token = sessionStorage.getItem("jwtToken");
    $http({
      method: "GET",
      url: `http://localhost:8080/admin/myProfile`,
      headers: { Authorization: "Bearer " + token },
    })
      .then(function (response) {
        if (response.data && response.data.result) {
          $scope.myProfile = response.data.result;
        } else {
          $scope.errorMessage = "Không thể lấy thông tin người dùng.";
        }
      })
      .catch(function (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
      });
  };

  // Điều hướng đến trang cập nhật profile
  $scope.goToUpdateProfile = function (userCode) {
    sessionStorage.setItem("userCode", userCode);
    window.location.href = "/assets/staff/Profile.html";
  };


  // Xử lý khi tài liệu sẵn sàng
  angular.element(document).ready(function () {
    $scope.getMyProfile();
    $scope.loadBillDetail();
  });
}]);
