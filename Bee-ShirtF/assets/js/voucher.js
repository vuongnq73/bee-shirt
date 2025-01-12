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
              // Lấy thời gian hiện tại
              const currentDateTime = new Date();

              // Kiểm tra thời gian bắt đầu và kết thúc
              const startDateTime = voucher.startdate ? new Date(voucher.startdate) : null;
              const endDateTime = voucher.enddate ? new Date(voucher.enddate) : null;

              let status = 0; // Mặc định: Ngưng hoạt động

              if (startDateTime && startDateTime > currentDateTime) {
                status = 2; // Sắp hoạt động
              } else if (
                startDateTime &&
                endDateTime &&
                startDateTime <= currentDateTime &&
                endDateTime >= currentDateTime
              ) {
                status = 1; // Hoạt động
              } else if (endDateTime && endDateTime < currentDateTime) {
                status = 0; // Ngưng hoạt động
              }


              // Định dạng lại startdate và enddate để chỉ hiển thị ngày
              const formattedStartdate = startDateTime
                ? startDateTime.toLocaleDateString()
                : null;
              const formattedEnddate = endDateTime
                ? endDateTime.toLocaleDateString()
                : null;

              // Trả về dữ liệu voucher với trạng thái cập nhật
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
                status_voucher: status, // Trạng thái mới
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



    $scope.formatDate = function (utcDate) {
      const localDate = new Date(utcDate); // Tạo đối tượng Date từ UTC
      return localDate.toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' }); // Đảm bảo múi giờ là Asia/Ho_Chi_Minh
  };
  


    $scope.addVoucher = function (newVoucher) {
      const token = sessionStorage.getItem("jwtToken");
  
      // Kiểm tra trạng thái đăng nhập
      if (!token) {
          $scope.errorMessage = "Bạn chưa đăng nhập!";
          return;
      }
      $scope.errorMessage = "";
      $scope.successMessage = "";
  
      // Kiểm tra các trường bắt buộc
      if (!newVoucher || !newVoucher.type_voucher) {
          $scope.errorMessage = "Type Voucher là bắt buộc!";
          return;
      }
      if (!newVoucher.discount_value) {
          $scope.errorMessage = "Discount Value là bắt buộc!";
          return;
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
  
      // Chuyển đổi startdate và enddate thành chuỗi ISO (bao gồm cả ngày và giờ)
      const now = new Date().toISOString();
      const startDateTime = new Date(newVoucher.startdate).toISOString(); // ISO 8601 UTC
      const endDateTime = new Date(newVoucher.enddate).toISOString();
      // Kiểm tra tính hợp lệ của startdate và enddate
      if (startDateTime < now) {
          $scope.errorMessage = "Ngày giờ bắt đầu không được sớm hơn ngày giờ hiện tại!";
          return;
      }
      if (endDateTime < startDateTime) {
          $scope.errorMessage = "Ngày giờ kết thúc không được sớm hơn ngày giờ bắt đầu!";
          return;
      }
  
      // Chuẩn bị dữ liệu gửi lên server
      const requestData = {
          type_voucher: newVoucher.type_voucher,
          name_voucher: newVoucher.name_voucher,
          discount_value: newVoucher.discount_value,
          quantity: newVoucher.quantity,
          min_bill_value: newVoucher.min_bill_value,
          maximum_discount: newVoucher.maximum_discount || null,
          startdate: startDateTime, // Gửi cả ngày và giờ
          enddate: endDateTime, // Gửi cả ngày và giờ
          description_voucher: newVoucher.description_voucher || ""
      };
  
      // Gửi dữ liệu tới server
      $http({
          method: "POST",
          url: "http://localhost:8080/voucher/add",
          headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json"
          },
          data: requestData
      })
      .then(function (response) {
          $scope.successMessage = "Voucher đã được thêm thành công!";
          $scope.voucherList.unshift(response.data); // Thêm vào danh sách voucher
          window.location.href = "/assets/Voucher.html"; // Chuyển hướng sau khi thành công
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
