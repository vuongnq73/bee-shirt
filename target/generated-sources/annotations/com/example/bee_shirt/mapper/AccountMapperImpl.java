package com.example.bee_shirt.mapper;

import com.example.bee_shirt.dto.request.AccountCreationRequest;
import com.example.bee_shirt.dto.request.AccountUpdateRequest;
import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.dto.response.RoleResponse;
import com.example.bee_shirt.entity.Account;
import com.example.bee_shirt.entity.Role;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class AccountMapperImpl implements AccountMapper {

    @Override
    public Account toUser(AccountCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Account.AccountBuilder account = Account.builder();

        account.createBy( request.getCreateBy() );
        account.status( request.getStatus() );
        account.code( request.getCode() );
        account.username( request.getUsername() );
        account.pass( request.getPass() );
        account.firstName( request.getFirstName() );
        account.lastName( request.getLastName() );
        account.avatar( request.getAvatar() );
        account.address( request.getAddress() );
        account.phone( request.getPhone() );
        account.email( request.getEmail() );

        return account.build();
    }

    @Override
    public void updateUser(Account account, AccountUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        account.setCreateBy( request.getCreateBy() );
        account.setDeleted( request.getDeleted() );
        account.setStatus( request.getStatus() );
        account.setCode( request.getCode() );
        account.setUsername( request.getUsername() );
        account.setPass( request.getPass() );
        account.setFirstName( request.getFirstName() );
        account.setLastName( request.getLastName() );
        account.setAvatar( request.getAvatar() );
        account.setAddress( request.getAddress() );
        account.setPhone( request.getPhone() );
        account.setEmail( request.getEmail() );
    }

    @Override
    public AccountResponse toUserResponse(Account account) {
        if ( account == null ) {
            return null;
        }

        AccountResponse.AccountResponseBuilder accountResponse = AccountResponse.builder();

        accountResponse.id( account.getId() );
        accountResponse.code( account.getCode() );
        accountResponse.firstName( account.getFirstName() );
        accountResponse.lastName( account.getLastName() );
        accountResponse.avatar( account.getAvatar() );
        accountResponse.address( account.getAddress() );
        accountResponse.phone( account.getPhone() );
        accountResponse.status( account.getStatus() );
        accountResponse.updateAt( account.getUpdateAt() );
        accountResponse.username( account.getUsername() );
        accountResponse.createAt( account.getCreateAt() );
        accountResponse.createBy( account.getCreateBy() );
        accountResponse.updateBy( account.getUpdateBy() );
        accountResponse.email( account.getEmail() );
        if ( account.getDeleted() != null ) {
            accountResponse.deleted( String.valueOf( account.getDeleted() ) );
        }
        accountResponse.role( roleSetToRoleResponseSet( account.getRole() ) );

        return accountResponse.build();
    }

    protected RoleResponse roleToRoleResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleResponse.RoleResponseBuilder roleResponse = RoleResponse.builder();

        roleResponse.id( role.getId() );
        roleResponse.code( role.getCode() );
        roleResponse.name( role.getName() );
        roleResponse.status( role.getStatus() );
        roleResponse.description( role.getDescription() );
        roleResponse.createAt( role.getCreateAt() );
        roleResponse.createBy( role.getCreateBy() );
        roleResponse.updateAt( role.getUpdateAt() );
        roleResponse.updateBy( role.getUpdateBy() );

        return roleResponse.build();
    }

    protected Set<RoleResponse> roleSetToRoleResponseSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleResponse> set1 = new LinkedHashSet<RoleResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Role role : set ) {
            set1.add( roleToRoleResponse( role ) );
        }

        return set1;
    }
}
