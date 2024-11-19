package com.example.bee_shirt.repository;

import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.entity.Account;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    boolean existsByCode(String code);

    Optional<Account> findByCode(String code);

    Optional<Account> findByUsername(String username);

    @Query(value = """
            SELECT a FROM Account a WHERE a.deleted = false ORDER BY a.id DESC
            """)
    List<Account> getAll();

    @Query(value = """
            SELECT a.*
             FROM account a
             INNER JOIN account_role ar ON a.id = ar.account_id
             INNER JOIN role_A r ON ar.role_id = r.id
             WHERE a.deleted = 0 AND (r.code_role LIKE 'STAFF')
             ORDER BY a.id DESC;             """, nativeQuery = true)
    List<Account> getAllStaff();

    @Query(value = """

            SELECT a.*, ar.role_id, r.code_role
            FROM account a
            INNER JOIN account_role ar ON a.id = ar.account_id
            INNER JOIN role_A r ON ar.role_id = r.id
            WHERE a.deleted = 0 AND r.code_role = 'STAFF'
            ORDER BY a.id DESC; 
             """, nativeQuery = true)
    Page<Account> getAllPagingStaff(Pageable pageable);


    @Query(value = """
            SELECT COUNT(a.id)
             FROM account a
             INNER JOIN account_role ar ON a.id = ar.account_id
             INNER JOIN role_A r ON ar.role_id = r.id
             WHERE a.deleted = 0 AND (r.code_role LIKE 'STAFF')
            """, nativeQuery = true)
    long getAllTotalPageStaff();  // Trả về số lượng bản ghi tổng cộng

    @Query(value = """
            SELECT a.*, ar.role_id, r.code_role
            FROM account a
            INNER JOIN account_role ar ON a.id = ar.account_id
            INNER JOIN role_A r ON ar.role_id = r.id
            WHERE a.deleted = 0 AND r.code_role = 'USER'
            ORDER BY a.id DESC; 
             """, nativeQuery = true)
    Page<Account> getAllPagingClient(Pageable pageable);


    @Query(value = """
            SELECT COUNT(a.id)
             FROM account a
             INNER JOIN account_role ar ON a.id = ar.account_id
             INNER JOIN role_A r ON ar.role_id = r.id
             WHERE a.deleted = 0 AND (r.code_role LIKE 'USER')
            """, nativeQuery = true)
    long getAllTotalPageClient();  // Trả về số lượng bản ghi tổng cộng

    @Query(value = """
            SELECT a.*
             FROM account a
             INNER JOIN account_role ar ON a.id = ar.account_id
             INNER JOIN role_A r ON ar.role_id = r.id
             WHERE a.deleted = 0 AND r.code_role LIKE 'USER'
             ORDER BY a.id DESC;             """, nativeQuery = true)
    List<Account> getAllClient();
//    @Query(value = """
//            SELECT new com.example.bee_shirt.dto.response.AccountResponse(a.id, a.code, a.firstName, a.lastName, a.address, a.avatar, a.phone, a.status, a.email, a.username, a.createAt, a.createBy, a.updateAt, a.updateBy)  FROM Account a WHERE a.deleted = false ORDER BY a.id DESC
//            """)
//    List<Account> getAll();

    @Query(value = """
            SELECT TOP 1 * FROM account ORDER BY id DESC
            """, nativeQuery = true)
    Account getTop1();
}
