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

//    User findUserByUsername(String username);

    // get user by email
    User findUserByEmail(String email);

    // get users by page.
    // parameters:
    // - page: page number(ex: 1st, 2nd, 3rd)
    // - size: number of users per a page(default = 5)
    @Query(value =  " select a.* " +
                    " from user a " +
                    " limit ?1,?2 ",
            nativeQuery = true)
    List<User> getUsersByPage(int page, int size);

    // get total of users for pagination
    @Query(value =  " select count(a.id) as totalOfUsers " +
                    " from user a ",
            nativeQuery = true)
    long getTotalOfUsers();

}
