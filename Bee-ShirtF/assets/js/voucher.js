angular.module("voucherApp", []).controller("voucherController1", [
  "$scope",
  "$http",
  "$timeout",
  function ($scope, $http, $timeout) {
    $scope.voucherList = [];
    $scope.voucherDetail = null; // Lưu trữ thông tin chi tiết cho một chứng từ đã chọn
    $scope.filteredVoucherList = [];

    $scope.errorMessage = ""; // Để lưu thông báo lỗi
    $scope.successMessage = "";
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.totalPages = 0;
    $scope.searchKeyword = ""; // Lưu từ khóa tìm kiếm

    $scope.getVouchers = function () {
      const token = sessionStorage.getItem("jwtToken");

      $http({
        method: "GET",
        url: `http://localhost:8080/voucher/list?page=${$scope.currentPage}&size=${$scope.pageSize}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          const responseData = response.data;

          if (responseData && Array.isArray(responseData.content)) {
            $scope.voucherList = responseData.content.map((voucher) => {
              // Xác định trạng thái của voucher
              const currentDate = new Date();
              let status = 0; // Ngưng hoạt động

              const startDate = new Date(voucher.startdate);
              const endDate = new Date(voucher.enddate);

              if (startDate > currentDate) {
                status = 2; // Sắp hoạt động
              } else if (startDate <= currentDate && endDate >= currentDate) {
                status = 1; // Hoạt động
              } else if (endDate < currentDate) {
                status = 0; // Ngưng hoạt động
              }
              return {
                id: voucher.id,
                code_voucher: voucher.code_voucher,
                type_voucher: voucher.type_voucher,
                name_voucher: voucher.name_voucher,
                discount_value: voucher.discount_value,
                quantity: voucher.quantity,
                min_bill_value: voucher.min_bill_value,
                maximum_discount: voucher.maximum_discount,
                startdate: voucher.startdate,
                enddate: voucher.enddate,
                status_voucher: status,  // Cập nhật trạng thái mới
                description_voucher: voucher.description_voucher,
                createby: voucher.createby,
                createAt: voucher.createAt,
                updateAt: voucher.updateAt,
              };
            });

            $scope.totalPages = responseData.totalPages || 1;
          } else {
            console.error("Dữ liệu không hợp lệ:", responseData);
            $scope.errorMessage = "Dữ liệu không hợp lệ: Không phải là một mảng.";
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi lấy danh sách voucher:", error);
          $scope.errorMessage = "Không thể lấy danh sách voucher.";
        });
    };






    $scope.globalSearch = function () {
      const token = sessionStorage.getItem("jwtToken");
      const keyword = $scope.searchKeyword.trim(); // Loại bỏ khoảng trắng thừa

      $http({
        method: "GET",
        url: `http://localhost:8080/voucher/search?keyword=${encodeURIComponent(keyword)}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          $scope.voucherList = response.data; // Gán kết quả tìm kiếm vào danh sách hiển thị
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm voucher:", error);
          $scope.errorMessage = "Không thể tìm kiếm voucher.";
        });
    };


    $scope.searchByDateRange = function () {
      const token = sessionStorage.getItem("jwtToken");
      const batdau = $scope.search.batdau || ""; // Lấy giá trị ngày bắt đầu
      const ketthuc = $scope.search.ketthuc || ""; // Lấy giá trị ngày kết thúc

      // Kiểm tra xem ngày bắt đầu có lớn hơn ngày kết thúc không
      if (batdau && ketthuc && new Date(batdau) > new Date(ketthuc)) {
        $scope.errorMessage = "Ngày bắt đầu không được lớn hơn ngày kết thúc!";
        return;
      }

      // Chuyển đổi định dạng ngày theo yêu cầu của backend (ISO 8601: yyyy-MM-dd)
      const formattedBatdau = batdau ? new Date(batdau).toISOString().split('T')[0] : '';
      const formattedKetthuc = ketthuc ? new Date(ketthuc).toISOString().split('T')[0] : '';

      // Gửi yêu cầu tìm kiếm với ngày đã định dạng
      $http({
        method: "GET",
        url: `http://localhost:8080/voucher/searchByDateRange?batdau=${formattedBatdau}&ketthuc=${formattedKetthuc}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          $scope.voucherList = response.data; // Cập nhật danh sách voucher
          $scope.errorMessage = ""; // Xóa thông báo lỗi nếu thành công
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm voucher:", error);
          $scope.errorMessage = "Không thể tìm kiếm voucher."; // Hiển thị lỗi khi không tìm được dữ liệu
        });
    };






    // cập nhật trạng thái hết hạn 


    // // Gọi hàm này sau mỗi 5 phút để kiểm tra và cập nhật trạng thái voucher hết hạn
    // function updateExpiredVouchers() {
    //   $scope.updateExpiredVouchers();
    //   $timeout(updateExpiredVouchers, 5 * 60 * 1000); // Gọi lại sau 5 phút
    // }
    // updateExpiredVouchers();

    // // Gọi lần đầu tiên ngay sau khi tải trang
    // $timeout(updateExpiredVouchers, 5 * 60 * 1000);


    $scope.getVoucherDetail = function (id) {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        $scope.errorMessage = "Bạn chưa đăng nhập!";
        return;
      }
      $scope.errorMessage = "";
      $scope.successMessage = "";

      $http({
        method: "GET",
        url: `http://localhost:8080/voucher/detaill/${id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          sessionStorage.setItem("voucherDetail", JSON.stringify(response.data));
          $scope.successMessage = "Voucher details loaded successfully.";
          window.location.href = "/assets/VoucherDetail.html";
        })
        .catch(function (error) {
          console.error("Error fetching voucher details:", error);
          $scope.errorMessage = "Unable to fetch voucher details.";
        });
    };



    $scope.addVoucher = function (newVoucher) {
      const token = sessionStorage.getItem("jwtToken");

      // Check if user is logged in
      if (!token) {
        $scope.errorMessage = "Bạn chưa đăng nhập!";
        return;
      }
      $scope.errorMessage = "";
      $scope.successMessage = "";

      // Get today's date in yyyy-mm-dd format
      const today = new Date().toISOString().split('T')[0];

      // Validate form fields
      // if (!newVoucher || !newVoucher.code_voucher) {
      //   $scope.errorMessage = "Code Voucher là bắt buộc!";
      //   return;
      // }



      if (newVoucher && !newVoucher.status_voucher) {
        newVoucher.status_voucher = true;
      }

      if (!newVoucher.type_voucher) {
        $scope.errorMessage = "Type Voucher là bắt buộc!";
        return;
      }

      if (!newVoucher.discount_value) {
        $scope.errorMessage = "Discount Value là bắt buộc!";
        return;
      }

      if (newVoucher.type_voucher === '%' && (newVoucher.discount_value < 1 || newVoucher.discount_value > 100)) {
        $scope.errorMessage = "Phần trăm giảm giá phải từ 1 đến 100!";
        return;
      }

      if (newVoucher.type_voucher === 'Số tiền' && newVoucher.discount_value <= 0) {
        $scope.errorMessage = "Giá trị giảm giá phải lớn hơn 0 khi chọn loại 'Số tiền'!";
        return;
      }

      if ($scope.newVoucher.type_voucher === '%') {
        $scope.newVoucher.maximum_discount = null; // Reset maximum_discount
      }





      if (!newVoucher.name_voucher) {
        $scope.errorMessage = "Tên Voucher là bắt buộc!";
        return;
      }
      if (!newVoucher.quantity || newVoucher.quantity <= 0) {
        $scope.errorMessage = "Số lượng phải lớn hơn 0!";
        return;
      }
      if (!newVoucher.min_bill_value || newVoucher.min_bill_value <= 0) {
        $scope.errorMessage = "Giá trị hóa đơn tối thiểu phải lớn hơn 0!";
        return;
      }
      if (newVoucher.type_voucher === 'Số tiền') {
        if (!newVoucher.maximum_discount || newVoucher.maximum_discount <= 0) {
          $scope.errorMessage = "Giảm giá tối đa phải lớn hơn 0!";
          return;
        }
      }




      // Chuyển đổi startdate và enddate thành chuỗi ISO cho cả ngày và giờ
      const now = new Date().toISOString();

      const startDateTime = new Date(newVoucher.startdate).toISOString();
      const endDateTime = new Date(newVoucher.enddate).toISOString();

      // Check if startDateTime is in the past
      if (startDateTime < now) {
        $scope.errorMessage = "Ngày giờ bắt đầu không được sớm hơn ngày giờ hiện tại!";
        return;
      }

      // Check if endDateTime is earlier than startDateTime
      if (endDateTime < startDateTime) {
        $scope.errorMessage = "Ngày giờ kết thúc không được sớm hơn ngày giờ bắt đầu!";
        return;
      }


      // Optional description check
      newVoucher.description_voucher = newVoucher.description_voucher || ""; // If empty, set it as an empty string

      // Send data to server
      $http({
        method: "POST",
        url: "http://localhost:8080/voucher/add",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        data: {
          // code_voucher: newVoucher.code_voucher,
          type_voucher: newVoucher.type_voucher,
          name_voucher: newVoucher.name_voucher,
          discount_value: newVoucher.discount_value,
          quantity: newVoucher.quantity,
          min_bill_value: newVoucher.min_bill_value,
          maximum_discount: newVoucher.maximum_discount,
          startdate: newVoucher.startdate,
          enddate: newVoucher.enddate,
          description_voucher: newVoucher.description_voucher,

        }
      })
        .then(function (response) {
          $scope.successMessage = "Voucher đã được thêm thành công!";
          // Refresh the list of vouchers after successful addition

          $scope.voucherList.unshift(response.data);  // Dùng unshift để thêm vào đầu mảng

          // $scope.getVouchers();
          // Optionally redirect to the voucher list page
          window.location.href = "/assets/Voucher.html";
        })
        .catch(function (error) {
          console.error("Lỗi khi thêm voucher:", error);
          $scope.errorMessage = "Không thể thêm voucher.";
        });
    };


    $scope.deleteVoucher = function (voucherId) {
      const token = sessionStorage.getItem("jwtToken");

      // Kiểm tra nếu người dùng chưa đăng nhập
      if (!token) {
        $scope.errorMessage = "Bạn chưa đăng nhập!";
        return;
      }
      $scope.errorMessage = "";
      $scope.successMessage = "";

      // Xác nhận người dùng muốn xóa voucher
      if (!confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
        return;
      }

      // Gửi yêu cầu xóa voucher tới server
      $http({
        method: "DELETE",
        url: "http://localhost:8080/voucher/delete/" + voucherId,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      })
        .then(function (response) {
          $scope.successMessage = "Voucher đã được xóa thành công!";
          // Cập nhật lại danh sách voucher sau khi xóa
          $scope.getVouchers();  // Lấy lại danh sách voucher từ server
        })
        .catch(function (error) {
          console.error("Lỗi khi xóa voucher:", error);
          $scope.errorMessage = "Không thể xóa voucher.";
        });
    };




    // $scope.updateVoucher = function (voucherDetail) {
    //   const token = sessionStorage.getItem("jwtToken");

    //   if (!token) {
    //     $scope.errorMessage = "You are not logged in!";
    //     return;
    //   }
    //   $scope.errorMessage = "";
    //   $scope.successMessage = "";

    //   // Validate form fields
    //   if (!voucherDetail || !voucherDetail.code_voucher || !voucherDetail.type_voucher || !voucherDetail.name_voucher) {
    //     $scope.errorMessage = "Voucher code, type, and name are required!";
    //     return;
    //   }

    //   if (!voucherDetail.quantity || voucherDetail.quantity <= 0) {
    //     $scope.errorMessage = "Quantity must be greater than 0!";
    //     return;
    //   }
    //   if (!voucherDetail.min_bill_value || voucherDetail.min_bill_value <= 0) {
    //     $scope.errorMessage = "Minimum bill value must be greater than 0!";
    //     return;
    //   }
    //   if (!voucherDetail.maximum_discount || voucherDetail.maximum_discount <= 0) {
    //     $scope.errorMessage = "Maximum discount must be greater than 0!";
    //     return;
    //   }

    //   if (new Date(voucherDetail.enddate) < new Date()) {
    //     $scope.errorMessage = "Voucher has expired and cannot be updated.";
    //     return;
    //   }

    //   // Send updated voucher data to the server
    //   $http({
    //     method: "PUT",
    //     url: `http://localhost:8080/voucher/update/${voucherDetail.id}`,
    //     headers: {
    //       Authorization: "Bearer " + token,
    //       "Content-Type": "application/json"
    //     },
    //     data: voucherDetail
    //   })
    //     .then(function (response) {
    //       $scope.successMessage = "Voucher updated successfully!";
    //       window.location.href = "/assets/Voucher.html"; // Redirect after update
    //     })
    //     .catch(function (error) {
    //       console.error("Error updating voucher:", error);
    //       $scope.errorMessage = "Failed to update voucher.";
    //     });
    // };



    $scope.getVouchers();
  },



]);
