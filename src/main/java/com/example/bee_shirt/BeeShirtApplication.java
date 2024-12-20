package com.example.bee_shirt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BeeShirtApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeeShirtApplication.class, args);
	}

}
