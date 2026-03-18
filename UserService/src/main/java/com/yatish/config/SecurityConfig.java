package com.yatish.config;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.yatish.model.User;
import com.yatish.repository.UserRepository;

@Configuration
public class SecurityConfig {
	
	@Autowired
	private UserRepository userRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()   // allow everything
            )
            .csrf(csrf -> csrf.disable()); // disable csrf

        return http.build();
    }
    
    @Bean
    public CommandLineRunner loadDefaultUsers() {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            if (userRepository.findByEmail("yatish@gmail.com")==null) {
                User admin = User.builder()
                        .fullName("Yatish Admin")
                        .email("yatish@gmail.com")
                        .passwordHash(encoder.encode("123"))
                        .role("ADMIN")
                        .isActive(true)
                        .locale("en-IN")
                        .tenantId(UUID.randomUUID())
                        .build();
                userRepository.save(admin);
                System.out.println("✅ Created ADMIN: yatish@gmail.com / 123");
            }

            // ----- User 2: USER -----
            if (userRepository.findByEmail("rahul@gmail.com")==null) {
                User user = User.builder()
                        .fullName("Rahul Sharma")
                        .email("rahul@gmail.com")
                        .passwordHash(encoder.encode("123"))
                        .role("USER")
                        .isActive(true)
                        .locale("en-IN")
                        .tenantId(UUID.randomUUID())
                        .build();
                userRepository.save(user);
                System.out.println("✅ Created USER: rahul@gmail.com / 123");
            }

            if (userRepository.findByEmail("priya@gmail.com")==null) {
                User organizer = User.builder()
                        .fullName("Priya Verma")
                        .email("priya@gmail.com")
                        .passwordHash(encoder.encode("123"))
                        .role("ORGANIZER")
                        .isActive(true)
                        .locale("en-IN")
                        .tenantId(UUID.randomUUID())
                        .build();
                userRepository.save(organizer);
                System.out.println("✅ Created ORGANIZER: priya@gmail.com / 123");
            }
        };
    }
}
