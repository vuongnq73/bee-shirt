package com.example.bee_shirt.configuration;

import com.example.bee_shirt.dto.request.IntrospectRequest;
import com.example.bee_shirt.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

//dùng để đánh dấu một class như là một Spring Bean
@Component
public class CustomJwtDecoder implements JwtDecoder{
    @Autowired
    private AuthenticationService authenticationService;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    //truyền signerKey của Jwt vào SecretKeySpec(xem ở /service/AuthenticationService)
    @Override
    public Jwt decode(String token) throws JwtException {
        //Check token xem đã hết hạn ỏ bị logout chưa
//        try {
//            var response = authenticationService.introspect(IntrospectRequest.builder()
//                    .token(token)
//                    .build());
//            if(!response.isValid()){
//                throw new JwtException("Token isvalid");
//            }
//        } catch (ParseException | JOSEException e) {
//            throw new JwtException(e.getMessage());
//        }

        //Get quyền của tài khoản để xét qua token
        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec("jyl4q4MPE5mpdiRnlDFpjWb3Vowfj52sYT9YHRSOsQlLIhznImeyGZZFUnz8ghEl".getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }
}
