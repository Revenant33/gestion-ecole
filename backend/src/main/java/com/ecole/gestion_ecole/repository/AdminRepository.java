package com.ecole.gestion_ecole.repository;

import com.ecole.gestion_ecole.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}