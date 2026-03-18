package com.yatish.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yatish.model.User;

public interface UserRepository extends JpaRepository<User, Integer>{

	User findByEmail(String email);

	boolean existsByReferralCode(String code);

}
