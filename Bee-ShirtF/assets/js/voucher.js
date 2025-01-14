const app = angular.module("voucherApp", []);


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

              const startDate = voucher.startdate
                ? new Date(voucher.startdate)
                : null;
              const endDate = voucher.enddate
                ? new Date(voucher.enddate)
                : null;


    $scope.vouchers = [];
    $scope.voucher = {};
    $scope.isEditing = false;
    $scope.successMessage = "";
    $scope.errorMessage = "";
    const token = sessionStorage.getItem("jwtToken");

    // Load all vouchers
    $scope.loadVouchers = function () {
        $http.get(`${apiUrl}/all`)
            .then(function (response) {
                $scope.vouchers = response.data.content;
            })
            .catch(function (error) {
                $scope.errorMessage = "Không thể tải danh sách voucher.";
            });

            console.log($scope.voucherList);

            $scope.totalPages = responseData.totalPages || 1;
          } else {
            console.error("Dữ liệu không hợp lệ:", responseData);
            $scope.errorMessage =
              "Dữ liệu không hợp lệ: Không phải là một mảng.";
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
        url: `http://localhost:8080/voucher/search?keyword=${encodeURIComponent(
          keyword
        )}`,
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
      // Lấy giá trị ngày bắt đầu và kết thúc từ người dùng
      const batdau = $scope.search.batdau ? new Date($scope.search.batdau) : "";
      const ketthuc = $scope.search.ketthuc
        ? new Date($scope.search.ketthuc)
        : "";

      // Kiểm tra xem ngày bắt đầu có lớn hơn ngày kết thúc không
      if (batdau && ketthuc && new Date(batdau) > new Date(ketthuc)) {
        $scope.errorMessage = "Ngày bắt đầu không được lớn hơn ngày kết thúc!";
        return;
      }

      // Chuyển đổi định dạng ngày theo yêu cầu của backend (ISO 8601: yyyy-MM-dd)

      // Chuyển đổi thành định dạng yyyy-MM-dd
      const formattedBatdau = batdau
        ? batdau.getFullYear() +
          "-" +
          ("0" + (batdau.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + batdau.getDate()).slice(-2)
        : "";
      const formattedKetthuc = ketthuc
        ? ketthuc.getFullYear() +
          "-" +
          ("0" + (ketthuc.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + ketthuc.getDate()).slice(-2)
        : "";

      console.log(formattedBatdau);

      console.log(formattedKetthuc);

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
          sessionStorage.setItem(
            "voucherDetail",
            JSON.stringify(response.data)
          );
          sessionStorage.setItem("voucherId", response.data.id);
          console.log(response.data.id);
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
      return localDate.toLocaleString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
      }); // Đảm bảo múi giờ là Asia/Ho_Chi_Minh
    };

    window.onload = function () {
      const voucherDetail = JSON.parse(sessionStorage.getItem("voucherDetail"));

      if (voucherDetail) {
        // Gán giá trị vào form
        document.getElementById("id").value = voucherDetail.id;
        document.getElementById("code_voucher").value =
          voucherDetail.code_voucher;
        document.getElementById("type_voucher").value =
          voucherDetail.type_voucher;
        document.getElementById("name_voucher").value =
          voucherDetail.name_voucher;
        document.getElementById("discount_value").value =
          voucherDetail.discount_value;
        document.getElementById("quantity").value = voucherDetail.quantity;
        document.getElementById("min_bill_value").value =
          voucherDetail.min_bill_value;
        document.getElementById("maximum_discount").value =
          voucherDetail.maximum_discount;

        // Gán giá trị vào các input type="date"
        document.getElementById("startDate").value = voucherDetail.startdate;
        document.getElementById("endDate").value = voucherDetail.enddate;

        console.log(voucherDetail.enddate);

        console.log(voucherDetail.status_voucher);
        // Set the status
        if (voucherDetail.status_voucher === 1) {
          document.getElementById("statusActive").checked = true;
        } else if (voucherDetail.status_voucher === 0) {
          document.getElementById("statusInactive").checked = true;
        } else if (voucherDetail.status_voucher === 2) {
          document.getElementById("statusPending").checked = true;
        }
      } else {
        console.error("Voucher detail not found in sessionStorage.");
      }

    };

    // Delete Voucher
    $scope.deleteVoucher = function (id) {
        if (confirm("Bạn có chắc chắn muốn xóa?")) {
            $http.delete(`${apiUrl}/delete/${id}`)
                .then(function () {
                    $scope.successMessage = "Xóa thành công!";
                    $scope.loadVouchers();
                })
                .catch(function () {
                    $scope.errorMessage = "Lỗi khi xóa voucher.";
                });
        }

      }

      // Chuyển đổi startdate và enddate thành chuỗi ISO cho cả ngày và giờ
      const now = new Date().toISOString();

      const startDateTime = new Date(newVoucher.startdate).toISOString();
      const endDateTime = new Date(newVoucher.enddate).toISOString();
      // Check if startDateTime is in the past
      if (startDateTime < now) {
        $scope.errorMessage =
          "Ngày giờ bắt đầu không được sớm hơn ngày giờ hiện tại!";
        return;
      }

      // Check if endDateTime is earlier than startDateTime
      if (endDateTime < startDateTime) {
        $scope.errorMessage =
          "Ngày giờ kết thúc không được sớm hơn ngày giờ bắt đầu!";
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
          "Content-Type": "application/json",
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
        },
      })
        .then(function (response) {
          $scope.successMessage = "Voucher đã được thêm thành công!";
          // Refresh the list of vouchers after successful addition

          $scope.voucherList.unshift(response.data); // Dùng unshift để thêm vào đầu mảng

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

      // Hiển thị thông báo đang xử lý và vô hiệu hóa nút xóa
      $scope.isDeleting = true;
      $scope.deleteButtonText = "Đang xóa...";

      // Gửi yêu cầu xóa voucher tới server
      $http({
        method: "DELETE",
        url: "http://localhost:8080/voucher/delete/" + voucherId,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          if (response.status === 200) {
            $scope.successMessage = response.data.message;
            $scope.errorMessage = "";
            $scope.getVouchers(); // Cập nhật lại danh sách voucher
          } else {
            $scope.errorMessage = "Có lỗi xảy ra khi xóa voucher!";
          }

          $scope.isDeleting = false; // Kích hoạt lại nút sau khi hoàn tất
        })
        .catch(function (error) {
          console.error("Error deleting voucher:", error);
          console.log(error.response); // In ra thông tin phản hồi nếu có
          $scope.errorMessage = "Xóa thất bại.";
          $scope.successMessage = "";
          $scope.isDeleting = false; // Kích hoạt lại nút sau khi gặp lỗi
        });
    };

    $scope.updateVoucher = function (voucherDetail) {
      const token = sessionStorage.getItem("jwtToken");

      // Check if user is logged in
      if (!token) {
        $scope.errorMessage = "Bạn chưa đăng nhập!";
        return;
      }
      $scope.errorMessage = "";
      $scope.successMessage = "";

      const id = sessionStorage.getItem("voucherId")
      

      // Send data to server
      if(confirm("Bạn chắc chắn muốn sửa voucher này chứ?")){
        $http({
          method: "PUT",
          url: `http://localhost:8080/voucher/update/${id}`,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: {
            code_voucher: voucherDetail.code_voucher,
            type_voucher: voucherDetail.type_voucher,
            name_voucher: voucherDetail.name_voucher,
            discount_value: voucherDetail.discount_value,
            quantity: voucherDetail.quantity,
            min_bill_value: voucherDetail.min_bill_value,
            maximum_discount: voucherDetail.maximum_discount,
            startdate: voucherDetail.startdate,
            enddate: voucherDetail.enddate,
            description_voucher: voucherDetail.description_voucher,
            status_voucher: voucherDetail.status_voucher,
          },
        })
        .then(function (response) {

          $scope.successMessage = "Voucher đã được thêm thành công!";
          // Refresh the list of vouchers after successful addition

          $scope.voucherList.unshift(response.data); // Dùng unshift để thêm vào đầu mảng

          // $scope.getVouchers();
          // Optionally redirect to the voucher list page
          window.location.href = "/assets/Voucher.html";
        })
        .catch(function (error) {
          console.error("Lỗi khi thêm voucher:", error);
          $scope.errorMessage = "Không thể thêm voucher.";
        });
      }
    };

    // Hàm xem profile
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

    // Edit Voucher
    $scope.editVoucher = function (voucher) {
        $scope.voucher = angular.copy(voucher);
        $scope.isEditing = true;
    };

    // View Voucher
    $scope.viewVoucher = function (id) {
        $http.get(`${apiUrl}/detail/${id}`)
            .then(function (response) {
                alert(`Chi tiết Voucher:\n${JSON.stringify(response.data)}`);
            })
            .catch(function () {
                $scope.errorMessage = "Không thể tải chi tiết voucher.";
            });
    };

    // Reset Form
    $scope.resetForm = function () {
        $scope.voucher = {};
        $scope.isEditing = false;
        $scope.successMessage = "";
        $scope.errorMessage = "";
    };

    // Initialize
    $scope.loadVouchers();
});
