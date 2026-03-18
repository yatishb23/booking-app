package com.yatish.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"email", "tenant_id"}),
        @UniqueConstraint(columnNames = {"provider", "provider_id"})
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tenant_id")
    private UUID tenantId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    // ✅ NOW NULLABLE
    @Column(name = "password_hash", nullable = true)
    private String passwordHash;

    @Column(nullable = false)
    private String role;

    private String locale;

    @Column(name = "referral_code", unique = true)
    private String referralCode;

    @Column(name = "mfa_secret_enc")
    private String mfaSecretEnc;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    // 🔥 NEW FIELDS FOR OAUTH
    @Column(name = "provider")
    private String provider;

    @Column(name = "provider_id")
    private String providerId;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}