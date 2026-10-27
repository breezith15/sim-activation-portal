package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Sim;

public interface SimRepository extends JpaRepository<Sim, Integer> {

    Optional<Sim> findBySimNumber(String simNumber);

    Optional<Sim> findByIccid(String iccid);

    Optional<Sim> findByImei(String imei);

    long countByActive(boolean active);
}