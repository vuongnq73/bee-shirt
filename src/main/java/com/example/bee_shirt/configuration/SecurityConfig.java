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
//phân quyền bằng method -> AccountService
@EnableMethodSecurity
public class SecurityConfig {
    private final String[] PUBLIC_ENDPOINTS_POST = {"/auth/login", "/user/register", "/auth/forgot-password", "/auth/reset-password","/auth/reset-password"};

    private final String[] PUBLIC_ENDPOINTS_PUT = {};

    private final String[] ADMIN_GET_ENDPOINTS = {"/admin/accounts", "/admin/roles"};

    private final String[] ADMIN_POST_ENDPOINTS = {"/admin/create"};

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        //Dùng để vô hiệu hóa tính năng CSRF (Cross-Site Request Forgery) bảo mật trong Spring Security
        httpSecurity.csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable());

        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_POST).permitAll()
                        .requestMatchers("/homepage/**").permitAll()
                        .requestMatchers(HttpMethod.GET, ADMIN_GET_ENDPOINTS).hasAuthority(Constant.ROLE_ADMIN)
                        .requestMatchers(HttpMethod.POST, ADMIN_POST_ENDPOINTS).hasAuthority(Constant.ROLE_ADMIN)
                        .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()

                        .anyRequest().authenticated());

        //Xét quyền của user qua token
//       httpSecurity.oauth2ResourceServer(oauth2 ->...) chấp nhận và xác thực quyền qua token OAuth2
        httpSecurity.oauth2ResourceServer(oauth2 ->

//              oauth2.jwt(jwtConfigurer -> ...) chỉ định rằng máy chủ tài nguyên sẽ sử dụng JWT để xác thực token
                        oauth2.jwt(jwtConfigurer ->

//              jwtConfigurer.decoder(jwtDecoder()) tự thiết lập 1 bộ giải mã token tên là jwtDecoder(),
//              dùng để giải mã token
                                        jwtConfigurer.decoder(customJwtDecoder)

//                      Sử dụng thiết lập đã tạo để chuyển đổi đối tượng trong JWT thành 1 đối tượng xác thực trong spring security
                                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                                                .and()

//                      Sử dụng thiết lập đã tạo để đưa ra phản hồi mong muốn khi yêu cầu xác thực thất bại
                                                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                        )
        );

        return httpSecurity.build();
    }

    //  Tự tạo 1 bộ xác thức JWT cho phép chuyển đổi đối tượng trong JWT thành 1 đối tượng xác thực trong spring security
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        //Chuyển từ SCOPE_ADMIN -> ROLE_ADMIN
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();

        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    //vì BCryptPasswordEncoder được sử dụng nhiều nên tạo 1 bean để không phải gọi lại nhiều lần
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
