package com.example.bee_shirt.exception;

import com.example.bee_shirt.controller.VoucherController1;
import com.example.bee_shirt.service.VoucherService1;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.ZonedDateTime;


@SpringBootApplication
public class BeeShirtApplicationVoucher implements CommandLineRunner {

    @Autowired
    private VoucherService1 voucherService;
    private static final Logger log = LoggerFactory.getLogger(VoucherController1.class);

    public static void main(String[] args) {
        SpringApplication.run(BeeShirtApplicationVoucher.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            // Chuỗi ngày giờ đầu vào
            String dateStr = "2024-11-24T13:44";

            // Chuẩn hóa chuỗi nếu thiếu giây
            if (dateStr.length() == 16) {
                dateStr += ":00"; // Thêm giây nếu thiếu
            }

            // In chuỗi sau khi xử lý
            System.out.println("Chuỗi ngày giờ sau khi thêm giây: " + dateStr);

            // Gọi hàm chuyển đổi ngày giờ
            ZonedDateTime zonedDateTime = voucherService.convertToLocalDateTimeWithTimeZone(dateStr);

            // In kết quả ngày giờ
            System.out.println("Ngày giờ với múi giờ Asia/Ho_Chi_Minh: " + zonedDateTime);
        } catch (Exception e) {
            // Log lỗi chi tiết
            log.error("Lỗi xử lý ngày giờ: ", e);
        }
    }

}
