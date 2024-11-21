package com.example.bee_shirt.mapper;

import com.example.bee_shirt.dto.response.RoleResponse;
import com.example.bee_shirt.entity.Role;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class RoleMapperImpl implements RoleMapper {

    @Override
    public RoleResponse toRoleResponse(Role role) {
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
}
