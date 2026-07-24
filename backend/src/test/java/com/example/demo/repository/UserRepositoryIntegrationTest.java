package com.example.demo.repository;

import com.example.demo.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class UserRepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @Transactional
    void savesAndFindsUserUsingTheH2TestDatabase() {
        User user = new User("candidate@example.com", "hashed-password", "local", null);
        userRepository.saveAndFlush(user);

        assertTrue(userRepository.findByEmail("candidate@example.com").isPresent());
        assertTrue(userRepository.existsByEmail("candidate@example.com"));
    }
}
