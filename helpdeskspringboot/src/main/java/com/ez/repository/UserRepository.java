package com.ez.repository;

import com.ez.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, Long> {

    // get user by email
    User findUserByEmail(String email);

    // search users by searchTerm, role and status.
    @Query(value =  "" +
            " select a.* " +
            " from user a " +
            " where concat(a.id,' ', a.email,' ', a.firstName,' ', a.lastName,' ', a.phone) like %?3% and " +
            "       ( " +
            "         case ?4   " +
            "           when '' then role like '%%'   " +
            "           else role = ?4   " +
            "         end   " +
            "       ) and " +
            "       ( " +
            "         case ?5   " +
            "           when '' then status like '%%'   " +
            "           else status = ?5   " +
            "         end   " +
            "       ) " +
            " limit ?1,?2 "
            ,nativeQuery = true)
    List<User> searchUsers(int page, int numOfLinesPerPage, String searchTerm, String role, String status);

    // calculate total of users for pagination
    @Query(value =  "" +
                    " select count(a.id) as totalOfUsers " +
                    " from user a " +
                    " where concat(a.id,' ', a.email,' ', a.firstName,' ', a.lastName,' ', a.phone) like %?1% and " +
                    "       ( " +
                    "         case ?2   " +
                    "           when '' then role like '%%'   " +
                    "           else role = ?2   " +
                    "         end   " +
                    "       ) and " +
                    "       ( " +
                    "         case ?3   " +
                    "           when '' then status like '%%'   " +
                    "           else status = ?3   " +
                    "         end   " +
                    "       ) "
            ,nativeQuery = true)
    long getTotalOfUsers(String searchTerm, String role, String status);

}
