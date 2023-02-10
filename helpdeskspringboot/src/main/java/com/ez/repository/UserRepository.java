package com.ez.repository;

import com.ez.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

//    User findUserByUsername(String username);

    // get user by email
    User findUserByEmail(String email);
}
