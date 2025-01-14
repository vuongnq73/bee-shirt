package com.example.bee_shirt.configuration;

import com.example.bee_shirt.constant.Constant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final String[] PUBLIC_ENDPOINTS_POST = {"/auth/login", "/auth/logout", "/user/register", "/auth/forgot-password", "/auth/reset-password", "/auth/send-verification-code"};
    private final String[] PUBLIC_ENDPOINTS_GET = {"/homepage/**", "/auth/send-verification-code"};


    private final String[] ADMIN_GET_ENDPOINTS = {"/admin/accounts", "/admin/roles"};
    private final String[] ADMIN_POST_ENDPOINTS = {"/admin/create"};

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        // Vô hiệu hóa CSRF
        httpSecurity.csrf(csrf -> csrf.disable());

        // Cấu hình xác thực cho các endpoint
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_POST).permitAll()
                        .requestMatchers("/homepage/**").permitAll()
                        .requestMatchers(HttpMethod.GET,"/shirt-details/online/hienthi").permitAll()
                        .requestMatchers(HttpMethod.GET,"/shirts/api/categories").permitAll()
                        .requestMatchers(HttpMethod.GET,"/shirt-details/api/sizes").permitAll()
                        .requestMatchers(HttpMethod.GET,"/shirt-details//check-duplicate").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/cart/add").permitAll()
                        .requestMatchers(HttpMethod.GET,"/cart/getIDCart").permitAll()
                        .requestMatchers(HttpMethod.GET,"/shirts/api/brands").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/verify-code/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/myOderByEmail/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/bills/detailsOnline/**").permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_GET).permitAll()  // Cho phép GET không cần xác thực
                        .requestMatchers(HttpMethod.GET, ADMIN_GET_ENDPOINTS).hasAuthority(Constant.ROLE_ADMIN)
                        .requestMatchers(HttpMethod.POST, ADMIN_POST_ENDPOINTS).hasAuthority(Constant.ROLE_ADMIN)
                        .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                        .anyRequest().authenticated()  // Các yêu cầu khác cần xác thực
        );

        // Xác thực qua JWT và cấu hình entry point cho các lỗi xác thực
        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer ->
                        jwtConfigurer.decoder(customJwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
        );

        // Cấu hình entry point khi không xác thực
        httpSecurity.exceptionHandling(exceptions ->
                exceptions.authenticationEntryPoint(new JwtAuthenticationEntryPoint())  // Định nghĩa entry point cho các yêu cầu không hợp lệ
        );

        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");  // Không dùng tiền tố cho quyền

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);  // Đảm bảo dùng mã hóa mật khẩu phù hợp
    }
}
