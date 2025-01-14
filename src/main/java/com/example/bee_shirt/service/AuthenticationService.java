package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.request.AuthenticationRequest;
import com.example.bee_shirt.dto.request.IntrospectRequest;
import com.example.bee_shirt.dto.request.LogoutRequest;
import com.example.bee_shirt.dto.response.AuthenticationResponse;
import com.example.bee_shirt.dto.response.IntrospectResponse;
import com.example.bee_shirt.entity.Account;
import com.example.bee_shirt.entity.InvalidatedToken;
import com.example.bee_shirt.exception.AppException;
import com.example.bee_shirt.exception.ErrorCode;
import com.example.bee_shirt.repository.AccountRepository;
import com.example.bee_shirt.repository.InvalidatedTokenRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

//Thay thế cho @Autowired
//@RequiredArgsConstructor sẽ tự động tạo contructor của những method đc khai báo là final
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
@Slf4j
public class AuthenticationService {
    AccountRepository accountRepository;

    InvalidatedTokenRepository invalidatedTokenRepository;

    //@NonFinal để ko tiêm cái này vào contructor
    @NonFinal
    protected static final String SIGNER_KEY =
            "jyl4q4MPE5mpdiRnlDFpjWb3Vowfj52sYT9YHRSOsQlLIhznImeyGZZFUnz8ghEl";

    @NonFinal
    protected static final long VALID_DURATION = 108000; // IN SECOND

    @NonFinal
    protected static final long REFRESHABLE_DURATION = 108000 ; // IN SECONDS

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isvalid = true;
        try {
            verifyToken(token);
        } catch (AppException e) {
            isvalid = false;
        }
        return IntrospectResponse.builder()
                .valid(isvalid)
                .build();

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        var user = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if(user.getStatus() == 1){
            throw new AppException(ErrorCode.ACCOUNT_BANED);
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPass());
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken());

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();
            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException e) {
            log.info("Token already expired");
        }

    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        //Vì đã mã hóa bằng thuật toán MAC -> verifier bằng MAC
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        //lấy ra thời gian hiệu lực của token
        Date expitTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        //trả về true or false
        var verifired = signedJWT.verify(verifier);

        //kiểm tra xem token còn hiệu lực hay ko
        if (!(verifired && expitTime.after(new Date()))) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

//        if(invalidatedTokenRepository
//                .existsById(signedJWT.getJWTClaimsSet().getJWTID())){
//            throw new AppException(ErrorCode.UNAUTHENTICATED);
//        }

        return signedJWT;
    }

    private String generateToken(Account account){
        //header chứa nội dung của thuật toán mà ta sd
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        //Nội dung của token
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer("giangdtph40542")
                .expirationTime(new Date(
                        //token hết hạn sau 3 giờ
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                //ID của token
                .jwtID(UUID.randomUUID().toString())
                //có thể tạo thêm claim custom
                .claim("user ID", account.getId())
                .claim("user Code", account.getCode())
                .claim("Email", account.getEmail())
//                role của user
                .claim("scope", buildScope(account))
                .build();

        //convert jwtset -> jsonset và Payload nhận
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        //kí token MACSigner(thuật toán kí token)
        try {

            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            //chuyển sang kiểu String
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException();
        }
    }

    private String buildScope(Account account){
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(account.getRole())) {
            account.getRole().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getCode());
            });
        }
        return stringJoiner.toString();
    }

}
