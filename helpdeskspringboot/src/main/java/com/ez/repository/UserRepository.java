package com.ez.repository;

import com.ez.domain.User;
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

    @Query(value =  "select a.* " +
                    "from user a " +
                    "limit ?1,5; ",
            nativeQuery = true)
    List<User> getAllUsers(int index);

    @Query(value =  " select count(a.id) as totalOfUsers " +
                    " from user a ",
            nativeQuery = true)
    long getTotalOfUsers();

//    List<User> getAllUsers(int index);
}
